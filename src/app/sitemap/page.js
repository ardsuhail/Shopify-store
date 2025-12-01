"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { 
    Search, 
    ChevronDown, 
    ChevronUp, 
    ShoppingBag, 
    User, 
    HelpCircle, 
    FileText, 
    Truck, 
    Shield,
    Mail,
    CreditCard,
    RotateCcw,
    Globe,
    MapPin,
    Star,
    Heart,
    Package,
    Phone,
    MessageCircle
} from 'lucide-react'

const SitemapPage = () => {
    const [openSections, setOpenSections] = useState({})

    const toggleSection = (section) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }))
    }

    // Sitemap structure - ADMIN PAGE KO EXCLUDE KIYA
    const sitemapSections = [
        {
            id: 'shopping',
            title: 'Shopping & Products',
            icon: <ShoppingBag className="w-6 h-6" />,
            description: 'Browse and purchase our premium products',
            links: [
                { name: 'All Products', href: '/products', description: 'Complete product catalog' },
                { name: 'Collections', href: '/collections', description: 'Curated product collections' },
                { name: 'Wishlist', href: '/user/wishlist', description: 'Your saved items', auth: true },
            ]
        },
        {
            id: 'user',
            title: 'Your Account',
            icon: <User className="w-6 h-6" />,
            description: 'Manage your personal account and activities',
            links: [
                { name: 'Your Profile', href: '/user/profile', description: 'Manage account details', auth: true },
                { name: 'Your Orders', href: '/user/orders', description: 'Order history & tracking', auth: true },
                { name: 'Your Reviews', href: '/user/your-reviews', description: 'Product reviews you wrote', auth: true },
                { name: 'Your Wishlist', href: '/user/wishlist', description: 'Saved favorite items', auth: true },
                { name: 'Login/Signup', href: '/login', description: 'Access your account' },
            ]
        },
        {
            id: 'checkout',
            title: 'Payments',
            icon: <CreditCard className="w-6 h-6" />,
            description: 'Secure payment and order processing',
            links: [
                { name: 'Payment Options', href: '/payment-options', description: 'Available payment methods' },
            ]
        },
        {
            id: 'support',
            title: 'Help & Support',
            icon: <HelpCircle className="w-6 h-6" />,
            description: 'Get assistance and support',
            links: [
                { name: 'Contact Us', href: '/contact', description: 'Get in touch with our team' },
                { name: 'FAQs', href: '/faqs', description: 'Frequently asked questions' },
                // { name: 'Customer Service', href: '/services', description: 'Our service offerings' },
            ]
        },
        {
            id: 'shipping',
            title: 'Shipping & Delivery',
            icon: <Truck className="w-6 h-6" />,
            description: 'Information about delivery and shipping',
            links: [
                { name: 'Shipping Information', href: '/shipping-info', description: 'Delivery timelines & costs' },
                { name: 'Track Your Order', href: '/track-your-order', description: 'Order tracking portal' },
            ]
        },
        {
            id: 'policies',
            title: 'Policies & Information',
            icon: <FileText className="w-6 h-6" />,
            description: 'Legal and policy information',
            links: [
                { name: 'Return & Refund Policy', href: '/return-refund-policy', description: 'Our return guidelines' },
                { name: 'Privacy Policy', href: '/privacy-policy', description: 'Data protection policy' },
                { name: 'Terms & Conditions', href: '/terms-&-conditions', description: 'Website terms of use' },
                { name: 'About Us', href: '/about', description: 'Learn about our company' },
            ]
        }
    ]

    // Quick links for popular pages
    const quickLinks = [
        { name: 'Shop All Products', href: '/products', icon: <ShoppingBag className="w-5 h-5" /> },
        { name: 'Today\'s Deals', href: '/collections', icon: <Star className="w-5 h-5" /> },
        { name: 'Contact Support', href: '/contact', icon: <MessageCircle className="w-5 h-5" /> },
        { name: 'Track Order', href: '/user/orders', icon: <Package className="w-5 h-5" /> },
        { name: 'FAQs', href: '/faqs', icon: <HelpCircle className="w-5 h-5" /> },
        { name: 'Shipping Info', href: '/shipping-info', icon: <Truck className="w-5 h-5" /> },
    ]

    // Stats for trust building
    const stats = [
        { number: '500+', label: 'Products' },
        // { number: '10K+', label: 'Happy Customers' },
        { number: 'All India', label: 'Delivery' },
        { number: '24/7', label: 'Support' }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Hero Section */}
            <section className="relative py-20 bg-gradient-to-r from-emerald-600 to-teal-700 text-white overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-36 translate-x-36"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-48 -translate-x-48"></div>
                
                <div className="relative container mx-auto px-6 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/30">
                            <Globe className="w-10 h-10 text-white" />
                        </div>
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                        Website <span className="text-yellow-300">Sitemap</span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
                        Complete navigation guide to explore our premium shopping experience
                    </p>
                    
                    {/* Trust Badges */}
                    <div className="flex flex-wrap justify-center gap-4 mt-10">
                        <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 flex items-center gap-2 text-sm">
                            <Shield className="w-4 h-4" />
                            Secure Shopping
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 flex items-center gap-2 text-sm">
                            <Truck className="w-4 h-4" />
                            All India Delivery
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 flex items-center gap-2 text-sm">
                            <Star className="w-4 h-4" />
                            Premium Quality
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-white/80 backdrop-blur-sm border-b border-gray-200">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center max-w-4xl mx-auto">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <div className="text-2xl font-bold text-emerald-600 mb-2">{stat.number}</div>
                                <div className="text-gray-600 font-medium text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quick Links */}
            <section className="py-12">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Access</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Most frequently visited pages for faster navigation
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
                        {quickLinks.map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                className="bg-white rounded-2xl p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 group"
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                                    {link.icon}
                                </div>
                                <span className="font-semibold text-gray-900 text-sm group-hover:text-emerald-600 transition-colors">
                                    {link.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Sitemap Sections */}
            <section className="py-12">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Complete Website Structure</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Explore all sections of our website through this comprehensive sitemap
                        </p>
                    </div>

                    <div className="max-w-6xl mx-auto space-y-6">
                        {sitemapSections.map((section) => (
                            <div 
                                key={section.id}
                                className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl"
                            >
                                <button
                                    onClick={() => toggleSection(section.id)}
                                    className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50/50 transition-colors duration-300 group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            {section.icon}
                                        </div>
                                        <div className="text-left">
                                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                                {section.title}
                                                {openSections[section.id] && (
                                                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">Expanded</span>
                                                )}
                                            </h2>
                                            <p className="text-gray-500 text-sm mt-1">
                                                {section.description}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:bg-gray-200">
                                        {openSections[section.id] ? (
                                            <ChevronUp className="w-5 h-5 text-gray-600" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-gray-600" />
                                        )}
                                    </div>
                                </button>
                                
                                <div 
                                    className={`transition-all duration-500 ease-in-out overflow-hidden ${
                                        openSections[section.id] ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                                >
                                    <div className="px-8 pb-8">
                                        <div className="border-t border-gray-200 pt-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {section.links.map((link, index) => (
                                                    <Link
                                                        key={index}
                                                        href={link.href}
                                                        className="flex items-start gap-4 p-4 rounded-2xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all duration-300 group"
                                                    >
                                                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors duration-300 flex-shrink-0">
                                                            <div className="w-2 h-2 bg-current rounded-full"></div>
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                                                                {link.name}
                                                                {link.auth && (
                                                                    <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Login Required</span>
                                                                )}
                                                            </h3>
                                                            <p className="text-gray-600 text-sm mt-1">
                                                                {link.description}
                                                            </p>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SEO Benefits Section */}
            <section className="py-16 bg-gradient-to-r from-gray-900 to-black text-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <Shield className="w-16 h-16 mx-auto mb-6 opacity-90" />
                        <h2 className="text-4xl font-bold mb-6">SEO Optimized Structure</h2>
                        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                            Our website is designed with both users and search engines in mind, ensuring easy navigation and optimal visibility.
                        </p>
                        
                        <div className="grid md:grid-cols-3 gap-8 text-left mt-12">
                            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center mb-4">
                                    <MapPin className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-bold text-lg mb-3">Easy Navigation</h3>
                                <p className="text-white/80 text-sm">
                                    Clear structure helps users find what they need quickly and efficiently.
                                </p>
                            </div>
                            
                            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                                <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center mb-4">
                                    <Search className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-bold text-lg mb-3">Search Engine Friendly</h3>
                                <p className="text-white/80 text-sm">
                                    Proper sitemap structure improves search engine crawling and indexing.
                                </p>
                            </div>
                            
                            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                                <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center mb-4">
                                    <User className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-bold text-lg mb-3">User Experience</h3>
                                <p className="text-white/80 text-sm">
                                    Intuitive layout enhances user satisfaction and engagement.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-12 text-white shadow-2xl">
                            <Heart className="w-16 h-16 mx-auto mb-6 opacity-90" />
                            <h2 className="text-4xl font-bold mb-4">Can&apos;t Find What You Need?</h2>
                            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                                Our support team is always ready to help you navigate and find exactly what you&apos;re looking for.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Link 
                                    href="/contact"
                                    className="bg-white text-emerald-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                                >
                                    Contact Support
                                </Link>
                                <Link 
                                    href="/fags"
                                    className="border-2 border-white text-white hover:bg-white/10 font-bold py-4 px-8 rounded-2xl transition-all duration-300"
                                >
                                    Visit FAQs
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final Note */}
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-6 text-center">
                    <div className="max-w-2xl mx-auto">
                        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Globe className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Comprehensive Navigation</h3>
                        <p className="text-gray-600 text-lg">
                            This sitemap is regularly updated to reflect our current website structure and ensure you have the best browsing experience.
                        </p>
                        <div className="mt-6 text-sm text-gray-500">
                            Last updated: {new Date().toLocaleDateString('en-IN', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default SitemapPage