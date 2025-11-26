import { getProductsByCollection } from '@/server/actions/getProductsByCollection'
import { getCollections } from '@/server/actions/getCollections'
import { getProductById } from '@/server/actions/getProductById'
import { getCollectionsForProduct } from '@/server/actions/getCollectionsForProduct'
import Link from 'next/link'
import Image from 'next/image'
import { Star, ShoppingBag, Truck, Shield, RotateCcw } from 'lucide-react'
import AddToCartBtn from './AddToCartBtn'
import Reviews from './Reviews' // Reviews component import karo

function formatPrice(price) {
    if (!price) return '₹0.00'
    const n = parseFloat(price.toString().replace(/[^\d.]/g, ''))
    if (isNaN(n)) return '₹0.00'
    return `₹${n.toFixed(2)}`
}

// Reviews ko separately fetch karne ka function
async function getProductRatings(productId) {
    try {
        const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/reviews/${productId}`, {
            next: { revalidate: 60 } // 60 seconds cache
        })
        const data = await response.json()
        
        if (data.reviews && data.reviews.length > 0) {
            const average = data.reviews.reduce((acc, r) => acc + r.rating, 0) / data.reviews.length
            return {
                rating: parseFloat(average.toFixed(1)),
                count: data.reviews.length
            }
        } else {
            return {
                rating: null,
                count: 0
            }
        }
    } catch (error) {
        console.error(`Error fetching reviews for ${productId}:`, error)
        return {
            rating: null,
            count: 0
        }
    }
}

export default async function RelatedProducts({ currentProduct, currentProductId, productType }) {
    let relatedProducts = []

    // Normalize input: if only id is provided, fetch the full product
    let productObj = currentProduct || null
    try {
        if (!productObj && currentProductId) {
            productObj = await getProductById(currentProductId)
        }
    } catch (err) {
        console.error('Error fetching current product for related list:', err)
        productObj = null
    }
    
    try {
        // Strategy 1: Find collections that include this product, then fetch products from the first collection
        if (productObj) {
            const pid = String(productObj.id || productObj.product_id || currentProductId)
            const collectionIds = await getCollectionsForProduct(pid)
            if (collectionIds && collectionIds.length > 0) {
                relatedProducts = await getProductsByCollection(collectionIds[0])
            }
        }
        // Strategy 2: Use passed productType prop (preferred when productObj missing)
        if ((!relatedProducts || relatedProducts.length === 0) && (productType || (productObj && productObj.product_type))) {
            const typeToMatch = (productType || (productObj && productObj.product_type) || '').toLowerCase()
            if (typeToMatch) {
                const allCollections = await getCollections()
                const matchingCollection = allCollections.find(
                    coll => coll.title && coll.title.toLowerCase().includes(typeToMatch)
                )
                if (matchingCollection) {
                    relatedProducts = await getProductsByCollection(matchingCollection.id)
                }
            }
        }
        
        // Current product ko filter karo (use productObj which may be fetched)
        const currentId = productObj ? (productObj.id || productObj.product_id || currentProductId) : null
        relatedProducts = relatedProducts
            ?.filter(product => {
                if (!product) return false
                // product.id from Shopify is numeric; normalize to string for comparison
                const pid = String(product.id || product.product_id || '')
                return currentId ? pid !== String(currentId) : true
            })
            ?.slice(0, 4) || []

    } catch (error) {
        console.error('Related products fetch error:', error)
        relatedProducts = []
    }

    // Sabhi related products ke ratings fetch karo
    const productsWithRatings = await Promise.all(
        relatedProducts.map(async (product) => {
            const ratings = await getProductRatings(product.id)
            return {
                ...product,
                ratings
            }
        })
    )

    if (relatedProducts.length === 0) {
        return null
    }

    return (
        <section className="max-w-6xl mx-auto mt-16 py-8 border-t">
            <div className="flex items-center relative justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">You May Also Like</h2>
                    <p className="text-gray-600 mt-2">Customers also bought these products</p>
                </div>
                <Link 
                    href="/products" 
                    className="text-emerald-600 hover:text-emerald-700 absolute right-2 top-1 sm:relative sm:right-0  font-medium flex items-center gap-0  sm:gap-2"
                >
                    View All
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1  sm:gap-6">
                {productsWithRatings.map((product) => (
                    <div 
                        key={product.id}
                        className="group bg-white  md:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
                    >
                        <Link href={`/products/${product.id}`}>
                            <div className="relative aspect-square overflow-hidden bg-gray-100">
                                <Image
                                    src={product.image?.src || product.images?.[0]?.src || '/placeholder.jpg'}
                                    alt={product.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                />
                                
                                {/* Quick Action Button */}
                                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <button className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-300">
                                        <ShoppingBag className="w-4 h-4 text-gray-700" />
                                    </button>
                                </div>

                                {/* Discount Badge */}
                                {product.variants?.[0]?.compare_at_price >0? (
                                    <div className="absolute top-3 left-3">
                                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                            Save  {Math.round(((parseFloat(product.variants[0].compare_at_price) - parseFloat(product.variants[0].price)) / parseFloat(product.variants[0].compare_at_price)) * 100)}%
                                        </span>
                                    </div>
                                ): null}
                            </div>

                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                                    {product.title}
                                </h3>
                                
                                {/* Rating - Real ratings use karo */}
                                <div className="flex items-center gap-1 mt-2">
                                    <div className="flex">
                                        {[1,2,3,4,5].map((star) => (
                                            <Star 
                                                key={star}
                                                className={`w-3 h-3 ${
                                                    product.ratings.rating && star <= Math.round(product.ratings.rating) 
                                                        ? 'text-yellow-400 fill-yellow-400' 
                                                        : 'text-gray-300'
                                                }`} 
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs text-gray-500 ml-1">
                                        ({product.ratings.count > 0 ? product.ratings.count : 'No'} reviews)
                                    </span>
                                </div>

                                {/* Pricing */}
                                <div className="flex items-center gap-2 mt-3">
                                    <span className="text-lg font-bold text-gray-900">
                                        {formatPrice(product.variants?.[0]?.price || product.price)}
                                    </span>
                                    {product.variants?.[0]?.compare_at_price && (
                                        <span className="text-sm text-gray-500 line-through">
                                            {formatPrice(product.variants[0].compare_at_price)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>

                        {/* Quick Add Button (outside Link so clicks don't navigate) */}
                        <div className="p-4">
                            <AddToCartBtn product={product} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Reviews Section - Agar chahiye toh yahan bhi add kar sakte ho */}
            {/* <div className="mt-12">
                <Reviews ProductId={currentProductId} ProductTitle={productObj?.title} />
            </div> */}

            {/* Trust Banner */}
            <div className="mt-12 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-6 border border-emerald-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="flex flex-col items-center">
                        <Truck className="w-8 h-8 text-emerald-600 mb-2" />
                        <h4 className="font-semibold text-gray-900">Free Shipping</h4>
                        <p className="text-sm text-gray-600">On every orders</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <Shield className="w-8 h-8 text-emerald-600 mb-2" />
                        <h4 className="font-semibold text-gray-900">Secure Payment</h4>
                        <p className="text-sm text-gray-600">100% protected</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <RotateCcw className="w-8 h-8 text-emerald-600 mb-2" />
                        <h4 className="font-semibold text-gray-900">Easy Returns</h4>
                        <p className="text-sm text-gray-600">30-day guarantee</p>
                    </div>
                </div>
            </div>
        </section>
    )
}