
"use client";
import React, { useEffect, useState } from "react";
import { getProducts } from "@/server/actions/getProducts";
import {
  Star,
  Grid,
  List,
  Search,
  ShoppingCart,
  Heart,
  Eye,
  Truck,
  Shield,
  CheckCircle,
  Sparkles,
  IndianRupee,
  Zap,
  Clock,
  TrendingUp
} from 'lucide-react';
import Link from "next/link";
import { useAppContext } from '@/component/Context';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("list");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [wishlist, setWishlist] = useState([]);
  const [productRatings, setProductRatings] = useState({});
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const { addToCart } = useAppContext();

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Auto responsive view mode
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setViewMode("grid"); // Desktop: grid
      } else if (window.innerWidth >= 768) {
        setViewMode("grid"); // Tablet: grid
      } else {
        setViewMode("list"); // Mobile: list
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch wishlist
  useEffect(() => {
    fetch("/api/wishlist")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const wishlistItems = data.wishlist?.products || [];
          const productIds = wishlistItems.map(item => item._id || item.id).filter(Boolean);
          setWishlist(productIds);
        }
      })
      .catch((err) => {
        console.error("Wishlist fetch error:", err);
      });
  }, []);

  // Fetch ratings for all products
  useEffect(() => {
    if (products.length === 0) return;

    const fetchAllRatings = async () => {
      const ratings = {};

      for (const product of products) {
        try {
          const response = await fetch(`/api/reviews/${product.id}`);
          const data = await response.json();

          if (data.reviews && data.reviews.length > 0) {
            const average = data.reviews.reduce((acc, r) => acc + r.rating, 0) / data.reviews.length;
            ratings[product.id] = {
              rating: parseFloat(average.toFixed(1)),
              count: data.reviews.length
            };
          } else {
            ratings[product.id] = {
              rating: null,
              count: 0
            };
          }
        } catch (error) {
          console.error(`Error fetching reviews for ${product.id}:`, error);
          ratings[product.id] = {
            rating: null,
            count: 0
          };
        }
      }

      setProductRatings(ratings);
    };

    fetchAllRatings();
  }, [products]);

  // Handle wishlist toggle
  const handleWishlist = async (product) => {
    if (!product?.id) return;

    setWishlistLoading(true);
    const isInWishlist = wishlist.includes(product.id);
    const method = isInWishlist ? "DELETE" : "POST";

    try {
      const response = await fetch("/api/wishlist", {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setWishlist(prev =>
          isInWishlist
            ? prev.filter(id => id !== product.id)
            : [...prev, product.id]
        );
      }
    } catch (error) {
      console.error("Wishlist error:", error);
    } finally {
      setWishlistLoading(false);
    }
  };

  // Filter and sort products
  useEffect(() => {
    let result = [...products];

    if (searchTerm) {
      result = result.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.body_html && product.body_html.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter(product =>
        product.product_type === selectedCategory
      );
    }

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => parseFloat(a.variants[0]?.price) - parseFloat(b.variants[0]?.price));
        break;
      case "price-high":
        result.sort((a, b) => parseFloat(b.variants[0]?.price) - parseFloat(a.variants[0]?.price));
        break;
      case "name":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [products, searchTerm, sortBy, selectedCategory]);

  const categories = ["all", ...new Set(products.map(p => p.product_type).filter(Boolean))];

  const TrustBadges = () => (
    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs md:text-sm">
          <div className="flex items-center justify-center gap-2">
            <Truck className="w-4 h-4" />
            <span>Free Shipping</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            <span>Secure Payment</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>Quality Assured</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Premium Products</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <TrustBadges />
        <div className="container mx-auto px-4 mt-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Trust Badges */}
      <TrustBadges />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
            Discover Premium Products
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90 max-w-2xl mx-auto">
            Handpicked collection of high-quality items designed to enhance your lifestyle
          </p>
        </div>
      </section>

      {/* Controls Section */}
      <section className="py-4 md:py-6 bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-3 md:gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-80 xl:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 md:py-3 border border-gray-300 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm md:text-base"
              />
            </div>

            <div className="flex flex-wrap gap-2 md:gap-3 items-center w-full lg:w-auto justify-between">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-xs md:text-sm flex-1 min-w-[120px]"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-xs md:text-sm flex-1 min-w-[130px]"
              >
                <option value="featured">Featured</option>
                <option value="name">Name A-Z</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>

              {/* View Toggle */}
              <div className="flex border border-gray-300 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 md:p-3 ${viewMode === "grid" ? "bg-emerald-500 text-white" : "bg-white text-gray-600"}`}
                >
                  <Grid className="w-3 h-3 md:w-4 md:h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 md:p-3 ${viewMode === "list" ? "bg-emerald-500 text-white" : "bg-white text-gray-600"}`}
                >
                  <List className="w-3 h-3 md:w-4 md:h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 md:py-8 lg:py-12">
        <div className="container mx-auto px-0.5 md:px-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 md:py-16 lg:py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6 text-sm md:text-base">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-300 text-sm md:text-base"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="flex justify-between items-center mb-4 md:mb-6 lg:mb-8">
                <p className="text-gray-600 text-xs md:text-sm lg:text-base">
                  Showing <span className="font-semibold">{filteredProducts.length}</span> products
                </p>
                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
                  <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
                  <span>Trending Now</span>
                </div>
              </div>

              {/* Products Grid/List */}
              <div className={
                viewMode === "grid"
                  ? "grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0.5 md:gap-6 lg:gap-8"
                  : "flex flex-col gap-2 md:gap-4 lg:gap-6"
              }>
                {filteredProducts.map((product) => {
                  const isInWishlist = product?.id ? wishlist.includes(product.id) : false;
                  const productRating = productRatings[product.id] || { rating: null, count: 0 };
                  const hasReviews = productRating.count > 0;
                  const discount = product.variants[0]?.compare_at_price > 0 ?
                    Math.round(((product.variants[0]?.compare_at_price - product.variants[0]?.price) / product.variants[0]?.compare_at_price) * 100) : 0;

                  return (
                    <Link
                      href={`/products/${product.id}`}
                      key={product.id}
                      className={`bg-white  md:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden border border-gray-200 ${viewMode === "list"
                          ? "flex flex-row items-stretch"
                          : "flex flex-col"
                        }`}
                    >
                      {/* Product Image */}
                      <div className={`relative overflow-hidden ${viewMode === "list"
                          ? " w-35 pt-0  sm:w-32  md:w-40 lg:w-48 xl:w-56 flex-shrink-0 aspect-square  sm:h-auto"
                          : "w-full h-48 sm:h-56 md:h-64 lg:h-72"
                        }`}>
                        <img
                          src={product.images[0]?.src || "/placeholder.png"}
                          alt={product.title}
                          className={`w-full h-full  group-hover:scale-110 transition-transform duration-500 viewMode==="list"?"object-contain  ":" object-cover"`}
                        />

                        {/* Quick Actions */}
                        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleWishlist(product);
                            }}
                            disabled={wishlistLoading}
                            className={`p-1.5 md:p-2 rounded-full shadow-lg backdrop-blur-sm transition-all ${isInWishlist
                                ? "bg-red-500 text-white"
                                : "bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white"
                              } ${wishlistLoading ? 'opacity-50' : ''}`}
                          >
                            <Heart
                              className="w-3 h-3 md:w-4 md:h-4"
                              fill={isInWishlist ? "currentColor" : "none"}
                            />
                          </button>

                        </div>

                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          {discount > 0 && (
                            <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                              {discount}% OFF
                            </span>
                          )}
                          <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            HOT
                          </span>
                        </div>

                        {/* Delivery Badge */}
                        <div className="absolute bottom-2 left-2">
                          <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Fast Delivery
                          </span>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className={`flex flex-col flex-1 p-3 md:p-4 lg:p-6 ${viewMode === "list" ? "min-w-0" : ""
                        }`}>
                        <div className="flex-1">
                          {/* Title */}
                          <h3 className={`font-bold text-gray-900 group-hover:text-emerald-600 transition-colors duration-300 ${viewMode === "list"
                              ? "text-sm sm:text-base md:text-lg lg:text-xl line-clamp-2"
                              : "text-sm md:text-base lg:text-lg line-clamp-2"
                            } mb-2`}>
                            {product.title}
                          </h3>

                          {/* Description - Only in list view */}
                          {viewMode === "list" && (
                            <p className="text-gray-600 text-xs md:text-sm line-clamp-2 mb-3 hidden sm:block">
                              {product.body_html
                                ? product.body_html.replace(/<[^>]+>/g, "").slice(0, 120) + "..."
                                : "Premium quality product designed for excellence and durability."}
                            </p>
                          )}

                          {/* Rating */}
                          <div className="flex items-center gap-2 mb-2 md:mb-3">
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-3 h-3 md:w-4 md:h-4 ${hasReviews && star <= Math.floor(productRating.rating || 0)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                    }`}
                                />
                              ))}
                            </div>
                            {hasReviews ? (
                              <span className="text-xs md:text-sm text-gray-600 font-medium">
                                {productRating.rating} • {productRating.count} reviews
                              </span>
                            ) : (
                              <span className="text-xs md:text-sm text-gray-400">
                                No reviews yet
                              </span>
                            )}
                          </div>

                          {/* Price */}
                          <div className="flex items-center gap-2 mb-2 md:mb-3">
                            <div className="flex items-baseline gap-1 md:gap-2">
                              <span className="text-lg md:text-xl lg:text-2xl font-bold text-emerald-600 flex items-center">
                                <IndianRupee className="w-4 h-4 md:w-5 md:h-5" />
                                {Math.round(product.variants[0]?.price).toLocaleString()}
                              </span>
                              {product.variants[0]?.compare_at_price && (
                                <span className="text-sm md:text-base text-gray-500 line-through flex items-center">
                                  <IndianRupee className="w-3 h-3 md:w-4 md:h-4" />
                                  {Math.round(product.variants[0]?.compare_at_price).toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Stock Status & Delivery */}
                          <div className="flex items-center justify-between mb-3 md:mb-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${product.variants[0]?.inventory_quantity > 0
                                  ? "bg-green-500"
                                  : "bg-red-500"
                                }`}></div>
                              <span className="text-xs md:text-sm text-gray-600 font-medium">
                                {product.variants[0]?.inventory_quantity > 0
                                  ? "In Stock"
                                  : "Out of Stock"}
                              </span>
                            </div>
                            <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full">
                              FREE Delivery
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className={`flex gap-2 md:gap-3 ${viewMode === "list" ? "sm:justify-end" : ""
                          }`}>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              addToCart(product);
                            }}
                            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-2 md:py-3 px-3 md:px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-xs md:text-sm shadow-lg"
                          >
                            <ShoppingCart className="w-3 h-3 md:w-4 md:h-4" />
                            Add to Cart
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleWishlist(product);
                            }}
                            disabled={wishlistLoading}
                            className={`p-2 md:p-3 rounded-lg transition-all duration-300 shadow-lg ${isInWishlist
                                ? "bg-red-500 text-white hover:bg-red-600"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              } ${wishlistLoading ? 'opacity-50' : ''}`}
                          >
                            <Heart
                              className="w-3 h-3 md:w-4 md:h-4"
                              fill={isInWishlist ? "currentColor" : "none"}
                            />
                          </button>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 md:py-12 lg:py-16 bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4">Can&apos;t Find What You&apos;re Looking For?</h2>
          <p className="text-sm md:text-base lg:text-lg mb-4 md:mb-6 lg:mb-8 opacity-90 max-w-2xl mx-auto">
            Our product collection is constantly updated with new arrivals. Contact us for special requests!
          </p>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 lg:gap-6">
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4 rounded-full font-bold text-sm md:text-base lg:text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
              Contact Support
            </button>
            <button className="border-2 border-white text-white px-5 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4 rounded-full font-bold text-sm md:text-base lg:text-lg hover:bg-white/10 transition-all duration-300 hover:scale-105">
              Request Product
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}