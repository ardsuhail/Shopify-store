"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'
import { useAppContext } from './Context'
const BuyNowButton = ({ product, quantity = 1 }) => {
   const { addToCart } = useAppContext();
    const router = useRouter()

    // const handleBuyNow = () => {
    //     router.push(`/checkout?id=${product.variants[0].id}&quantity=${quantity}`)
    // }
    const variantId = product.variants[0].id



  const handleBuyNow = () => {
    router.push(`/checkout?id=${product.id}&quantity=${quantity}`);
  };

    return (

        <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={()=>addToCart(product)} className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-3 px-6 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
            </button>
             <button 
      onClick={handleBuyNow}
      className="bg-black text-white px-6 py-3 rounded-lg font-semibold"
    >
      Buy Now
    </button>
        </div>

    )
}

export default BuyNowButton
