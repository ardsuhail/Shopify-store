"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'
import { useAppContext } from './Context'
const BuyNowButton = ({ product, quantity = 1 }) => {
   const { addToCart } = useAppContext();
    const router = useRouter()

    const handleBuyNow = () => {
        router.push(`/checkout?id=${product.variants[0].id}&quantity=${quantity}`)
    }
    const variantId = product.variants[0].id

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log('Submitting checkout for:', variantId, 'quantity', quantity) // 🧩 DEBUG LINE
        const res = await fetch('/api/createCheckout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ variantId, quantity })
        })
        const data = await res.json()
        console.log('Full Shopify Response:', JSON.stringify(data, null, 2))
        // 🧩 DEBUG LINE
        if (data.url) window.location.href = data.url
    }

    return (

        <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={()=>addToCart(product)} className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-3 px-6 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
            </button>
            <button onClick={handleSubmit} className="bg-gray-900 hover:bg-black text-white py-3 px-6 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 sm:w-auto w-full">
                Buy Now
            </button>
        </div>

    )
}

export default BuyNowButton
