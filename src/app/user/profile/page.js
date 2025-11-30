"use client"
import React, { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const ProfilePage = () => {
  const { data: session, status } = useSession({ required: true })
  const router = useRouter()
    const [orders, setOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  })
 const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
        phone: session.user.phone || '',
        dateOfBirth: session.user.dateOfBirth || '',
        gender: session.user.gender || '',
        address: {
          street: session.user.address?.street || '',
          city: session.user.address?.city || '',
          state: session.user.address?.state || '',
          zipCode: session.user.address?.zipCode || '',
          country: session.user.address?.country || '',
        },
      })
    }
  }, [session])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/profile/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session.user.email,formData })
      })

      const data = await res.json()
      if (data.success) {
        alert('Profile updated successfully!')
        setIsEditing(false)
      } else {
        alert('Failed to update profile')
      }
    } catch (err) {
      console.error('Error updating profile:', err)
      alert('Error updating profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    // Reset form data to original session data
    if (session?.user) {
      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
        phone: session.user.phone || '',
        dateOfBirth: session.user.dateOfBirth || '',
        gender: session.user.gender || '',
        address: {
          street: session.user.address?.street || '',
          city: session.user.address?.city || '',
          state: session.user.address?.state || '',
          zipCode: session.user.address?.zipCode || '',
          country: session.user.address?.country || '',
        },
      })
    }
    setIsEditing(false)
  }

   useEffect(() => {
      const fetchOrders = async () => {
        try {
          if (!session?.user?.email) {
            console.warn("No Shopify customer ID found");
            setLoading(false);
            return;
          }
  
          const res = await fetch("/api/getOrders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              customerId: session.user.email,
            }),
          });
  
          const data = await res.json();
          console.log("📦 Orders API Response:", data);
  
          if (data.success) {
            setOrders(data.orders || []);
          } else {
            console.error("Error:", data.error);
          }
        } catch (error) {
          console.error("Fetch failed:", error);
        } finally {
          setLoading(false);
        }
      };
  
      if (session) {
        fetchOrders();
      }
    }, [session]);

      useEffect(() => {
        if (status !== "authenticated") {
          setLoading(false);
          return;
        }
    
        console.log("Fetching reviews for email:", session.user.email); // Debug log
    
        fetch(`/api/reviews?email=${session.user.email}`)
          .then((res) => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
          })
          .then((data) => {
            console.log("API Response:", data); // Debug log
            
            // Additional client-side filtering for safety
            const userReviews = data.reviews?.filter(review => 
              review.email?.toLowerCase() === session.user.email.toLowerCase()
            ) || [];
            
            console.log("Filtered reviews:", userReviews); // Debug log
            setReviews(userReviews);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching reviews:", error);
            setError("Failed to load reviews");
            setLoading(false);
          });
      }, [status, session]);

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
      
    
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Profile</h1>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium text-sm sm:text-base"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Sidebar - Profile Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:sticky lg:top-8">
              {/* Profile Image */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  <img
                    src={session.user?.image || '/default-avatar.png'}
                    alt="Profile"
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-blue-100"
                  />
                  <button 
                    className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-blue-600 text-white p-1.5 sm:p-2 rounded-full hover:bg-blue-700 transition-colors"
                    aria-label="Change profile picture"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 text-center">{session.user?.name}</h2>
                <p className="text-gray-600 text-sm sm:text-base text-center break-all">{session.user?.email}</p>
              </div>

              {/* Quick Stats */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-xs sm:text-sm font-medium text-blue-700">Orders</span>
                  <span className="font-bold text-blue-900 text-sm sm:text-base">{orders.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-xs sm:text-sm font-medium text-green-700">Wishlist</span>
                  <span className="font-bold text-green-900 text-sm sm:text-base">{wishlistIds.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-xs sm:text-sm font-medium text-purple-700">Reviews</span>
                  <span className="font-bold text-purple-900 text-sm sm:text-base">{reviews.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Profile Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Header with Edit Button */}
              <div className="border-b border-gray-200 px-4 sm:px-6 py-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Personal Information</h3>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm sm:text-base"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex sm:flex-row flex-col w-full sm:w-auto gap-2 sm:space-x-3">
                      <button
                        onClick={handleCancel}
                        className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium text-sm sm:text-base"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex-1 sm:flex-none px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors duration-200 font-medium text-sm sm:text-base"
                      >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Form */}
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4 sm:space-y-6">
                    <h4 className="text-sm sm:text-md font-semibold text-gray-900 border-b pb-2">Basic Information</h4>
                    
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                          placeholder="Enter your full name"
                        />
                      ) : (
                        <p className="text-gray-900 text-sm sm:text-base">{session.user?.name || 'Not provided'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <p className="text-gray-900 text-sm sm:text-base break-all">{session.user?.email}</p>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                          placeholder="Enter your phone number"
                        />
                      ) : (
                        <p className="text-gray-900 text-sm sm:text-base">{formData.phone || 'Not provided'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                      {isEditing ? (
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                        />
                      ) : (
                        <p className="text-gray-900 text-sm sm:text-base">{formData.dateOfBirth || 'Not provided'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Gender</label>
                      {isEditing ? (
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      ) : (
                        <p className="text-gray-900 text-sm sm:text-base capitalize">{formData.gender || 'Not provided'}</p>
                      )}
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="space-y-4 sm:space-y-6">
                    <h4 className="text-sm sm:text-md font-semibold text-gray-900 border-b pb-2">Address Information</h4>
                    
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Street Address</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="address.street"
                          value={formData.address.street}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                          placeholder="Enter street address"
                        />
                      ) : (
                        <p className="text-gray-900 text-sm sm:text-base">{formData.address.street || 'Not provided'}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">City</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="address.city"
                            value={formData.address.city}
                            onChange={handleInputChange}
                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                            placeholder="Enter city"
                          />
                        ) : (
                          <p className="text-gray-900 text-sm sm:text-base">{formData.address.city || 'Not provided'}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">State</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="address.state"
                            value={formData.address.state}
                            onChange={handleInputChange}
                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                            placeholder="Enter state"
                          />
                        ) : (
                          <p className="text-gray-900 text-sm sm:text-base">{formData.address.state || 'Not provided'}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="address.zipCode"
                            value={formData.address.zipCode}
                            onChange={handleInputChange}
                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                            placeholder="Enter ZIP code"
                          />
                        ) : (
                          <p className="text-gray-900 text-sm sm:text-base">{formData.address.zipCode || 'Not provided'}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Country</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="address.country"
                            value={formData.address.country}
                            onChange={handleInputChange}
                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                            placeholder="Enter country"
                          />
                        ) : (
                          <p className="text-gray-900 text-sm sm:text-base">{formData.address.country || 'Not provided'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage