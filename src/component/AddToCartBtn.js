"use client"
import React from 'react'
import { ShoppingCart } from 'lucide-react'
import { useAppContext } from './Context'
const AddToCartBtn = ({ product}) => {
   const { addToCart } = useAppContext();
  

 
    return (

        <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={()=>addToCart(product)} className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-3 px-1 sm:px-6 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
            </button>
          
        </div>

    )
}

export default AddToCartBtn
