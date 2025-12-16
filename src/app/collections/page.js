"use client"
import React from 'react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getCollections } from '@/server/actions/getCollections'
import { 
  Star, 
  Shield, 
  Truck, 
  CheckCircle, 
  ArrowRight,
  Grid,
  Search,
  Sparkles,
  Clock,
  Users,
  Award
} from 'lucide-react'
import Image from 'next/image'

const CollectionsPage = () => {
    const [collections, setCollections] = useState([])
    const [filteredCollections, setFilteredCollections] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(true)
    const [sortBy, setSortBy] = useState("featured")

    useEffect(() => {
        async function fetchCollections() {
            try {
                setLoading(true)
                const data = await getCollections();
                // console.log("📦 All collections received:", data);
                
                // Filter out unwanted collections
                const filteredData = data.filter(item => 
                    item.title.toLowerCase() !== "featured collection" && 
                    item.title.toLowerCase() !== "trending products"
                )
                console.log("✅ Filtered collections:", filteredData);
                setCollections(filteredData)
                setFilteredCollections(filteredData)
            } catch (error) {
                console.error("❌ Error fetching collections:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchCollections();
    }, []);

    // Search and sort functionality
    useEffect(() => {
        let result = [...collections];

        // Search filter
        if (searchTerm) {
            result = result.filter(item =>
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
            )
        }

        // Sort collections
        switch (sortBy) {
            case "name":
                result.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case "products":
                result.sort((a, b) => (b.products_count || 0) - (a.products_count || 0));
                break;
            case "featured":
            default:
                // Keep original order
                break;
        }

        setFilteredCollections(result)
    }, [searchTerm, collections, sortBy])

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-20">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
                        <p className="text-gray-600">Loading premium collections...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Hero Section */}
            <section className="relative py-20 bg-gradient-to-r from-emerald-600 to-teal-700 text-white overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-36 translate-x-36"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-48 -translate-x-48"></div>
                
                <div className="relative container mx-auto px-6 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                        Premium <span className="text-yellow-300">Collections</span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
                        Discover handpicked collections curated for your modern lifestyle
                    </p>
                    
                    {/* Trust Badges */}
                    <div className="flex flex-wrap justify-center gap-4 mt-10">
                        <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 flex items-center gap-2 text-sm">
                            <Shield className="w-4 h-4" />
                            Quality Assured
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 flex items-center gap-2 text-sm">
                            <Truck className="w-4 h-4" />
                            Fast Delivery
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4" />
                            Easy Returns
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-white/80 backdrop-blur-sm border-b border-gray-200">
                <div className="container mx-auto px-1 sm:px-6">
                    <div className="grid grid-cols-3 gap-2 sm:gap-6 text-center max-w-2xl mx-auto">
                        <div className="bg-white rounded-2xl py-4 sm:p-6 shadow-sm border border-gray-100">
                            <div className="text-2xl font-bold text-emerald-600 mb-2">{collections.length}</div>
                            <div className="text-gray-600 font-medium text-sm">Collections</div>
                        </div>
                        <div className="bg-white rounded-2xl py-4 sm:p-6 shadow-sm border border-gray-100">
                            <div className="text-2xl font-bold text-emerald-600 mb-2">500+</div>
                            <div className="text-gray-600 font-medium text-sm">Products</div>
                        </div>
                        {/* <div className="bg-white rounded-2xl py-4 sm:p-6 shadow-sm border border-gray-100">
                            <div className="text-2xl font-bold text-emerald-600 mb-2">10K+</div>
                            <div className="text-gray-600 font-medium text-sm">Happy Customers</div>
                        </div> */}
                    </div>
                </div>
            </section>

            {/* Search and Controls */}
            <section className="py-12">
                <div className="container mx-auto px-1 sm:px-6">
                    <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-8">
                        {/* Search */}
                        <div className="relative w-full lg:w-96">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search collections..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Sort */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                            >
                                <option value="featured">Featured</option>
                                <option value="name">Name A-Z</option>
                                <option value="products">Most Products</option>
                            </select>

                            <div className="text-sm text-gray-600">
                                <span className="font-semibold">{filteredCollections.length}</span> collections
                            </div>
                        </div>
                    </div>

                    {/* Collections Grid */}
                    {filteredCollections.length === 0 ? (
                        <div className="text-center py-16 bg-white/50 rounded-3xl backdrop-blur-sm border border-gray-200">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">No collections found</h3>
                            <p className="text-gray-600 mb-6">Try adjusting your search criteria</p>
                            <button
                                onClick={() => {
                                    setSearchTerm("")
                                    setSortBy("featured")
                                }}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-300"
                            >
                                Reset Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                            {filteredCollections.map((collection, index) => (
                                <Link
                                    key={collection.id}
                                    href={`/collections/${collection.id}`}
                                    className="group block"
                                >
                                    <div className="bg-white rounded-xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden h-full flex flex-col">
                                        {/* Collection Image - Fixed height and proper sizing */}
                                        <div className="relative overflow-hidden aspect-square">
                                            <Image
                                                src={collection.image?.src || "/placeholder-collection.jpg"}
                                                alt={collection.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                                priority={index < 4}
                                            />
                                            
                                            {/* Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            
                                            {/* Hover Action */}
                                            <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-semibold">Explore Now</span>
                                                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                                                </div>
                                            </div>

                                            {/* Featured Badge */}
                                            {index < 3 && (
                                                <div className="absolute top-3 left-3">
                                                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                                                        <Sparkles className="w-3 h-3" />
                                                        Popular
                                                    </span>
                                                </div>
                                            )}

                                            {/* Products Count Badge */}
                                            {/* <div className="absolute top-3 right-3">
                                                <span className="bg-black/70 text-white px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                                                    {collection.products_count || 0} items
                                                </span>
                                            </div> */}
                                        </div>

                                        {/* Collection Info - Improved spacing */}
                                        <div className="px-1 py-1  sm:p-6 flex-1 flex flex-col">
                                            <h3 className="text-lg sm:text-xl font-bold text-gray-800 group-hover:text-emerald-600 transition-colors duration-300 mb-2 sm:mb-3 line-clamp-2 leading-tight">
                                                {collection.title}
                                            </h3>
                                            
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed flex-1">
                                                {collection.description || `Discover our premium ${collection.title.toLowerCase()} collection with carefully curated products.`}
                                            </p>

                                            <div className="flex flex-col gap-2 items-start sm:gap-0 sm:flex-row sm:items-center sm:justify-between pt-3 sm:pt-4 border-t border-gray-100 mt-auto">
                                                <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-1  rounded-lg sm:rounded-full">
                                                    Shop Collection
                                                </span>
                                                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg sm:rounded-full">
                                                    View →
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-gray-900 to-black text-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-6">Ready to Explore More?</h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                        Can&apos;t find what you&apos;re looking for? We&apos;re constantly adding new collections and products.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link 
                            href="/contact" 
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                        >
                            <Users className="w-5 h-5" />
                            Contact Support
                        </Link>
                        <Link 
                            href="/products" 
                            className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-3"
                        >
                            <Award className="w-5 h-5" />
                            All Products
                        </Link>
                    </div>
                </div>
            </section>

            {/* SEO Content Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">
                                Curated Collections for Modern Living
                            </h2>
                            <p className="text-gray-600 text-lg">
                                Each collection is thoughtfully designed to enhance your daily life
                            </p>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            <div className="p-6">
                                <div className="bg-emerald-100 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Shield className="w-6 h-6 text-emerald-600" />
                                </div>
                                <h3 className="font-bold text-gray-800 mb-2">Quality Guaranteed</h3>
                                <p className="text-gray-600 text-sm">
                                    Every product undergoes rigorous quality checks to ensure premium standards
                                </p>
                            </div>
                            
                            <div className="p-6">
                                <div className="bg-blue-100 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Clock className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="font-bold text-gray-800 mb-2">Fast Delivery</h3>
                                <p className="text-gray-600 text-sm">
                                    Quick shipping across India with real-time tracking and safe packaging
                                </p>
                            </div>
                            
                            <div className="p-6">
                                <div className="bg-purple-100 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="font-bold text-gray-800 mb-2">Easy Returns</h3>
                                <p className="text-gray-600 text-sm">
                                    Hassle-free 7-day return policy with instant refund processing
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default CollectionsPage