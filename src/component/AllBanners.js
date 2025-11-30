"use client"
import React from 'react'
import { useState, useEffect } from 'react'

// MidBanner component
const MidBanner = () => {
  const [allBanners, setAllBanners] = useState([])

  useEffect(() => {
    fetch('/api/banner')
      .then(res => res.json())
      .then(data => {
        setAllBanners(data.banner || [])
      })
      .catch(err => {
        console.log("Error fetching banners:", err)
        setAllBanners([])
      })
  }, [])

  const midBanners = allBanners.filter(
    item => item.isActive === true && item.position === "middle"
  )

  // Agar koi mid banner nahi hai toh default show karo
  

  return (
    <div>
      {midBanners.map((item, index) => (
        <div key={index}>
          <img src={item.images} alt={item.altText} style={{width: '100%'}} />
        </div>
      ))}
    </div>
  )
}

// BottomBanner component
const BottomBanner = () => {
  const [allBanners, setAllBanners] = useState([])

  useEffect(() => {
    fetch('/api/banner')
      .then(res => res.json())
      .then(data => {
        setAllBanners(data.banner || [])
      })
      .catch(err => {
        console.log("Error fetching banners:", err)
        setAllBanners([])
      })
  }, [])

  const bottomBanners = allBanners.filter(
    item => item.isActive === true && item.position === "bottom"
  )

 

  return (
    <div>
      {bottomBanners.map((item, index) => (
        <div key={index}>
          <img src={item.images} alt={item.altText} style={{width: '100%'}} />
        </div>
      ))}
    </div>
  )
}

export default MidBanner
export { BottomBanner }