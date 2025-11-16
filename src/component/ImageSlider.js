"use client"
import React from 'react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useAppContext } from '@/component/Context'
import { ShoppingCart, Heart } from 'lucide-react'

const ImageSlider = ({ ProductImages, product }) => {
    const [current, setCurrent] = useState(0)
    const length = ProductImages.length
    const { addToCart } = useAppContext();
    const [wishlist, setWishlist] = useState([]);
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    
    if (!Array.isArray(ProductImages) || ProductImages.length === 0) return null
    
    const nextSlide = () => setCurrent((prev) => (prev + 1) % length)
    const prevSlide = () => setCurrent((prev) => (prev - 1 + length) % length)

    const handleAddToCart = () => {
        if (product) {
            addToCart(product);
        }
    }

    // ✅ Fixed wishlist fetch - Tumhare API structure ke hisab se
    useEffect(() => {
        fetch("/api/wishlist")
            .then((res) => res.json())
            .then((data) => {
                console.log("Wishlist API response:", data); // Debug ke liye
                if (data.success) {
                    // Tumhare API response structure: data.wishlist.products array
                    const wishlistItems = data.wishlist?.products || [];
                    const productIds = wishlistItems.map(item => item._id).filter(Boolean);
                    
                    console.log("Wishlist product IDs:", productIds); // Debug
                    setWishlist(productIds);
                }
            })
            .catch((err) => {
                console.error("Wishlist fetch error:", err);
                setError("Failed to load wishlist");
            });
    }, []);

    // ✅ Fixed like function
    const handleLike = async () => {
        if (!product?.id) { // Shopify products use 'id' not '_id'
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
                    productId: product.id, // Shopify product ID
                }),
            });

            const result = await response.json();
            console.log("Wishlist operation result:", result); // Debug

            if (result.success) {
                setWishlist(prev =>
                    isInWishlist
                        ? prev.filter(id => id !== product.id)
                        : [...prev, product.id]
                );
                alert(isInWishlist ? "Removed from wishlist" : "Added to wishlist");
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

    // Check if product is in wishlist
    const isInWishlist = product?.id ? wishlist.includes(product.id) : false;

    return (
        <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-lg">
            {/* Main Image Container */}
            <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl border border-gray-200 bg-white">
                
                {/* Wishlist Button - Top Right */}
                <button
                    onClick={handleLike}
                    disabled={loading}
                    className={`absolute top-3 right-3 z-20 p-2 rounded-full transition shadow-md ${
                        isInWishlist
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-white/90 text-gray-600 hover:bg-white hover:text-red-500"
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <Heart 
                        className="w-5 h-5" 
                        fill={isInWishlist ? "currentColor" : "none"}
                    />
                </button>

                {/* Image Slider */}
                <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${current * 100}%)` }}
                >
                    {ProductImages.map((img, idx) => (
                        <div
                            key={idx}
                            className="w-full flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white"
                            style={{ width: '100%' }}
                        >
                            <div className="relative w-full md:w-[25vw] max-w-md aspect-auto">
                                <Image
                                    width={400}
                                    height={400}
                                    src={img}
                                    alt={`${product?.title || 'Product'} view ${idx + 1}`}
                                    className="w-full h-full object-cover drop-shadow-2xl"
                                    priority={idx === 0}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Navigation Buttons */}
                <button
                    onClick={prevSlide}
                    className="absolute top-1/2 left-3 -translate-y-1/2 cursor-pointer bg-white/80 p-2 sm:p-3 rounded-full hover:bg-white shadow-md z-10"
                >
                    <img src="/previous.svg" alt="Previous" className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                <button
                    onClick={nextSlide}
                    className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer bg-white/80 p-2 sm:p-3 rounded-full hover:bg-white shadow-md z-10"
                >
                    <img src="/nextimage.svg" alt="Next" className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-3 space-x-2">
                {ProductImages.map((img, idx) => (
                    <span
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full cursor-pointer transition ${idx === current ? "bg-purple-600" : "bg-gray-400"}`}
                    />
                ))}
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex mt-3 gap-3 overflow-x-auto pb-2">
                {ProductImages.map((img, index) => (
                    <div 
                        key={img} 
                        onClick={() => setCurrent(index)} 
                        className={`flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                            index === current ? "border-emerald-500" : "border-transparent hover:border-emerald-300"
                        }`}
                    >
                        <Image
                            width={64}
                            height={64}
                            src={img}
                            alt={`${product?.title || 'Product'} thumbnail ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                        />
                    </div>
                ))}
            </div>

            {/* Error Display */}
            {error && (
                <div className="mt-3 p-2 bg-red-100 text-red-700 rounded text-sm">
                    {error}
                    <button 
                        onClick={() => setError(null)}
                        className="ml-2 text-red-500 hover:text-red-700"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Debug Info - Remove in production */}
            <div className="mt-2 text-xs text-gray-500">
                Product ID: {product?.id} | In Wishlist: {isInWishlist ? "Yes" : "No"} | Total Wishlist Items: {wishlist.length}
            </div>
        </div>
    )
}

export default ImageSlider