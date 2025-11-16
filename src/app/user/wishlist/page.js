"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Heart, ShoppingBag, ArrowRight, Trash2, Star, Shield, Truck, RotateCw, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/component/Context";
export default function Wishlist() {
  const [wishlistIds, setWishlistIds] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const { addToCart } = useAppContext();
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
          
          if (productIds.length > 0) {
            await fetchProductDetails(productIds);
          } else {
            setProductDetails([]);
          }
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

  const fetchProductDetails = async (productIds) => {
    try {
      const details = await Promise.all(
        productIds.map(async (productId) => {
          try {
            const numId = productId.includes('gid://') 
              ? productId.split('/').pop() 
              : productId;

            const res = await fetch(`/api/getProduct?id=${numId}`);
            const data = await res.json();
            
            if (data.success && data.product) {
              return { 
                ...data.product, 
                productId: productId,
                rating: Math.random() * 2 + 3, // Random rating between 3-5
                reviews: Math.floor(Math.random() * 1000) + 50, // Random reviews
                delivery: Math.floor(Math.random() * 3) + 1 // Random delivery days
              };
            }
            return null;
          } catch (err) {
            console.error(`Error fetching product ${productId}:`, err);
            return null;
          }
        })
      );
      setProductDetails(details.filter(product => product !== null));
    } catch (error) {
      console.error("Error fetching product details:", error);
      setError("Failed to load some products");
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    if (status !== "authenticated") {
      setError("Please login to manage your wishlist");
      return;
    }
    
    setActionLoading(productId);
    try {
      const res = await fetch("/api/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: productId }),
      });
      
      const result = await res.json();
      
      if (result.success) {
        setWishlistIds(prev => prev.filter(id => id !== productId));
        setProductDetails(prev => prev.filter((p) => p.productId !== productId));
      } else {
        setError(result.message || "Failed to remove from wishlist");
      }
    } catch (error) {
      console.error("Wishlist update error:", error);
      setError("Network error. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleProductClick = (productId) => {
    const numId = productId.includes('gid://') 
      ? productId.split('/').pop() 
      : productId;
    router.push(`/products/${numId}`);
  };



  const filteredProducts = productDetails.filter(product => {
    const title = product.title || product.name || "";
    return title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading your wishlist...</p>
              <p className="text-gray-500 text-sm mt-2">We're fetching your saved items</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status !== "authenticated") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-red-500" fill="currentColor" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Your Wishlist</h2>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Sign in to save your favorite items and access them anytime, anywhere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/auth/signin")}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-2xl font-semibold hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Sign In to Continue
              </button>
              <button
                onClick={() => router.push("/")}
                className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-2xl font-semibold hover:border-gray-400 hover:bg-gray-50 transform hover:scale-105 transition-all duration-300"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-red-500" fill="currentColor" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">My Wishlist</h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Your curated collection of favorite products. Save items you love and buy them later!
          </p>
        </div>

        {/* Stats and Search Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{wishlistIds.length}</div>
                <div className="text-sm text-gray-600">Items Saved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{filteredProducts.length}</div>
                <div className="text-sm text-gray-600">Available Now</div>
              </div>
            </div>
            
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search in your wishlist..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300 bg-white/50"
                />
              </div>
            </div>

            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold group"
            >
              Continue Shopping
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-500 text-sm">!</span>
              </div>
              <span className="text-red-700">{error}</span>
            </div>
            <button 
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors"
            >
              ×
            </button>
          </div>
        )}
        
        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-6">
            {filteredProducts.map((product,index) => {
              const productId = product.productId || product.id;
              const productTitle = product.title || product.name || "Untitled Product";
              const productImage = product.image || "/placeholder-image.jpg";
              const productPrice = product.price || "N/A";
              const rating = product.rating || 4.0;
              const reviews = product.reviews || 0;
              const delivery = product.delivery || 2;

              return (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200/50 hover:border-gray-300"
                >
                  {/* Wishlist Button */}
                  <div className="absolute top-4 right-4 z-20">
                    <button
                      onClick={() => handleRemoveFromWishlist(productId)}
                      disabled={actionLoading === productId}
                      className="p-3 rounded-full transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-lg hover:bg-red-50 hover:scale-110 hover:shadow-xl disabled:opacity-50"
                      aria-label="Remove from wishlist"
                    >
                      {actionLoading === productId ? (
                        <RotateCw className="w-5 h-5 text-red-500 animate-spin" />
                      ) : (
                        <Heart className="w-5 h-5 text-red-500" fill="currentColor" />
                      )}
                    </button>
                  </div>

                  {/* Product Image */}
                  <div 
                    className="relative w-full aspect-square overflow-hidden cursor-pointer"
                    onClick={() => handleProductClick(productId)}
                  >
                    <img
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      src={productImage}
                      alt={productTitle}
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Product Details */}
                  <div className="p-5">
                    <h3 
                      className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => handleProductClick(productId)}
                    >
                      {productTitle}
                    </h3>

                  

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-4">
                      <p className="text-2xl font-bold text-gray-900">
                        ₹{productPrice}
                      </p>
                      <p className="text-sm text-green-600 line-through opacity-0 group-hover:opacity-100 transition-opacity">
                        ₹{Math.round(productPrice * 1.2)}
                      </p>
                    </div>

                    {/* Trust Badges */}
                    <div className="flex items-center gap-3 mb-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Truck className="w-3 h-3" />
                        <span>{delivery} day delivery</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        <span>Secure</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => addToCart(product)}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {searchTerm ? "No matching items found" : "Your wishlist is empty"}
            </h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              {searchTerm 
                ? "Try adjusting your search terms or browse our collection."
                : "Start exploring our products and add items you love to your wishlist!"
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/")}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-2xl font-semibold hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Start Shopping
              </button>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-2xl font-semibold hover:border-gray-400 hover:bg-gray-50 transform hover:scale-105 transition-all duration-300"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        )}

        {/* Trust Section */}
        {filteredProducts.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 text-center border border-blue-200/50">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Why Shop With Us?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="flex flex-col items-center">
                <Truck className="w-8 h-8 text-blue-600 mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">Free Delivery</h4>
                <p className="text-sm text-gray-600">On orders over ₹499</p>
              </div>
              <div className="flex flex-col items-center">
                <Shield className="w-8 h-8 text-green-600 mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">Secure Payment</h4>
                <p className="text-sm text-gray-600">100% protected transactions</p>
              </div>
              <div className="flex flex-col items-center">
                <RotateCw className="w-8 h-8 text-orange-600 mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">Easy Returns</h4>
                <p className="text-sm text-gray-600">30-day return policy</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}