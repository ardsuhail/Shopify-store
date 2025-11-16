"use client"
import React, { useState } from 'react'
import QuantityCounter from './QuantityCounter'
import BuyNowButton from './BuyNowButton'

const ProductActions = ({ product }) => {
  const [quantity, setQuantity] = useState(1)

  return (
    <div className="space-y-4">
      <QuantityCounter quantity={quantity} setQuantity={setQuantity} />
      <BuyNowButton product={product} quantity={quantity} />
    </div>
  )
}

export default ProductActions
