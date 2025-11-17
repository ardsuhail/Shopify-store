"use client"
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getProducts } from '@/server/actions/getProducts'
import { Star, Filter, Grid, List, ChevronDown, Heart } from 'lucide-react'
import Link from 'next/link'

function SearchResultsLoading() {
    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="md:col-span-1 space-y-4">
                            <div className="h-8 bg-gray-200 rounded"></div>
                            <div className="h-32 bg-gray-200 rounded"></div>
                        </div>
                        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="bg-white rounded-lg p-4">
                                    <div className="h-48 bg-gray-200 rounded mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function SearchResultsContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [viewMode, setViewMode] = useState('grid')
    const [wishlist, setWishlist] = useState([]);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const [productRatings, setProductRatings] = useState({});

    const [selectedCategory, setSelectedCategory] = useState('all')
    const [priceRange, setPriceRange] = useState([0, 1000])
    const [sortBy, setSortBy] = useState('relevance')
    const [showFilters, setShowFilters] = useState(false)

    const searchQuery = searchParams.get('q') || ''
    const categoryFromUrl = searchParams.get('category') || 'all'

    useEffect(() => {
        if (categoryFromUrl) {
            setSelectedCategory(categoryFromUrl)
        }
    }, [categoryFromUrl])

    useEffect(() => {
        async function fetchProducts() {
            try {
                setLoading(true)
                const data = await getProducts()
                setProducts(data)
            } catch (error) {
                console.error("Error fetching products:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    useEffect(() => {
        if (products.length === 0) return;

        const fetchAllRatings = async () => {
            const ratings = {};

            for (const product of products) {
                try {
                    const response = await fetch(`/api/reviews/${product.id}`);
                    const data = await response.json();

                    if (data.reviews && data.reviews.length > 0) {
                        const average = data.reviews.reduce((acc, r) => acc + r.rating, 0) / data.reviews.length;
                        ratings[product.id] = {
                            rating: parseFloat(average.toFixed(1)),
                            count: data.reviews.length
                        };
                    } else {
                        ratings[product.id] = {
                            rating: null,
                            count: 0
                        };
                    }
                } catch (error) {
                    console.error(`Error fetching reviews for ${product.id}:`, error);
                    ratings[product.id] = {
                        rating: null,
                        count: 0
                    };
                }
            }

            setProductRatings(ratings);
        };

        fetchAllRatings();
    }, [products]);

    useEffect(() => {
        let result = [...products]

        // Search filter
        if (searchQuery) {
            result = result.filter(product =>
                product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.body_html?.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        // Category filter
        if (selectedCategory !== 'all') {
            result = result.filter(product => product.product_type === selectedCategory)
        }

        // Price filter
        result = result.filter(product => {
            const price = parseFloat(product.variants?.[0]?.price) || 0
            return price >= priceRange[0] && price <= priceRange[1]
        })

        // Sort products
        result.sort((a, b) => {
            const priceA = parseFloat(a.variants?.[0]?.price) || 0
            const priceB = parseFloat(b.variants?.[0]?.price) || 0
            
            switch (sortBy) {
                case 'price-low':
                    return priceA - priceB
                case 'price-high':
                    return priceB - priceA
                case 'name':
                    return a.title.localeCompare(b.title)
                default:
                    return 0
            }
        })

        setFilteredProducts(result)
    }, [products, searchQuery, selectedCategory, priceRange, sortBy])

    // Get unique categories
    const categories = ['all', ...new Set(products.map(p => p.product_type).filter(Boolean))]

    useEffect(() => {
        fetch("/api/wishlist")
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    const wishlistItems = data.wishlist?.products || [];
                    const productIds = wishlistItems.map(item => item._id || item.id).filter(Boolean);
                    setWishlist(productIds);
                }
            })
            .catch((err) => {
                console.error("Wishlist fetch error:", err);
            });
    }, []);

    // Handle wishlist toggle
    const handleWishlist = async (product) => {
        if (!product?.id) return;

        setWishlistLoading(true);
        const isInWishlist = wishlist.includes(product.id);
        const method = isInWishlist ? "DELETE" : "POST";

        try {
            const response = await fetch("/api/wishlist", {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productId: product.id,
                }),
            });

            const result = await response.json();

            if (result.success) {
                setWishlist(prev =>
                    isInWishlist
                        ? prev.filter(id => id !== product.id)
                        : [...prev, product.id]
                );
            }
        } catch (error) {
            console.error("Wishlist error:", error);
        } finally {
            setWishlistLoading(false);
        }
    };

    // Updated Star rating component with real data
    const StarRating = ({ productId }) => {
        const productRating = productRatings[productId] || { rating: null, count: 0 };
        const hasReviews = productRating.count > 0;

        if (!hasReviews) {
            return (
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className="w-4 h-4 text-gray-300"
                        />
                    ))}
                    <span className="text-sm text-gray-400 ml-1">No reviews</span>
                </div>
            );
        }

        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${
                            star <= Math.floor(productRating.rating) 
                                ? 'text-yellow-400 fill-yellow-400' 
                                : 'text-gray-300'
                        }`}
                    />
                ))}
                <span className="text-sm text-gray-600 ml-1">
                    {productRating.rating} ({productRating.count})
                </span>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="md:col-span-1 space-y-4">
                                <div className="h-8 bg-gray-200 rounded"></div>
                                <div className="h-32 bg-gray-200 rounded"></div>
                            </div>
                            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="bg-white rounded-lg p-4">
                                        <div className="h-48 bg-gray-200 rounded mb-4"></div>
                                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto p-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between">
                        <div className='relative right-16 sm:right-0 mb-6 sm:mb-0'>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Results for &quot;{searchQuery}&quot;
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {filteredProducts.length} products found
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-8 justify-center sm:justify-end">
                            {/* View Toggle */}
                            <div className="flex border border-gray-300 rounded-lg">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 ${viewMode === 'grid' ? 'bg-emerald-500 text-white' : 'bg-white text-gray-600'}`}
                                >
                                    <Grid className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 ${viewMode === 'list' ? 'bg-emerald-500 text-white' : 'bg-white text-gray-600'}`}
                                >
                                    <List className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Sort By */}
                            <div className="flex items-center gap-3 sm:gap-2">
                                <span className="text-gray-700 w-auto sm:w-20">Sort by: </span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none w-30 sm:w-full focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="relevance">Relevance</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="name">Name</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Filters Sidebar */}
                    <div className="md:w-64 bg-white rounded-lg p-6 h-fit sticky top-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">Filters</h2>
                            <button 
                                onClick={() => setShowFilters(!showFilters)}
                                className="md:hidden"
                            >
                                <ChevronDown className={`w-5 h-5 transform ${showFilters ? 'rotate-180' : ''}`} />
                            </button>
                        </div>

                        <div className={`space-y-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
                            {/* Category Filter */}
                            <div>
                                <h3 className="font-medium mb-3">Category</h3>
                                <div className="space-y-2">
                                    {categories.map(category => (
                                        <label key={category} className="flex items-center">
                                            <input
                                                type="radio"
                                                name="category"
                                                value={category}
                                                checked={selectedCategory === category}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                                className="mr-2 text-emerald-500 focus:ring-emerald-500"
                                            />
                                            <span className="text-gray-700 capitalize">
                                                {category === 'all' ? 'All Categories' : category}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Filter */}
                            <div>
                                <h3 className="font-medium mb-3">Price Range</h3>
                                <div className="space-y-4">
                                    <input
                                        type="range"
                                        min="0"
                                        max="1000"
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>${priceRange[0]}</span>
                                        <span>${priceRange[1]}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1">
                        {filteredProducts.length === 0 ? (
                            <div className="bg-white rounded-lg p-8 text-center">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    No products found
                                </h3>
                                <p className="text-gray-600">
                                    Try adjusting your search or filters
                                </p>
                            </div>
                        ) : (
                            <div className={
                                viewMode === 'grid' 
                                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                    : "space-y-4"
                            }>
                                {filteredProducts.map(product => {
                                    const isInWishlist = wishlist.includes(product.id);
                                    const productRating = productRatings[product.id] || { rating: null, count: 0 };
                                    
                                    return (
                                        <div
                                            key={product.id}
                                            className={`bg-white  rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200 group relative ${
                                                viewMode === 'list' ? 'flex gap-4 p-2  sm:p-4 ' : 'p-4'
                                            }`}
                                        >
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleWishlist(product);
                                                }}
                                                disabled={wishlistLoading}
                                                className={`  hidden lg:flex absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-300 ${
                                                    isInWishlist 
                                                        ? 'bg-red-500 text-white' 
                                                        : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
                                                } ${wishlistLoading ? 'opacity-50' : 'opacity-0 group-hover:opacity-100'}`}
                                            >
                                                <Heart
                                                    className="w-4 h-4"
                                                    fill={isInWishlist ? "currentColor" : "none"}
                                                />
                                            </button>

                                            <Link
                                                href={`/products/${product.id}`}
                                                className={`${viewMode === 'list' ? 'flex gap-4 w-full' : ''}`}
                                            >
                                                <div className={
                                                    viewMode === 'list' 
                                                        ? "w-30 sm:w-34 h-30 sm:h-34 flex-shrink-0" 
                                                        : "w-full h-48 mb-4"
                                                }>
                                                    <img
                                                        src={product.image?.src || '/placeholder-image.jpg'}
                                                        alt={product.title}
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                </div>

                                                <div className={viewMode === 'list' ? "flex-1" : ""}>
                                                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                                        {product.title}
                                                    </h3>
                                                    
                                                    {/* Real Star Rating */}
                                                    <StarRating productId={product.id} />
                                                    
                                                    <div className="mt-2">
                                                        <span className="text-2xl font-bold text-gray-900">
                                                            ₹{product.variants?.[0]?.price || 'N/A'}
                                                        </span>
                                                        {product.variants?.[0]?.compare_at_price && (
                                                            <span className="text-sm text-gray-500 line-through ml-2">
                                                                ₹{product.variants?.[0]?.compare_at_price}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {product.product_type && (
                                                        <span className="inline-block bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded mt-2">
                                                            {product.product_type}
                                                        </span>
                                                    )}

                                                  <div className={` flex gap-2 justify-center items-center ${viewMode === 'list' ? "mt-4" : ""}`} >
                                                   <button 
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            // Add your add to cart logic here
                                                        }}
                                                        className="w-full mt-4 bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transition-colors duration-200"
                                                    >
                                                        Add to Cart
                                                    </button>
                                                      <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleWishlist(product);
                                                }}
                                                disabled={wishlistLoading}
                                                className={`mt-3  flex lg:hidden  z-20 p-2 rounded-full transition-all duration-300 ${
                                                    isInWishlist 
                                                        ? 'bg-red-500 text-white' 
                                                        : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
                                                } ${wishlistLoading ? 'opacity-50' : 'opacity-100'}`}
                                            >
                                                <Heart
                                                    className="w-5 h-5"
                                                    fill={isInWishlist ? "currentColor" : "none"}
                                                />
                                            </button>
                                              </div>  
                                                </div>
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function SearchResultsPage() {
    return (
        <Suspense fallback={<SearchResultsLoading />}>
            <SearchResultsContent />
        </Suspense>
    )
}

export default SearchResultsPage