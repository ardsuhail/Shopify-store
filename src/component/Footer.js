"use client"
import React from 'react'
import Link from 'next/link'
import { Github, Instagram, Facebook, Mail, Phone, MapPin, Shield, Truck, CreditCard, Gift } from 'lucide-react'
import NewsLatter from './NewsLatter'
import { 
  SiVisa, 
  SiMastercard, 
  SiPaypal, 
  SiAmericanexpress,
  SiGooglepay,
  SiPhonepe,
  SiRazorpay,
  SiAmazonpay,
  SiPaytm,
  SiUpcloud
} from "react-icons/si";
const Footer = () => {
    return (
        <footer className="bg-gradient-to-br from-slate-100 to-slate-300 text-gray-800 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 25px 25px, #000 2%, transparent 0%), radial-gradient(circle at 75px 75px, #000 2%, transparent 0%)`,
                    backgroundSize: '100px 100px'
                }}></div>
            </div>

            {/* Trust Badges Section */}
            <div className="relative bg-white/80 backdrop-blur-sm border-b border-gray-200 py-6">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col  text-start md:text-center mb-6">
                        <h3 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                            Trusted & Secure Shopping
                        </h3>
                        <p className="text-gray-600 text-sm">100% Safe & Secure Payments</p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                            <Shield className="w-8 h-8 text-green-600 mb-2" />
                            <span className="text-sm font-semibold text-gray-800">Secure Payment</span>
                            <span className="text-xs text-gray-600 mt-1">256-bit SSL</span>
                        </div>
                        
                        <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                            <Truck className="w-8 h-8 text-blue-600 mb-2" />
                            <span className="text-sm font-semibold text-gray-800">Free Shipping</span>
                            {/* <span className="text-xs text-gray-600 mt-1">Above ₹999</span> */}
                        </div>
                        
                        <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                            <CreditCard className="w-8 h-8 text-purple-600 mb-2" />
                            <span className="text-sm font-semibold text-gray-800">Easy Returns</span>
                            <span className="text-xs text-gray-600 mt-1">7-Day Policy</span>
                        </div>
                        
                        <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                            <Gift className="w-8 h-8 text-orange-600 mb-2" />
                            <span className="text-sm font-semibold text-gray-800">Gift Cards</span>
                            <span className="text-xs text-gray-600 mt-1">Available</span>
                        </div>
                    </div>
                </div>
            </div>

        {/* Payment Methods */}


{/* Payment Methods */}
<div className="relative bg-gradient-to-r from-slate-800 to-slate-900 py-8 border-t border-b border-gray-700">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-6">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-2 text-gray-300">
                Secure Payment Methods
            </h4>
            <p className="text-gray-400 text-xs">100% Safe & Encrypted Transactions</p>
        </div>
        
        <div className="relative overflow-hidden">
            <div className="flex animate-scroll justify-center items-center gap-8">
                {/* Duplicate for seamless loop */}
                {[...Array(2)].map((_, setIndex) => (
                    <div key={setIndex} className="flex gap-8 pr-8">
                        {/* Visa */}
                        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="w-20 h-12 flex items-center justify-center">
                                <SiVisa className="text-3xl  w-14 h-14 text-blue-900" />
                            </div>
                        </div>
                        
                        {/* Mastercard */}
                        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="w-20 h-12 flex items-center justify-center">
                                <SiMastercard className=" w-14 h-14 text-red-600" />
                            </div>
                        </div>
                        
                        {/* PayPal */}
                        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="w-20 h-12 flex items-center justify-center">
                                <SiPaypal className=" w-14 h-14 text-blue-700" />
                            </div>
                        </div>
                        
                        {/* American Express */}
                        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="w-20 h-12 flex items-center justify-center">
                                <div className="text-blue-800 flex gap-1 items-center justify-center">
                                    <CreditCard className="w-8 h-8 mb-1" />
                                    <span className="text-lg font-bold">AMEX</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Razorpay */}
                        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="w-20 h-12 flex items-center justify-center">
                                <SiRazorpay className=" w-14 h-14 text-blue-600" />
                            </div>
                        </div>
                        
                        {/* PhonePe */}
                        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="w-20 h-12 flex items-center justify-center">
                                <SiPhonepe className=" w-14 h-14 text-purple-600" />
                            </div>
                        </div>
                        
                        {/* Google Pay */}
                        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="w-20 h-12 flex items-center justify-center">
                                <SiGooglepay className=" w-15 h-15 text-black" />
                            </div>
                        </div>
                        
                        {/* UPI */}
                        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="w-20 h-12 flex items-center justify-center">
                                <div className="text-green-600 flex gap-1 items-center justify-center">
                                    <svg className="w-8 h-8 mb-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                                    </svg>
                                    <span className="text-lg font-bold">UPI</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Gradient overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-800 to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-800 to-transparent z-10"></div>
        </div>
        
        <div className="flex justify-center items-center gap-4 mt-6">
            <div className="flex items-center gap-2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-xs">SSL Secure</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-xs">256-bit Encryption</span>
            </div>
        </div>
    </div>

    <style jsx>{`
        @keyframes scroll {
            0% {
                transform: translateX(0);
            }
            100% {
                transform: translateX(-50%);
            }
        }
        .animate-scroll {
            animation: scroll 25s linear infinite;
            display: flex;
            width: max-content;
        }
        .animate-scroll:hover {
            animation-play-state: paused;
        }
    `}</style>
</div>
            {/* Main Footer Content */}
            <div className="relative container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Company Info */}
                    <div className="lg:col-span-1">
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                Shopovix
                            </h3>
                            <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                                Your trusted partner for quality products with fast delivery and exceptional customer service.
                            </p>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="w-4 h-4 text-emerald-600" />
                                <span>support@shopovix.com</span>
                            </div>
                            {/* <div className="flex items-center gap-3 text-sm">
                                <Phone className="w-4 h-4 text-emerald-600" />
                                <span>+91 1800-123-4567</span>
                            </div> */}
                            {/* <div className="flex items-start gap-3 text-sm">
                                <MapPin className="w-4 h-4 text-emerald-600 mt-0.5" />
                                <span>Mumbai, Maharashtra, India - 400001</span>
                            </div> */}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 relative inline-block group">
                            Quick Links
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full"></span>
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { href: "/about", label: "About Us" },
                                { href: "/products", label: "Shop All" },
                                { href: "/collections", label: "Categories" },
                                { href: "/contact", label: "Contact Us" },
                                { href: "/faqs", label: "FAQs" }
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link 
                                        href={link.href} 
                                        className="text-gray-600 hover:text-emerald-600 transition-colors duration-200 flex items-center group"
                                    >
                                        <span className="w-1 h-1 bg-emerald-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 relative inline-block group">
                            Customer Care
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full"></span>
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { href: "/return-refund-policy", label: "Return & Refund Policy" },
                                { href: "/shipping-info", label: "Shipping Information" },
                                { href: "/payment-options", label: "Payment Options" },
                                { href: "/terms-&-conditions", label: "Terms & Conditions" },
                                { href: "/privacy-policy", label: "Privacy Policy" },
                                { href: "/track-your-order", label: "Track Your Order" }
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link 
                                        href={link.href} 
                                        className="text-gray-600 hover:text-emerald-600 transition-colors duration-200 flex items-center group"
                                    >
                                        <span className="w-1 h-1 bg-emerald-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social & Newsletter */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 relative inline-block group">
                            Stay Connected
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full"></span>
                        </h3>
                        
                        {/* Social Links */}
                        <div className="mb-6">
                            <p className="text-gray-600 text-sm mb-4">Follow us for updates and offers</p>
                            <div className="flex gap-4">
                                {[
                                    { href: "https://www.instagram.com/shopovix", icon: Instagram, color: "hover:text-pink-500" },
                                    { href: "https://www.facebook.com/profile.php?id=61575117012652", icon: Facebook, color: "hover:text-blue-600" },
                                    { href: "https://github.com", icon: Github, color: "hover:text-gray-700" }
                                ].map((social, index) => (
                                    <Link
                                        key={index}
                                        target="_blank"
                                        href={social.href}
                                        className={`bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 ${social.color}`}
                                    >
                                        <social.icon className="w-5 h-5" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Newsletter */}
                       <NewsLatter/>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="relative border-t border-gray-300/50">
                <div className="container mx-auto px-6 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center">
                        <div className="text-sm text-gray-600">
                            © 2025 Shopovix . All Rights Reserved.
                        </div>
                        <div className="flex gap-6 text-xs text-gray-500">
                            <Link href="/privacy-policy" className="hover:text-emerald-600 transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/terms-&-conditions" className="hover:text-emerald-600 transition-colors">
                                Terms of Service
                            </Link>
                            <Link href="/sitemap" className="hover:text-emerald-600 transition-colors">
                                Sitemap
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer