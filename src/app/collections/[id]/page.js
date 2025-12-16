// Server-rendered collection page
import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCollectionById } from '@/server/actions/getCollectionById'
import { getProductsByCollection } from '@/server/actions/getProductsByCollection'
import { Star, Shield, Truck, Heart, ShoppingCart, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import AddToCartBtn from '@/component/AddToCartBtn'
export default async function CollectionPage({ params }) {
    const id = params?.id

    // Fetch collection and products on server
    const collection = await getCollectionById(id)
    if (!collection) {
        return notFound()
    }

    const products = await getProductsByCollection(id)
    // console.log("📊 Products with prices:", products)

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Collection Hero */}
            <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white py-16">
                <div className="container mx-auto px-6">
                    <Link
                        href="/collections"
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-300 mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Collections
                    </Link>

                    <div className="text-center">
                        <h1 className="text-5xl font-bold mb-4">{collection.title}</h1>
                        <p className="text-xl opacity-90 max-w-2xl mx-auto">
                            {collection.description || `Discover our premium ${collection.title} collection with carefully curated products`}
                        </p>

                        <div className="flex flex-wrap justify-center gap-6 mt-8">
                            <div className="bg-white/20 px-4 py-2 rounded-full flex items-center gap-2">
                                <span className="font-semibold">{products?.length ?? 0}</span>
                                Products
                            </div>
                            <div className="bg-white/20 px-4 py-2 rounded-full flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                Premium Quality
                            </div>
                            <div className="bg-white/20 px-4 py-2 rounded-full flex items-center gap-2">
                                <Truck className="w-4 h-4" />
                                Free Shipping
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="py-12">
                <div className="container mx-auto px-1 sm:px-6">
                    {(!products || products.length === 0) ? (
                        <div className="text-center py-16">
                            <div className="text-6xl mb-4">📦</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Products Found</h3>
                            <p className="text-gray-600 mb-6">This collection doesn&apos;t have any products yet.</p>
                            <Link
                                href="/collections"
                                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-300 inline-flex items-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Browse Other Collections
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-between items-center mb-8">
                                <p className="text-gray-600">
                                    Showing <span className="font-semibold">{products.length}</span> products in {collection.title}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1 sm:gap-8">
                                {products.map((product) => {
                                    // Safe price extraction
                                    const price = product.variants?.[0]?.price || product.price || "0.00"
                                    const comparePrice = product.variants?.[0]?.compare_at_price
                                    const formattedPrice = formatPrice(price)
                                    const formattedComparePrice = comparePrice ? formatPrice(comparePrice) : null

                                    return (
                                        <Link
                                        href={`/products/${product.id}`}
                                            key={product.id}
                                            className="bg-white  sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group border border-gray-100"
                                        >
                                            <div className="relative overflow-hidden">
                                                <Image
                                                    width={100}
                                                    height={100}
                                                    src={product.images?.[0]?.src || "/placeholder-product.jpg"}
                                                    alt={product.title}
                                                    className=" w-full sm:h-60 object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                
                                                {/* Sale Badge */}
                                                {formattedComparePrice && (
                                                    <div className="absolute top-3 left-3">
                                                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                                            SALE
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className=" px-1 py-2 sm:py-6  sm:p-6">
                                                <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-emerald-600 transition-colors duration-300 line-clamp-3">
                                                    {product.title}
                                                </h3>

                                               

                                                {/* Price */}
                                                <div className="flex items-center gap-2  mb-4">
                                                    <span className="text-lg sm:text-2xl font-bold text-emerald-600">
                                                        {formattedPrice}
                                                    </span>
                                                    {formattedComparePrice && (
                                                        <span className="text-md sm:text-lg text-gray-500 line-through">
                                                            {formattedComparePrice}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Stock Status */}
                                                <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    In Stock
                                                </div>

                                                {/* <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                                                    <ShoppingCart className="w-4 h-4" />
                                                    Add to Cart
                                                </button> */}
                                                <AddToCartBtn  product={product} />
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-gray-900 to-black text-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-4">Love This Collection?</h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                        Explore more amazing collections and find exactly what you&apos;re looking for.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6">
                        <Link 
                            href="/collections" 
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
                        >
                            Browse All Collections
                        </Link>
                        <Link 
                            href="/products" 
                            className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-colors duration-300"
                        >
                            View All Products
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

// Price formatting helper
function formatPrice(price) {
    if (!price) return "₹0.00";
    
    // Remove any non-numeric characters except decimal point
    const numericPrice = parseFloat(price.toString().replace(/[^\d.]/g, ''));
    
    if (isNaN(numericPrice)) return "₹0.00";
    
    return `₹${numericPrice.toFixed(2)}`;
}