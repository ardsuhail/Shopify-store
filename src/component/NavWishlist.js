"use client"
import React from 'react'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Heart } from 'lucide-react'
const NavWishlist = () => {
    const { data: session, status } = useSession();
    const [wishlistIds, setWishlistIds] = useState([]);
    const [productDetails, setProductDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (status === "loading") return;
        
        if (status !== "authenticated") {
          setLoading(false);
          return;
        }
    
        const fetchWishlist = async () => {
          try {
            setLoading(true);
            const res = await fetch("/api/wishlist");
            const data = await res.json();
            
            console.log("Wishlist API Response:", data);
            
            if (data.success && data.wishlist && data.wishlist.products) {
              const productIds = data.wishlist.products;
              setWishlistIds(productIds);
              
           
            } else {
              setWishlistIds([]);
              setProductDetails([]);
            }
          } catch (error) {
            console.error("Failed to fetch wishlist:", error);
            setError("Failed to load your wishlist. Please try again.");
          } finally {
            setLoading(false);
          }
        };
    
        fetchWishlist();
      }, [status]);
  return (
    <div>
          <button className="relative p-2 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-110 group">
                  <Heart className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors duration-300" />
                  <span className=" hidden lg:flex  absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full  items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                    {wishlistIds.length}
                  </span>
                 {wishlistIds.length>0?(

                <span className=" flex lg:hidden  absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full  items-center justify-center ">
                    {wishlistIds.length}
                  </span>
                   ):("")} 
                </button>
    </div>
  )
}

export default NavWishlist
