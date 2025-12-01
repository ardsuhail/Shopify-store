"use client";
import React from "react";
import Link from "next/link";
import { SidebarClose, Star, Shield, Truck, RotateCcw } from "lucide-react";
import { useAppContext } from "./Context";
import { usePathname } from "next/navigation";

const NavSidebar = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useAppContext();
  const pathname = usePathname();

  const navLinks = [
    { label: "Home", href: "/", icon: "🏠" },
    { label: "Products", href: "/products", icon: "🛍️" },
    { label: "About", href: "/about", icon: "ℹ️" },
    { label: "Contact", href: "/contact", icon: "📞" },
    { label: "Blog", href: "/blog", icon: "📝" },
    { label: "Offers", href: "/offers", icon: "🎯" },
  ];

  return (
    <>
      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[998] transition-opacity duration-500"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <nav
        className={`fixed top-0 left-0 h-full w-[85vw] max-w-sm
          bg-gradient-to-b from-white to-gray-50/95 backdrop-blur-xl
          border-r border-gray-200/60
          shadow-2xl z-[999]
          flex flex-col transition-all duration-500 ease-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex flex-col p-6 border-b border-gray-200/60 bg-white/80">
          <div className="flex items-center justify-between w-full mb-6">
            {/* Logo */}
            <Link
              href="/"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-3 group"
            >
              <div className="relative">
                <img 
                  className=" w-25 rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg" 
                  src="https://shopovix-ecommerce-wyzu.vercel.app/logo.png" 
                  alt="shopovix" 
                />
                <span className="text-xs ml-2 text-gray-500 font-medium">Premium Store</span>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              </div>
              
            </Link>

            {/* Close Button */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-xl bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 transition-all duration-300 hover:rotate-90 hover:scale-110 shadow-sm"
            >
              <SidebarClose size={24} />
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded-lg border border-emerald-200">
              <Truck className="w-3 h-3 text-emerald-600" />
              <span className="text-emerald-700 font-medium">Free Shipping</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
              <Shield className="w-3 h-3 text-blue-600" />
              <span className="text-blue-700 font-medium">Secure</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg border border-orange-200">
              <Star className="w-3 h-3 text-orange-600" />
              <span className="text-orange-700 font-medium">4.9 Rating</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg border border-purple-200">
              <RotateCcw className="w-3 h-3 text-purple-600" />
              <span className="text-purple-700 font-medium">7-Day Return</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 p-6 overflow-y-auto">
          <ul className="flex flex-col gap-2">
            {navLinks.map(({ label, href, icon }) => {
              const isActive = pathname === href;
              return (
                <li key={label}>
                  <Link
                    href={href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-4 px-4 py-4 rounded-2xl font-semibold transition-all duration-300 group relative overflow-hidden
                      ${isActive
                        ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg shadow-emerald-500/25"
                        : "text-gray-700 hover:text-emerald-600 hover:bg-white hover:shadow-lg border border-transparent hover:border-gray-200"
                      }`}
                  >
                    {/* Icon */}
                    <span className={`text-xl transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : 'text-gray-400'}`}>
                      {icon}
                    </span>
                    
                    {/* Label */}
                    <span className="flex-1">{label}</span>

                    {/* Active Indicator */}
                    {isActive && (
                      <div className="w-2 h-2 bg-white rounded-full ml-2"></div>
                    )}

                    {/* Hover Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isActive ? 'hidden' : ''}`}></div>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Special Offers Section */}
          <div className="mt-8 p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl text-white shadow-lg">
            <div className="text-center">
              <div className="text-sm font-semibold mb-1">SPECIAL OFFER</div>
              <div className="text-xs opacity-90 mb-2">Get 20% off on first order</div>
              <button className="bg-white text-orange-600 text-xs font-bold px-4 py-2 rounded-full hover:bg-gray-100 transition-colors duration-300">
                CLAIM OFFER
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200/60 bg-white/80">
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-3">
              🛡️ Secure & Trusted Shopping
            </div>
            <div className="flex justify-center gap-4 mb-4">
              {['💳', '🔒', '🚚', '⭐'].map((icon, index) => (
                <div key={index} className="text-lg opacity-70 hover:opacity-100 transition-opacity duration-300">
                  {icon}
                </div>
              ))}
            </div>
            <div className="text-[10px] text-gray-400">
              © 2024 Shopovix. Premium E-commerce
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavSidebar;