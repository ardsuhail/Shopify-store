"use client"

import React, { useState } from 'react'
import { Minus, Plus } from 'lucide-react'

const QuantityCounter = ({ quantity = 1, setQuantity }) => {

  const handleDecrease = () => {
    if (!setQuantity) return
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleIncrease = () => {
    if (!setQuantity) return
    if (quantity < 10) {
      setQuantity(quantity + 1)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-base font-semibold text-gray-900 whitespace-nowrap">
        Quantity:
      </span>
      
      <div className="flex items-center gap-3 border border-gray-300 rounded-xl px-4 py-3 bg-white shadow-sm hover:shadow-md transition-all duration-200">
        <button
          onClick={handleDecrease}
          disabled={quantity <= 1}
          className={`flex items-center justify-center w-6 h-6 rounded-full transition-all duration-200 ${
            quantity <= 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50'
          }`}
        >
          <Minus className="w-4 h-4" />
        </button>
        
        <span className="w-8 text-center font-bold text-gray-900 text-lg select-none">
          {quantity}
        </span>
        
        <button
          onClick={handleIncrease}
          disabled={quantity >= 10}
          className={`flex items-center justify-center w-6 h-6 rounded-full transition-all duration-200 ${
            quantity >= 10
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50'
          }`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default QuantityCounter