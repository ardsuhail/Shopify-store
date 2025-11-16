"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getCollections } from "@/server/actions/getCollections";
import { getFeaturedProducts } from "@/server/actions/getFeaturedProducts";
import getTrendingProducts from "@/server/actions/getTrendingProducts";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { useAppContext } from '@/component/Context'
import HeroSection from "@/component/HeroSection";
import ReactStars from "react-stars";
export default function HomePage() {
  const [collections, setCollections] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [trendingProducts, setTrendingProducts] = useState([])
  const [wishlist, setWishlist] = useState([]);
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [revLoading, setRevLoading] = useState(false);
const [productRatings, setProductRatings] = useState({});
  const { addToCart } = useAppContext();

  // Fetch collections
  useEffect(() => {
    setLoading(true);
    async function fetchCollections() {
      const data = await getCollections();
      setLoading(false);
      setCollections(data);
    }
    fetchCollections();
  }, []);

  // Fetch featured products
  useEffect(() => {
    setLoading(true);
    async function fetchFeaturedProducts() {
      const data = await getFeaturedProducts();
      setLoading(false);
      setFeaturedProducts(data);
    }
    fetchFeaturedProducts();
  }, []);

  // Fetch trending products
  useEffect(() => {
    setLoading(true);
    async function fetchTrendingProducts() {
      const data = await getTrendingProducts();
      setLoading(false);
      setTrendingProducts(data)
    }
    fetchTrendingProducts()
  }, [])

 // Fetch product ratings for all trending products
  useEffect(() => {
    if (trendingProducts.length === 0) return;

    const fetchAllRatings = async () => {
      setLoading(true);
      const ratings = {};

      for (const product of trendingProducts) {
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
              rating: null, // No rating
              count: 0
            };
          }
        } catch (error) {
          console.error(`Error fetching reviews for ${product.id}:`, error);
          ratings[product.id] = {
            rating: null, // No rating on error too
            count: 0
          };
        }
      }

      setProductRatings(ratings);
      setLoading(false);
    };

    fetchAllRatings();
  }, [trendingProducts]);

  // Handle wishlist toggle for trending products
  const handleTrendingLike = async (product) => {
    if (!product?.id) {
      setError("Product ID not found");
      return;
    }

    setLoading(true);
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
      console.log("Wishlist operation result:", result);

      if (result.success) {
        setWishlist(prev =>
          isInWishlist
            ? prev.filter(id => id !== product.id)
            : [...prev, product.id]
        );
      } else {
        setError(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Wishlist error:", error);
      setError("Server error, please try again");
    } finally {
      setLoading(false);
    }
  };
  const ProductId = trendingProducts.id;
  useEffect(() => {
    if (!ProductId) return;
    setRevLoading(true)
    fetch(`/api/reviews/${ProductId}`)
      .then((res) => res.json())
      .then((data) => {
        setReviews(data.reviews || []);
        setRevLoading(false)
      })
      .catch((err) => console.error("Error fetching reviews:", err));
  }, [ProductId]);
      const averageRating = (reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0).toFixed(1)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 🎉 Continuous Scrolling Announcement Bar */}
      <div className="w-full bg-gradient-to-r from-green-500 via-emerald-600 to-teal-500 text-white py-3 overflow-hidden relative group">
  <div className="flex animate-marquee-infinite whitespace-nowrap items-center">
    {[...Array(8)].map((_, index) => (
      <div key={index} className="flex items-center mx-6 sm:mx-8">
        {/* Left Icon */}
        <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
        </svg>
        
        {/* Text Content */}
        <span className="text-sm sm:text-base font-bold tracking-wide whitespace-nowrap">
          FESTIVE SALE LIVE NOW
        </span>
        
        {/* Badge */}
        <span className="bg-white text-green-600 px-3 py-1 rounded-full text-xs sm:text-sm font-black mx-3 border-2 border-white/30">
          FLAT 30% OFF
        </span>
        
        {/* Text Content */}
        <span className="text-sm sm:text-base font-bold tracking-wide whitespace-nowrap">
          ON ALL CATEGORIES
        </span>
        
        {/* Right Icon */}
        <svg className="w-5 h-5 ml-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
        </svg>
      </div>
    ))}
  </div>
  
  {/* Premium gradient fade edges */}
  <div className="absolute left-0 top-0 w-24 sm:w-32 h-full bg-gradient-to-r from-green-500 to-transparent z-10 pointer-events-none"></div>
  <div className="absolute right-0 top-0 w-24 sm:w-32 h-full bg-gradient-to-l from-teal-500 to-transparent z-10 pointer-events-none"></div>
</div>
      {/* 🖼️ Hero Section */}
      <section>
        <HeroSection />
      </section>

      {/* 🔥 Quick Stats Banner */}
      <section className="bg-white py-8 shadow-lg border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-3 rounded-full mb-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800">Free Shipping</h3>
              <p className="text-sm text-gray-600">Above ₹999</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-green-100 p-3 rounded-full mb-2">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800">Secure Payment</h3>
              <p className="text-sm text-gray-600">100% Protected</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-purple-100 p-3 rounded-full mb-2">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800">Easy Returns</h3>
              <p className="text-sm text-gray-600">7 Days Policy</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-orange-100 p-3 rounded-full mb-2">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800">24/7 Support</h3>
              <p className="text-sm text-gray-600">Always Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* 🛒 Shop by Category */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <div className="relative inline-block mb-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 relative z-10">
              Shop By Category
            </h2>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
          </div>

          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Explore our carefully curated collections designed for every aspect of your modern lifestyle
          </p>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-10 sm:mb-12">
            <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-lg border border-emerald-100">
              <span className="text-emerald-600">⭐</span>
              <span className="text-sm font-medium text-emerald-700">Premium Quality</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-100">
              <span className="text-blue-600">🚚</span>
              <span className="text-sm font-medium text-blue-700">Fast Shipping</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg border border-purple-100">
              <span className="text-purple-600">↩️</span>
              <span className="text-sm font-medium text-purple-700">Easy Returns</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-100">
              <span className="text-green-600">🛡️</span>
              <span className="text-sm font-medium text-green-700">Secure Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
          {loading ? (
            <div className="col-span-2 lg:col-span-4 flex flex-col justify-center items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500 text-sm mt-2">We're fetching collections..</p>
            </div>
          ) : (
            <>
              {collections
                .filter((item) =>
                  item.title.toLowerCase() !== "featured collection" &&
                  item.title.toLowerCase() !== "trending products"
                )
                .slice(0, 4)
                .map((item) => (
                  <Link
                    href={`/collections/${item.id}`}
                    key={item.id}
                    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 border border-gray-100 relative"
                  >
                    <div className="relative overflow-hidden aspect-[4/3]">
                      <img
                        src={item.image?.src}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>

                    <div className="p-4 sm:p-5 text-center">
                      <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors duration-300 text-sm sm:text-base lg:text-lg mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-500 text-xs sm:text-sm font-medium">
                        Shop Collection
                      </p>
                    </div>
                  </Link>
                ))}
            </>
          )}
        </div>

        <div className="text-center">
          <Link
            href="/collections"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group"
          >
            <span>View All Collections</span>
            <svg
              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>

          <p className="text-gray-500 text-sm mt-6 flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Trusted by 10,000+ customers
          </p>
        </div>
      </section>

      {/* 🏷️ Featured Products */}
      <section className="py-3 sm:py-16 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Featured Products
          </h2>
          <p className="text-gray-600 text-lg">Handpicked items just for you</p>
        </div>

        {loading ? (
          <div className="col-span-2 lg:col-span-4 flex flex-col justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500 text-sm mt-2">Loading featured products..</p>
          </div>
        ) : (
          <>
            <div className="grid grid-flow-col auto-cols-[minmax(150px,1fr)] sm:auto-cols-[minmax(260px,1fr)] gap-4 overflow-x-auto pb-3 scrollbar-hide scroll-smooth snap-x snap-mandatory">
              {featuredProducts.map((item) => (
                <Link
                  href={`/products/${item.id}`}
                  key={item.id}
                  className="bg-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 overflow-hidden group snap-start"
                >
                  <div className="relative bg-gray-50 flex items-center aspect-auto justify-center">
                    <Image
                      width={100}
                      height={100}
                      src={item.image?.src}
                      alt={item.title}
                      className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />

                    <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      SALE
                    </div>

                    {item.variants[0]?.compare_at_price > 0 ? (
                      <div className="absolute top-2 right-2 bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded">
                        {Math.round(((item.variants[0]?.compare_at_price - item.variants[0]?.price) / item.variants[0]?.compare_at_price) * 100)}% OFF
                      </div>) : ""}
                  </div>

                  <div className="p-3">
                    <h3 className="text-gray-800 font-semibold text-sm mb-1 line-clamp-1">
                      {item.title}
                    </h3>

                    <div className="flex items-center gap-1">
                      <p className="text-green-600 font-bold text-base">
                        ₹{Math.round(item.variants[0]?.price)}
                      </p>
                      <p className="text-gray-400 line-through text-xs">
                        ₹{item.mrp || Math.round(item.variants[0]?.compare_at_price)}
                      </p>
                    </div>

                    <p className="text-gray-500 text-xs mt-0.5">Free Delivery</p>
                  </div>
                </Link>
              ))}
            </div>
          </>)}
      </section>

      {/* 🔥 Trending Now */}
    <section className="py-5 px-1 md:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
          Trending Now
        </h2>
        <p className="text-gray-600 text-lg font-light">Discover what's captivating our community</p>
      </div>

      {loading ? (
        <div className="col-span-2 lg:col-span-4 flex flex-col justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm mt-2">Loading trending products..</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-1 md:gap-6">
            {trendingProducts.map((item) => {
              const isInWishlist = item?.id ? wishlist.includes(item.id) : false;
              const discount = item.variants[0]?.compare_at_price > 0 ?
                Math.round(((item.variants[0]?.compare_at_price - item.variants[0]?.price) / item.variants[0]?.compare_at_price) * 100) : 0;
              
              const productRating = productRatings[item.id] || { rating: null, count: 0 };
              const hasReviews = productRating.count > 0;

              return (
                <div
                  key={item.id}
                  className="bg-white md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200 overflow-hidden group hover:border-orange-200 relative flex flex-col"
                >
                  <Link href={`products/${item.id}`} className="flex-1">
                    <div className="relative overflow-hidden aspect-square">
                      <Image
                        width={300}
                        height={300}
                        src={item.image?.src}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      <div className="absolute top-2 left-2">
                        <span className="bg-orange-500 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-full shadow">
                          🔥 Hot
                        </span>
                      </div>

                      {discount > 0 && (
                        <div className="absolute top-3 right-2 bg-gradient-to-r from-red-500 to-pink-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          {discount}% OFF
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => handleTrendingLike(item)}
                    disabled={loading}
                    className={`absolute bottom-44 sm:bottom-51 sm:right-3 right-1 z-20 p-2 rounded-full transition-all duration-300 shadow-md ${
                      isInWishlist
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-white/90 text-gray-600 hover:bg-white hover:text-red-500"
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart
                      className="w-5 h-5"
                      fill={isInWishlist ? "currentColor" : "none"}
                      strokeWidth={isInWishlist ? 0 : 2}
                    />
                  </button>

                  {/* Cart Button */}
                  <div className="absolute bottom-2 md:bottom-5 md:right-5 lg:bottom-3 right-2 lg:right-3 lg:opacity-0 lg:transform lg:translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-gradient-to-br from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 p-2 md:p-2.5 rounded-lg cursor-pointer z-20 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110"
                    >
                      <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-3 md:p-4 flex-1 flex flex-col">
                    <Link href={`products/${item.id}`} className="flex-1">
                      <h3 className="text-gray-900 font-semibold text-sm md:text-base mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300 leading-tight h-8 sm:h-11 overflow-hidden">
                        {item.title}
                      </h3>
                    </Link>

                    {/* Rating Section - Only show if reviews exist */}
                    <div className="mb-2 min-h-[40px]">
                      {hasReviews ? (
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center gap-2">
                            <ReactStars
                              count={5}
                              size={18}
                              isHalf={true}
                              value={productRating.rating}
                              edit={false}
                              color1="#d1d5db"
                              color2="#f59e0b"
                            />
                            <span className="text-sm text-gray-600 font-medium">
                              ({productRating.rating})
                            </span>
                          </div>
                          <span className="text-gray-500 text-xs">
                            {productRating.count} review{productRating.count !== 1 ? 's' : ''}
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center gap-2">
                            <ReactStars
                              count={5}
                              size={18}
                              isHalf={true}
                              value={0}
                              edit={false}
                              color1="#d1d5db"
                              color2="#d1d5db"
                            />
                          </div>
                          <span className="text-gray-400 text-xs">
                            No reviews yet
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-baseline gap-1 md:gap-2">
                        <p className="text-lg md:text-xl font-bold text-gray-900">
                          ₹{Math.round(item.variants[0]?.price).toLocaleString()}
                        </p>
                        {item.variants[0]?.compare_at_price > 0 && (
                          <p className="text-gray-400 line-through text-xs md:text-sm">
                            ₹{Math.round(item.variants[0]?.compare_at_price).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Free Shipping
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
      {/* 👥 Premium Testimonials Section */}
      <section className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.3) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255,255,255,0.3) 2%, transparent 0%)`,
            backgroundSize: '100px 100px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Voices of <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Satisfaction</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Join thousands of happy customers who trust us for quality products and exceptional service
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {[
              { number: "10K+", label: "Happy Customers" },
              { number: "4.8/5", label: "Average Rating" },
              { number: "98%", label: "Recommend Us" },
              // { number: "2M+", label: "Products Sold" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Anjali Sharma",
                location: "Delhi",
                role: "Fashion Blogger",
                rating: 5,
                comment: "The quality exceeded my expectations! Delivery was super fast - received my order in just 2 days. Will definitely shop again!",
                image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
              },
              {
                name: "Rahul Verma",
                location: "Mumbai",
                role: "Software Engineer",
                rating: 5,
                comment: "Authentic products with perfect packaging. Customer support team is very responsive and helpful. Highly recommended!",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
              },
              {
                name: "Priya Nair",
                location: "Bangalore",
                role: "Interior Designer",
                rating: 5,
                comment: "Product matched the images perfectly. The quality is premium and delivery was on time. Love the attention to detail!",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
              },
              {
                name: "Vikram Singh",
                location: "Chennai",
                role: "Business Owner",
                rating: 5,
                comment: "Best online shopping experience ever! Fast shipping, great packaging, and the product quality is outstanding.",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
              },
              {
                name: "Neha Patel",
                location: "Hyderabad",
                role: "Marketing Manager",
                rating: 5,
                comment: "The customer service team went above and beyond to help me. Product quality is premium and worth every rupee!",
                image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
              },
              {
                name: "Arun Kumar",
                location: "Kolkata",
                role: "College Student",
                rating: 5,
                comment: "Affordable prices with premium quality. Fast delivery and easy return policy. My go-to shopping destination now!",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
              }
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-amber-400/30 transition-all duration-500 group hover:transform hover:-translate-y-2"
              >
                {/* Rating */}
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-gray-200 leading-relaxed mb-6 italic">
                  "{testimonial.comment}"
                </p>

                {/* User Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-amber-400"
                  />
                  <div>
                    <h4 className="font-bold text-white">{testimonial.name}</h4>
                    <p className="text-amber-300 text-sm">{testimonial.role}</p>
                    <p className="text-gray-400 text-xs">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Badge */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-lg rounded-full px-6 py-3 border border-white/20">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-white text-sm font-medium">Rated 4.8/5 by 10,000+ Customers</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}