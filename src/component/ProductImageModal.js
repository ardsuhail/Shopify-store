"use client"
import React from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'

const ProductImageModal = ({ images, currentIndex, onClose, onNext, onPrev, onThumbClick }) => {
  if (!images || images.length === 0) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-40">
      <div className="relative w-full h-full flex flex-col">
        {/* Header with close button */}
        <div className="absolute top-0 right-0 p-4 z-50">
          <button
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Main image */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full h-full">
            <Image
              src={images[currentIndex]}
              alt={`Product view ${currentIndex + 1}`}
              className="w-full h-full object-contain"
              width={800}
              height={800}
              priority
            />
          </div>
        </div>

        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={onPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-full"
            >
              <img src="/previous.svg" alt="Previous" className="w-6 h-6" />
            </button>
            <button
              onClick={onNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-full"
            >
              <img src="/nextimage.svg" alt="Next" className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Thumbnails */}
        <div className="absolute bottom-0 inset-x-0 bg-black/40 p-4">
          <div className="flex justify-center gap-2 max-w-4xl mx-auto">
            {images.map((img, idx) => (
              <button
                key={img}
                onClick={() => onThumbClick(idx)}
                className={`w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                  idx === currentIndex ? 'border-white' : 'border-transparent hover:border-white/50'
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                  width={64}
                  height={64}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductImageModal