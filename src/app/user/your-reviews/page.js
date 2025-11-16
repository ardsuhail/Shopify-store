"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ReactStars from "react-stars";

export default function MyReviews() {
  const { data: session, status } = useSession();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDesc, setShowDesc] = useState({});
  const [showImages, setShowImages] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    if (status !== "authenticated") {
      setLoading(false);
      return;
    }

    console.log("Fetching reviews for email:", session.user.email);

    fetch(`/api/reviews?email=${session.user.email}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("API Response:", data);
        
        const userReviews = data.reviews?.filter(review => 
          review.email?.toLowerCase() === session.user.email.toLowerCase()
        ) || [];
        
        console.log("Filtered reviews with images:", userReviews.map(r => ({
          id: r._id,
          images: r.images,
          imageCount: r.images?.length
        })));
        
        setReviews(userReviews);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
        setError("Failed to load reviews");
        setLoading(false);
      });
  }, [status, session]);

  const toggleDesc = (id) => {
    setShowDesc((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleImages = (id) => {
    setShowImages((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Function to check if image URL is valid and fix if needed
  const getImageUrl = (img) => {
    if (!img) return null;
    
    // Images are stored as Cloudinary secure_url (full URLs starting with https://)
    // Just return them as-is since they're already complete URLs
    if (img.startsWith('http')) {
      return img;
    }
    
    // If image is a relative path starting with /
    if (img.startsWith('/')) {
      return img;
    }
    
    // If image is just a filename, assume it's in uploads
    const finalUrl = `/uploads/${img}`;
    return finalUrl;
  };

  const handleImageError = (imageUrl, reviewId, index) => {
    console.error(`Image failed to load: ${imageUrl}`);
    setImageErrors(prev => ({
      ...prev,
      [`${reviewId}-${index}`]: true
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 font-medium">Loading your reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Reviews</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (status !== "authenticated") {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Authentication Required</h3>
          <p className="text-gray-600">Please sign in to view your reviews</p>
        </div>
      </div>
    );
  }

  if (!reviews.length) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh] text-center px-4">
        <div className="w-40 h-40 mb-6 flex items-center justify-center bg-blue-50 rounded-full">
          <svg className="w-20 h-20 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">No Reviews Yet</h3>
        <p className="text-gray-600 max-w-md">
          You haven&apos;t submitted any reviews yet. Start sharing your experience by rating your recent purchases.
        </p>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Debug Info:</strong> Logged in as: {session.user.email}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Reviews</h1>
          <p className="text-gray-600">Manage and view all your product reviews</p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-4 rounded-full"></div>
          
          {/* Debug info */}
          <div className="mt-4 p-3 bg-green-50 rounded-lg inline-block">
            <p className="text-sm text-green-700">
              Showing {reviews.length} reviews for: <strong>{session.user.email}</strong>
            </p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-50 mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-50 mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Reviews with Images</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews.filter(r => r.images && r.images.length > 0).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-50 mr-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)}/5
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {reviews.map((item) => {
            const validImages = item.images?.filter(img => getImageUrl(img)) || [];
            
            return (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:translate-y-[-4px]"
              >
                {/* Header with Rating */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full mb-2">
                        ID: {item._id?.slice(0, 8)}...
                      </span>
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">
                        {item.customerName}
                      </h3>
                      <p className="text-gray-500 text-sm">{item.email}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <ReactStars
                        count={5}
                        size={20}
                        isHalf={true}
                        value={item.rating}
                        edit={false}
                        activeColor="#f59e0b"
                      />
                      <span className="text-xs text-gray-500 mt-1">
                        {new Date(item.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    Product: {item.ProductId?.slice(0, 8)}...
                  </div>
                </div>

                {/* Description Section */}
                <div className="p-6">
                  {showDesc[item._id] ? (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Review Description</h4>
                        <button
                          onClick={() => toggleDesc(item._id)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => toggleDesc(item._id)}
                      className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm mb-4 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Description
                    </button>
                  )}

                  {/* Images Section - FIXED with regular img tag */}
                  <div className="mt-4">
                    {validImages.length > 0 ? (
                      showImages[item._id] ? (
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
                              Review Images ({validImages.length})
                            </h4>
                            <button
                              onClick={() => toggleImages(item._id)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          <div className="grid grid-cols-3 gap-2 mb-3">
                            {validImages.map((img, i) => {
                              const imageUrl = getImageUrl(img);
                              const imageKey = `${item._id}-${i}`;
                              const hasError = imageErrors[imageKey];
                              
                              return (
                                <div key={i} className="relative group">
                                  {!hasError ? (
                                    <img
                                      src={imageUrl}
                                      alt={`Review image ${i + 1}`}
                                      className="w-full h-20 object-cover rounded-lg cursor-pointer border border-gray-200 hover:border-blue-500 transition-all duration-200 group-hover:scale-105 bg-gray-100"
                                      onClick={() => setSelectedImage(imageUrl)}
                                      onError={() => handleImageError(imageUrl, item._id, i)}
                                      loading="lazy"
                                    />
                                  ) : (
                                    <div className="w-full h-20 bg-gray-200 rounded-lg flex items-center justify-center border border-gray-300">
                                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                    </div>
                                  )}
                                  {/* <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg"></div> */}
                                </div>
                              );
                            })}
                          </div>
                          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                            💡 Click on images to view in full size
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => toggleImages(item._id)}
                          className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          View {validImages.length} Image{validImages.length > 1 ? 's' : ''}
                        </button>
                      )
                    ) : (
                      <div className="flex items-center text-gray-400 text-sm">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        No images attached
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Image Modal - FIXED with regular img tag */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt="Full size review"
              className="max-w-full max-h-[90vh] object-contain rounded-lg bg-white"
              onError={(e) => {
                console.error(`Failed to load modal image: ${selectedImage}`);
                e.target.src = '/image-placeholder.png'; // Fallback image
              }}
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors text-3xl font-light bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Debug Panel */}
      <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg text-xs max-w-sm">
        <div className="font-bold mb-2">Image Debug Info:</div>
        <div>Total Reviews: {reviews.length}</div>
        <div>Reviews with Images: {reviews.filter(r => r.images && r.images.length > 0).length}</div>
        <div>Image Errors: {Object.keys(imageErrors).length}</div>
      </div>
    </div>
  );
}