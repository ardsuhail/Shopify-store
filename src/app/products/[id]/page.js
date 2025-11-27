// Server-rendered product page - Premium Design (Fixed)

import React from 'react'
import { notFound } from 'next/navigation'
import { getProductById } from '@/server/actions/getProductById'
import { Star, Shield, Truck, RotateCcw, Check, Heart, Share2, ShoppingCart } from 'lucide-react'
import ImageSlider from '@/component/ImageSlider'
import Reviews from '@/component/Reviews'
import ReviewsDisplay from '@/component/CustomerReviews'
import BuyNowButton from '@/component/BuyNowButton'
import QuantityCounter from '@/component/QuantityCounter'
import ProductActions from '@/component/ProductActions'
import RelatedProducts from '@/component/RelatedProducts'
import PixelViewContent from "@/component/PixelViewContent";

function formatPrice(price) {
    if (!price) return '₹0.00'
    const n = parseFloat(price.toString().replace(/[^\\d.]/g, ''))
    if (isNaN(n)) return '₹0.00'
    return `₹${n.toFixed(2)}`
}


export default async function Page({ params }) {
    const id = params?.id
    const product = await getProductById(id)

    if (!product) {
        return notFound()
    }
    console.log('📦 Product images:', product.images)
    console.log('🖼️ Image structure:', product.image)
    // Temporary test - multiple images manually add karo



    // Normalize image and price fields from Shopify REST response
    const imageSrc = product.image?.src || (product.images && product.images[0]?.src) || product.featured_image || ''
    const images = product.images
        ? product.images.map(img => img.src)
        : [imageSrc]
    const variantPrice = product.variants?.[0]?.price || product.price || null
    const comparePrice = product.variants?.[0]?.compare_at_price
    const discountPercent = comparePrice ? Math.round(((parseFloat(comparePrice) - parseFloat(variantPrice)) / parseFloat(comparePrice)) * 100) : 0
 


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
             <PixelViewContent product={product} />
            {/* Trust Badge Header */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-6 py-3">
                    <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
                        <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-emerald-600" />
                            <span>Free Shipping Over $50</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-emerald-600" />
                            <span>2-Year Warranty</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <RotateCcw className="w-4 h-4 text-emerald-600" />
                            <span>7-Day Returns</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
                    {/* Product Images - Fixed Size */}
                    <div className="space-y-4">
                        <div className="relative group">
                            <div className="absolute top-3 left-3 z-10">
                                {discountPercent > 0 && (
                                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                        Save {discountPercent}%
                                    </span>
                                )}
                            </div>
                            <div className="absolute top-3 right-3 z-10 flex gap-2">
                                {/* <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110">
                                    {/* <Heart className="w-4 h-4 text-gray-700" /> */}
                                {/* </button>
                                    <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110">
                                    <Share2 className="w-4 h-4 text-gray-700" />
                                </button> */} 
                            </div>
                            <ImageSlider product={product} ProductImages={product.images.map(img => img.src)} />

                        </div>

                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        {/* Breadcrumb & Brand */}
                        <div className="space-y-3">
                            <div className="text-sm text-gray-500">
                                Home / Products / <span className="text-emerald-600">{product.product_type || 'Category'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"></div>
                                <span className="text-sm font-medium text-gray-700">Premium Brand</span>
                            </div>
                        </div>

                        {/* Title & Rating */}
                        <div className="space-y-3">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                                {product.title}
                            </h1>
 
                          
                        </div>
                            
                        <Reviews ProductId={id} ProductTitle={product.title} />
                                <div className="space-y-4 pt-4">
                                 <ProductActions product={product} />
                                     </div>

                       
                        {/* Pricing - Fixed */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                                    ₹{product.variants?.[0]?.price || product.price || null}
                                </span>
                                {comparePrice && (
                                    <span className="text-lg text-gray-500 line-through">
                                        ₹{product.variants?.[0]?.compare_at_price || null}
                                    </span>
                                )}
                            </div>
                            {/* {discountPercent > 0 && (
                                <div className="flex items-center gap-2 text-xs sm:text-sm">
                                    <span className="bg-red-50 text-red-600 px-2 py-1 rounded">Limited Time Offer</span>
                                    <span className="text-gray-600">Ends in 02:15:33</span>
                                </div>
                            )} */}
                            
    
                             {/* Buy button moved into ProductActions */}
                      


                        </div>

                        {/* Description with HTML Support */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-gray-900">Product Description</h3>
                            {product.body_html ? (
                                <div
                                    className="text-gray-700 leading-relaxed text-base space-y-3"
                                    dangerouslySetInnerHTML={{ __html: product.body_html }}
                                />
                            ) : (
                                <p className="text-gray-700 leading-relaxed text-base">
                                    Experience unparalleled quality and craftsmanship with our premium product.
                                    Designed for those who appreciate excellence and attention to detail.
                                </p>
                            )}
                        </div>

                        {/* Key Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {['Premium Materials', 'Eco-Friendly', 'Easy Maintenance', 'Lifetime Support'].map((feature, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Check className="w-3 h-3 text-emerald-600" />
                                    </div>
                                    <span className="text-gray-700 font-medium text-sm">{feature}</span>
                                </div>
                            ))}
                        </div>

                    

                        {/* Trust Signals */}
                        <div className="border-t pt-4 space-y-3">
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                <span><strong>Secure Checkout</strong> - Your payment information is protected</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                <span><strong>Free Shipping</strong> - Arrives in 3-5 business days</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <RotateCcw className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                <span><strong>Easy Returns</strong> - 30-day money back guarantee</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Sections */}
                <section className="max-w-6xl mx-auto mt-12">            
             <ReviewsDisplay  ProductId={id} />
                </section>
                <section className="max-w-6xl mx-auto mt-12">            
             <RelatedProducts currentProductId={id} productType={product.product_type} />
                </section>
            </div>
        </div>
    )
}
                  