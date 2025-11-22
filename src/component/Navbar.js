"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Heart, User, ShoppingCart, Menu, X, ChevronDown } from 'lucide-react'
import { useAppContext } from './Context'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Searchbar from './Searchbar'
import NavWishlist from './NavWishlist'
import { MobileSearch } from './Searchbar'
import Cart from './Cart'

const Navbar = () => {
  const { isSidebarOpen, setIsSidebarOpen, setIsCartOpen,cart } = useAppContext()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Blog", href: "/blog" },
    { name: "Offers", href: "/offers" },
  ]

  return (
    <>
      {/* Top Trust Bar */}
      <div className=" z-50 bg-gradient-to-r from-emerald-600 to-blue-600 text-white py-2 px-4 text-xs sm:text-sm">
        <div className="container mx-auto flex gap-8 sm:justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
              🚚 Free Shipping on All Orders
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
              🔒 Secure Payment
            </span>
          </div>
          {/* <div  className="flex items-center ">
            <span><p>✉ support@shopovix.com</p> </span>
          </div> */}
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`sticky pt-2 top-0 z-50 transition-all pb-2 duration-500 ${isScrolled
        ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200'
        : 'bg-slate-100 border-b border-gray-100'
        }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left Section - Logo & Mobile Menu */}
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>

              {/* Logo */}
              <Link
                href="/"
                className="flex text-xl shadow-md rounded-xl mb-2 text-green-700 items-center gap-3 group"
              >
                <div className="relative">


                  <img className='w-30 shadow-md rounded-lg ' src="https://shopovix-ecommerce-wyzu.vercel.app/logo.png" alt="shopovix" />


                  <div className="absolute  inset-0 rounded-xl bg-gradient-to-r from-emerald-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                </div>

              </Link>
            </div>

            {/* Center Section - Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link, index) => (
                <div key={index} className="relative group">
                  <Link
                    href={link.href}
                    className="relative px-4 py-2 text-gray-700 hover:text-emerald-600 font-medium transition-all duration-300 flex items-center gap-1 group"
                  >
                    {link.name}
                    {/* {link.name === "Products" && (
                      <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                    )} */}
                  </Link>

                  {/* Hover underline animation */}
                  <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-300 group-hover:w-4/5 group-hover:left-11 transform -translate-x-1/2"></div>

                  {/* Products Dropdown */}
                  {/* {link.name === "Products" && (
                    <div className="absolute top-full left-0 w-48 bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div className="p-2">
                        {["All Products", "New Arrivals", "Best Sellers", "Sale Items"].map((item, idx) => (
                          <Link
                            key={idx}
                            href={`/products?filter=${item.toLowerCase().replace(' ', '-')}`}
                            className="block px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium"
                          >
                            {item}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )} */}
                </div>
              ))}
            </div>

            {/* Right Section - Search & Icons */}
            {/* <div className="flex items-center gap-3">
              {/* Search Bar */}
              <Searchbar/>
           

              {/* Action Icons */}
              <div className="flex items-center gap-1">
                <Link href={'/user/wishlist'}> 
                <NavWishlist />
                </Link>

                <button onClick={() => setIsCartOpen(true)} className="relative  p-2 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-110 group">
                  <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-emerald-600 transition-colors duration-300" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                    {cart?.length}
                  </span>
                </button>

                <div className="relative">

                  {session ?
                    <> <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="p-2 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-110 group flex items-center gap-1"
                    >
                      <User className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
                    </button>

                      {/* User Dropdown */}
                      {isDropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-200 z-50">
                          <div className="p-2">
                            {["Profile", "orders", "your-reviews", "Wishlist"].map((item, idx) => (
                              <Link
                                key={idx}
                                href={`/user/${item.toLowerCase()}`}
                                className="block px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium"
                              >
                                {item}
                              </Link>
                            ))}
                            <div className="border-t border-gray-200 mt-2 pt-2">
                              <button onClick={()=>signOut('google')} className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium">
                                Sign Out
                              </button>
                            </div>
                          </div>
                        </div>
                      )}</> : <>
                      <button
                        onClick={() => { router.push('/login') }}
                        className="p-2 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-110 group flex items-center gap-1"
                      >
                        <User className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
                      </button>
                    </>}
                </div>
              </div>
            {/* </div> */} 
          </div>
        </div>

        {/* Mobile Search Bar */}
      </nav>
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 py-3">
          <MobileSearch     />
        </div>
    

    

    


    </>
  )
}

export default Navbar