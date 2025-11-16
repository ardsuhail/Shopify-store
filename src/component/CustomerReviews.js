"use client";

import React, { useEffect, useState } from "react";
import { User, Star, LoaderCircle, Loader, X, ChevronLeft, ChevronRight } from "lucide-react";
import ReactStars from "react-stars";

const ReviewsDisplay = ({ ProductId }) => {
  const [reviews, setReviews] = useState([]);
  const [allReviews, setAllReviews] = useState([]); // ✅ ALL reviews store karega
  const [selectedImage, setSelectedImage] = useState(null);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showReviews, setShowReviews] = useState(false);

  // Slider controls
  const nextSlide = () => setCurrent((prev) => (prev + 1) % reviews.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);

  // Fetch reviews - ✅ SABHI REVIEWS LE RAHA HAI
  useEffect(() => {
    if (!ProductId) return;
    setLoading(true);
    fetch(`/api/reviews/${ProductId}`)
      .then((res) => res.json())
      .then((data) => {
        const allFetchedReviews = data.reviews || [];
        setAllReviews(allFetchedReviews); // ✅ SABHI REVIEWS STORE KARO
        
        // Sirf image wale reviews slider ke liye
        const imageReviews = allFetchedReviews.filter(
          (item) => item.images?.length > 0
        );
        setReviews(imageReviews);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [ProductId]);

  // Average rating - ✅ SABHI REVIEWS SE CALCULATE KARO
  const averageRating =
    allReviews.length > 0
      ? allReviews.reduce((acc, r) => acc + Number(r.rating || 0), 0) / allReviews.length
      : 0;

  const roundedRating = Number(averageRating.toFixed(1));

  // Event handling
  const handleImageClick = (e, item) => {
    e.stopPropagation();
    e.preventDefault();
    setShowReviews(true);
    const itemIndex = reviews.findIndex(review => review._id === item._id);
    if (itemIndex !== -1) {
      setCurrent(itemIndex);
    }
  };

  const handleModalImageClick = (e, img) => {
    e.stopPropagation();
    setSelectedImage(img);
  };

  const handlereview = () => {
    console.log("Rate product clicked");
  };

 

  // ✅ AGAR KOI BHI REVIEW NAHI HAI TO NULL RETURN KARO
  if (allReviews.length === 0) return null;

  return (
    <>
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 my-6 sm:my-8 md:my-12 px-3 sm:px-4 md:px-6">
        {loading ? (
          <div className="col-span-3 flex items-center justify-center py-12 sm:py-16">
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              <LoaderCircle className="animate-spin text-emerald-600 w-10 h-10 sm:w-12 sm:h-12" />
              <p className="text-gray-600 font-medium text-sm sm:text-base">Loading Reviews...</p>
            </div>
          </div>
        ) : (
          <>
            {/* LEFT SIDE - Rating Summary */}
            <div className="lg:col-span-1 lg:sticky lg:top-24 self-start bg-gradient-to-br from-white to-gray-50/80 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl border border-gray-100 backdrop-blur-sm">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3 sm:mb-4">
                  Customer Reviews
                </h2>

                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${star <= Math.round(averageRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-gray-300 text-gray-300'
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{roundedRating}</span>
                </div>

                {/* ✅ SABHI REVIEWS KA COUNT */}
                <p className="text-gray-600 text-xs sm:text-sm mb-2">Based on {allReviews.length} verified reviews</p>

                <div className="w-12 h-0.5 sm:w-16 sm:h-1 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full mx-auto mb-4 sm:mb-6"></div>
              </div>

              {/* Rating Distribution - ✅ SABHI REVIEWS SE */}
              <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = allReviews.filter((r) => Math.round(r.rating) === star).length;
                  const percentage = allReviews.length > 0 ? Math.round((count / allReviews.length) * 100) : 0;
                  return (
                    <div key={star} className="flex items-center gap-2 sm:gap-3 group">
                      <span className="w-8 sm:w-10 text-xs sm:text-sm font-semibold text-gray-700 group-hover:text-emerald-600 transition-colors">
                        {star}★
                      </span>
                      <div className="flex-1 h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-2 sm:h-2.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-gray-600 w-6 sm:w-10 text-right">{percentage}%</span>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={handlereview}
                className="w-full px-4 py-2.5 sm:px-6 sm:py-3.5 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Star className="w-4 h-4 sm:w-5 sm:h-5" />
                Rate This Product
              </button>
            </div>

            {/* RIGHT SIDE - Reviews Content */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6 md:space-y-8">
              {/* Customer Photos - ✅ SIRF IMAGE WALE REVIEWS */}
              {reviews.length > 0 && (
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg sm:shadow-xl border border-gray-100">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">Customer Photos</h2>
                    <span className="text-xs sm:text-sm text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 sm:px-3 sm:py-1 rounded-full">
                      {reviews.length} Photos
                    </span>
                  </div>
                  <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
                    {reviews.map((item) => (
                      <div
                        key={item._id}
                        className="aspect-square rounded-lg sm:rounded-xl overflow-hidden group cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl relative"
                      >
                        <img
                          onClick={(e) => handleImageClick(e, item)}
                          src={item.images[0]}
                          alt="Customer review"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center pointer-events-none">
                          <div className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Reviews - ✅ SABHI REVIEWS SHOW KARO */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg sm:shadow-xl border border-gray-100">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    {reviews.length > 0 ? "All Reviews" : "Verified Reviews"}
                  </h2>
                  <span className="text-xs sm:text-sm text-gray-500 font-medium">{allReviews.length} reviews</span>
                </div>

                <div className="space-y-4 sm:space-y-6 max-h-[400px] sm:max-h-[500px] md:max-h-[600px] overflow-y-auto pr-2 sm:pr-4 custom-scrollbar">
                  {allReviews.map((item) => (
                    <div
                      key={item._id}
                      className="bg-gradient-to-br from-gray-50 to-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-200 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 group"
                    >
                      <div className="flex items-start justify-between mb-3 sm:mb-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center shadow-md sm:shadow-lg">
                            <User className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors text-sm sm:text-base md:text-lg">
                              {item.customerName}
                            </h3>
                            <div className="flex items-center gap-1 sm:gap-2 mt-0.5 sm:mt-1">
                              <ReactStars
                                count={5}
                                size={14}
                                value={item.rating}
                                edit={false}
                                activeColor="#f59e0b"
                              />
                              <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                                Verified
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* ✅ AGAR IMAGES HAI TO BADGE SHOW KARO */}
                        {item.images?.length > 0 && (
                          <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded-full flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {item.images.length} photo{item.images.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>

                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg mb-3">
                        {item.desc}
                      </p>

                      {/* ✅ AGAR IMAGES HAI TO THUMBNAILS SHOW KARO */}
                      {item.images?.length > 0 && (
                        <div className="flex gap-2 mt-3">
                          {item.images.slice(0, 3).map((img, index) => (
                            <img
                              key={index}
                              src={img}
                              alt={`Review by ${item.customerName}`}
                              className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg border border-gray-200 cursor-pointer hover:scale-105 transition-transform duration-200"
                              onClick={(e) => handleModalImageClick(e, img)}
                            />
                          ))}
                          {item.images.length > 3 && (
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-xs text-gray-500">
                              +{item.images.length - 3}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews Modal - ✅ SIRF IMAGE WALE REVIEWS KE LIYE */}
            {showReviews && reviews.length > 0 && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center z-[9999] p-2 sm:p-4">
                <div 
                  className="relative w-full h-full sm:h-[90vh] sm:max-w-4xl lg:max-w-6xl bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl border border-gray-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-gray-900 to-gray-700 text-white p-3 sm:p-4 md:p-6 z-20">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Customer Reviews Gallery</h2>
                      <button
                        onClick={() => setShowReviews(false)}
                        className="p-1 sm:p-2 hover:bg-white/10 rounded-lg sm:rounded-xl transition-colors duration-200"
                      >
                        <X className="w-5 h-5 sm:w-6 sm:h-6" />
                      </button>
                    </div>
                  </div>

                  {/* Slider */}
                  <div className="pt-14 sm:pt-16 md:pt-20 h-full">
                    <div
                      className="flex transition-transform duration-500 ease-out h-full"
                      style={{ transform: `translateX(-${current * 100}%)` }}
                    >
                      {reviews.map((item, idx) => (
                        <div
                          key={idx}
                          className="w-full flex-shrink-0 flex flex-col lg:flex-row h-full"
                        >
                          {/* Image Side */}
                          <div className="lg:w-1/2 h-1/2 lg:h-full bg-gray-100 flex items-center justify-center p-4 sm:p-6 md:p-8">
                            <img
                              onClick={(e) => handleModalImageClick(e, item.images[0])}
                              src={item.images[0]}
                              alt={`Review by ${item.customerName}`}
                              className="max-w-full max-h-full object-contain rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg sm:shadow-xl cursor-zoom-in"
                            />
                          </div>

                          {/* Content Side */}
                          <div className="lg:w-1/2 h-1/2 lg:h-full p-4 sm:p-6 md:p-8 overflow-y-auto">
                            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                                <User className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                              </div>
                              <div>
                                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{item.customerName}</h3>
                                <div className="flex items-center gap-2 sm:gap-3 mt-1 sm:mt-2">
                                  <ReactStars
                                    count={5}
                                    size={18}
                                    value={item.rating}
                                    edit={false}
                                    activeColor="#f59e0b"
                                  />
                                  <span className="text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded-full text-xs sm:text-sm">
                                    Verified Purchase
                                  </span>
                                </div>
                              </div>
                            </div>

                            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-6">
                              {item.desc}
                            </p>

                            {/* Additional Images */}
                            {item.images.length > 1 && (
                              <div className="border-t pt-4 sm:pt-6">
                                <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">More Photos</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                                  {item.images.slice(1).map((img, i) => (
                                    <img
                                      key={i}
                                      src={img}
                                      alt={`Additional photo ${i + 1}`}
                                      className="w-full aspect-square object-cover rounded-lg sm:rounded-xl border-2 border-gray-200 hover:border-emerald-400 cursor-pointer transition-all duration-300 hover:scale-105"
                                      onClick={(e) => handleModalImageClick(e, img)}
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Slider Controls */}
                  {reviews.length > 1 && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 z-10"
                      >
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-700" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 z-10"
                      >
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-700" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Image Modal */}
            {selectedImage && (
              <div
                className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center z-[10000] p-2 sm:p-4"
                onClick={() => setSelectedImage(null)}
              >
                <div 
                  className="relative max-w-full max-h-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={selectedImage}
                    alt="Full size review"
                    className="max-w-full max-h-full rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/20 hover:bg-white/30 text-white p-2 sm:p-3 rounded-lg sm:rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-110"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        @media (min-width: 640px) {
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #10b981, #3b82f6);
          border-radius: 8px;
        }
      `}</style>
    </>
  );
};

export default ReviewsDisplay;