"use client"
import React, { useEffect, useState } from 'react'

const HeroSection = () => {
  const [bannerData, setBannerData] = useState([])
  const [current, setCurrent] = useState(0)
  
  useEffect(() => {
    fetch('/api/banner')
      .then(res => res.json())
      .then(data => {
        const activeBanners = (data.banner || []).filter(
          (item) => item.isActive === true && item.position === 'top'
        );
        
        // Agar koi active banner nahi hai toh default banner use karo
        if (activeBanners.length === 0) {
          setBannerData([{ 
            images: "/banner.png", 
            altText: "Default Banner",
            isActive: true 
          }]);
        } else {
          setBannerData(activeBanners);
        }
      })
      .catch(err => {
        console.log("Error fetching banners, using default:", err);
        // Agar API call fail hoti hai toh bhi default banner show karo
        setBannerData([{ 
          images: "/banner.png", 
          altText: "Default Banner",
          isActive: true 
        }]);
      })
  }, [])

  const imagesLength = bannerData.length

  const nextSlide = () => {
    if (imagesLength > 1) {
      setCurrent((prev) => (prev + 1) % imagesLength)
    }
  }

  const prevSlide = () => {
    if (imagesLength > 1) {
      setCurrent((prev) => (prev - 1 + imagesLength) % imagesLength)
    }
  }

  // 🕒 Auto Slide Effect - sirf tabhi chalega jab 1 se zyada banners honge
  useEffect(() => {
    if (imagesLength > 1) {
      const interval = setInterval(() => {
        nextSlide()
      }, 3000) // har 3 second me slide change hoga
      return () => clearInterval(interval)
    }
  }, [imagesLength])

  return (
    <section className="relative hero w-full overflow-hidden">
      {/* Image wrapper */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {bannerData.map((item, index) => (
          <div
            key={index}
            className="w-full flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white"
          >
            <img
              src={item.images || "/banner.png"}
              alt={item.altText || "banner"}
              className="w-full h-auto object-contain"
              onError={(e) => {
                // Agar image load nahi hoti toh default image use karo
                e.target.src = "/banner.png";
              }}
            />
          </div>
        ))}
      </div>

      {/* Prev/Next buttons - sirf tabhi show karo jab 1 se zyada banners honge */}
      {imagesLength > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/80 p-2 sm:p-3 rounded-full hover:bg-white shadow-md z-10"
          >
            <img src="/previous.svg" alt="Previous" className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/80 p-2 sm:p-3 rounded-full hover:bg-white shadow-md z-10"
          >
            <img src="/nextimage.svg" alt="Next" className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </>
      )}

      {/* Dots indicator - sirf tabhi show karo jab 1 se zyada banners honge */}
      {imagesLength > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {bannerData.map((_, index) => (
            <span
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${index === current ? "bg-purple-600 scale-110" : "bg-gray-400"
                }`}
            ></span>
          ))}
        </div>
      )}
    </section>
  )
}

export default HeroSection