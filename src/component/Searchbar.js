"use client"
import { useState, useEffect, useCallback } from 'react'
import { getProducts } from '@/server/actions/getProducts'
import { Search, X, Filter, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

const Searchbar = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    const [selectedCategory, setSelectedCategory] = useState("all")
    const router = useRouter()

    // Fetch products on component mount
    useEffect(() => {
        async function fetchProducts() {
            try {
                setLoading(true)
                const data = await getProducts()
                setProducts(data)
                setFilteredProducts(data)
            } catch (error) {
                console.error("Error fetching products:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    // Filter products based on search term and category
    useEffect(() => {
        let result = [...products]

        // Search filter
        if (searchTerm.trim()) {
            result = result.filter(product =>
                product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.body_html?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Category filter
        if (selectedCategory !== "all") {
            result = result.filter(product =>
                product.product_type === selectedCategory
            )
        }

        setFilteredProducts(result)
    }, [products, searchTerm, selectedCategory])

    // Get unique categories
    const categories = ["all", ...new Set(products.map(p => p.product_type).filter(Boolean))]

    // Handle search toggle
    const handleSearchToggle = useCallback(() => {
        setIsSearchOpen(prev => !prev)
        if (isSearchOpen) {
            setSearchTerm("")
            setSelectedCategory("all")
        }
    }, [isSearchOpen])

    // Handle search submission
    const handleSearchSubmit = useCallback(() => {
        if (searchTerm.trim()) {
            const params = new URLSearchParams({
                q: searchTerm,
                ...(selectedCategory !== 'all' && { category: selectedCategory })
            })
            router.push(`/search-result?${params.toString()}`)
            setIsSearchOpen(false)
        }
    }, [searchTerm, selectedCategory, router])

    // Handle enter key press
    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter') {
            handleSearchSubmit()
        }
    }, [handleSearchSubmit])

    return (
        <>
            {/* Desktop Search */}
            <div className="hidden lg:block relative">
                {isSearchOpen ? (
                    <div className="absolute right-[-168] top-1/2 transform -translate-y-1/2 bg-white rounded-2xl shadow-xl border border-gray-200 p-2 z-50 min-w-[420px]">
                        <div className="flex items-center gap-2">

                            {/* Search Input + Category + Go Button */}
                            <div className="relative flex items-center flex-1 gap-2">

                                {/* Input Field */}
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    className="w-full pl-4 pr-[80px] py-2 rounded-lg bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-gray-200 transition-all duration-300 text-sm"
                                    autoFocus
                                />

                                {/* Category Dropdown (Compact & Right-Aligned) */}
                                <div className="absolute right-10 flex items-center">
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white appearance-none"
                                    >
                                        <option value="all"  >  All Category </option>
                                        {categories.map(category => (
                                            <option key={category} value={category}>
                                                {category.charAt(0).toUpperCase() + category.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                    <span className="ml-1 text-gray-400">
                                        <Filter className="w-3 h-3" />
                                    </span>
                                </div>

                                {/* Go Button */}
                                <button
                                    onClick={handleSearchSubmit}
                                    disabled={!searchTerm.trim()}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={handleSearchToggle}
                                className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={handleSearchToggle}
                        className="p-2 relative lg:right-[-60] xl:right-[-130] cursor-pointer bottom-0 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-110 border border-gray-200"
                    >
                        <Search className="w-5 h-5 text-gray-600" />
                    </button>
                )}
            </div>



        </>
    )
}

export default Searchbar

export const MobileSearch = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [showAllCategories, setShowAllCategories] = useState(false);
    const router = useRouter()

    // Fetch products
    useEffect(() => {
        async function fetchProducts() {
            try {
                setLoading(true)
                const data = await getProducts()
                setProducts(data)
            } catch (error) {
                console.error("Error fetching products:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    // Get unique categories
    const categories = ["all", ...new Set(products.map(p => p.product_type).filter(Boolean))]

    // Handle search submission
    const handleSearchSubmit = () => {
        if (searchTerm.trim()) {
            const params = new URLSearchParams({
                q: searchTerm,
                ...(selectedCategory !== 'all' && { category: selectedCategory })
            })
            router.push(`/search-result?${params.toString()}`)
        }
    }

    // Handle enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearchSubmit()
        }
    }
    const visibleCategories = showAllCategories ? categories : categories.slice(0, 6);

    return (
        <div className="lg:hidden bg-white border-b p-3">
            <div className="flex flex-col gap-3">
                {/* Search Input with Integrated Category and Go Button */}
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <input
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyPress}
                            className="w-full pl-10 pr-20 py-3 rounded-xl bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-gray-200 transition-all duration-300"
                            type="text"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

                        {/* Category Select Inside Search Bar */}
                        {/* <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="bg-transparent border-none focus:outline-none text-sm text-gray-600 pr-2 appearance-none"
                            >
                                <option value="all">All</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div> */}

                        {/* Go Button */}
                        <button
                            onClick={handleSearchSubmit}
                            disabled={!searchTerm.trim()}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Quick Category Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                    {visibleCategories.map(category => (
                        <button
                            value={selectedCategory}
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors duration-200 ${selectedCategory === category
                                ? 'bg-emerald-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}

                        </button>
                    ))}
                    {!showAllCategories && categories.length > 6 && (
                        <button
                            onClick={() => setShowAllCategories(true)}
                            className="px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 whitespace-nowrap"
                        >
                            +{categories.length - 6} more
                        </button>
                    )}
                </div>
            </div>

            <style jsx>{`
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    )
}