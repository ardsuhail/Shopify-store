"use client"
import React from 'react'
import { useState, useEffect } from 'react'
import { LoaderCircle, User, Mail, HeartPlus, ChevronDown, ChevronUp, Star, Award, Shield, ThumbsUp } from "lucide-react";
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// ReactStars ko dynamically import karein SSR disable karke
const ReactStars = dynamic(() => import("react-stars"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} className="w-5 h-5 text-gray-300" />
      ))}
    </div>
  )
});

const Reviews = ({ ProductId, ProductTitle }) => {
    const [open, setOpen] = useState(false)
    const [reviews, setReviews] = useState([])
    const [revLoading, setRevLoading] = useState(false)
    const [buyLoading, setBuyLoading] = useState(false)
    const [mounted, setMounted] = useState(false)
    const router = useRouter()

    // Client-side mount hone ka wait karein
    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!ProductId || !mounted) return;
        setRevLoading(true)
        fetch(`/api/reviews/${ProductId}`)
            .then((res) => res.json())
            .then((data) => {
                setReviews(data.reviews || []);
                setRevLoading(false)
            })
            .catch((err) => console.error("Error fetching reviews:", err));
    }, [ProductId, mounted]);

    const handlereview = () => {
        setBuyLoading(true);
        setTimeout(() => {
            router.push(`/create-review?products=${ProductId}`);
        }, 500);
    }

    const averageRating = (reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0).toFixed(1)
    // const recentReviews = reviews.filter(review => {
    //     const reviewDate = new Date(review.date);
    //     const monthAgo = new Date();
    //     monthAgo.setMonth(monthAgo.getMonth() - 1);
    //     return reviewDate > monthAgo;
    // }).length;

    // Agar abhi tak mount nahi hua hai toh loading state show karein
    if (!mounted) {
        return (
            <div className="flex flex-col">
                <div className="flex items-center justify-between mb-6 p-4 sm:p-6 rounded-2xl border border-gray-300/80 bg-gradient-to-r from-white to-gray-50/80 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-16 h-16 bg-gray-200 rounded-2xl animate-pulse"></div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className="w-5 h-5 text-gray-300" />
                                    ))}
                                </div>
                                <div className="h-4 bg-gray-200 rounded w-24 mt-1 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="flex flex-col">
                {/* Premium Header Card */}
                <div
                    onClick={() => setOpen(!open)}
                    className="flex items-center justify-between mb-6 p-4 sm:p-6 rounded-2xl border border-gray-300/80 bg-gradient-to-r from-white to-gray-50/80 shadow-sm hover:shadow-lg transition-all duration-500 cursor-pointer group backdrop-blur-sm"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                        {/* Rating Section */}
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <span className="text-lg font-bold text-white">{averageRating}</span>
                                </div>
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                    <Shield className="w-3 h-3 text-white" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <ReactStars
                                    count={5}
                                    size={22}
                                    isHalf={true}
                                    value={parseFloat(averageRating)}
                                    edit={false}
                                    activeColor="#f59e0b"
                                />
                                <span className="text-gray-600 text-sm font-medium mt-1">
                                    ({reviews.length} Trusted Reviews)
                                </span>
                            </div>
                        </div>

                        {/* Premium Badges */}
                        {/* <div className="flex items-center gap-4"> */}
                            {/* <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200">
                                <ThumbsUp className="w-4 h-4 text-blue-600" />
                                {/* <span className="text-xs font-medium text-blue-700">{recentReviews} Recent</span> */}
                            {/* </div> */} 
                        {/* </div> */}
                    </div>

                    {/* Animated Chevron */}
                    <div className="transform transition-transform duration-500 group-hover:scale-110">
                        <div className={`p-2 rounded-full bg-white border border-gray-300 shadow-sm transition-all duration-500 ${open ? 'rotate-180 bg-gray-50' : ''}`}>
                            <ChevronDown className="w-5 h-5 text-gray-600" />
                        </div>
                    </div>
                </div>

                {/* Premium Expanded Content */}
                <div
                    className={`transition-all duration-700 ease-in-out overflow-hidden ${open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                        }`}
                >
                    <div className="bg-gradient-to-br from-white to-gray-50/80 p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-300/80 backdrop-blur-sm">
                        {/* Header Section */}
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                                    Customer Reviews
                                </h2>
                                <p className="text-gray-600 text-sm">Authentic feedback from verified customers</p>
                            </div>
                            
                            {/* Overall Rating Card */}
                            <div className="bg-white p-4 rounded-2xl border border-gray-300/80 shadow-sm min-w-[200px]">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-gray-900 mb-1">{averageRating}</div>
                                    <ReactStars
                                        count={5}
                                        size={20}
                                        isHalf={true}
                                        value={parseFloat(averageRating)}
                                        edit={false}
                                        activeColor="#f59e0b"
                                    />
                                    <div className="text-sm text-gray-500 mt-1">{reviews.length} global ratings</div>
                                </div>
                            </div>
                        </div>

                        {/* Rating Distribution */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
                            <div className="space-y-3">
                                {[5, 4, 3, 2, 1].map((star) => {
                                    const count = reviews.filter((r) => Math.round(r.rating) === star).length;
                                    const percentage = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
                                    
                                    return (
                                        <div key={star} className="flex items-center gap-4 group">
                                            <span className="w-12 text-sm font-medium text-amber-600 flex items-center gap-1">
                                                {star}
                                                <Star className="w-4 h-4 fill-amber-400" />
                                            </span>
                                            <div className="flex-1">
                                                <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                                                    <div
                                                        className="h-3 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-1000 ease-out group-hover:from-amber-500 group-hover:to-amber-600"
                                                        style={{ 
                                                            width: `${percentage}%`,
                                                            transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <span className="w-12 text-sm font-medium text-gray-700 text-right">
                                                {percentage}%
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Trust Indicators */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                            <div className="bg-white p-4 rounded-2xl border border-gray-300/80 shadow-sm text-center">
                                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                                    <Shield className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="text-lg font-semibold text-gray-900">{reviews.length}</div>
                                <div className="text-sm text-gray-600">Total Reviews</div>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-gray-300/80 shadow-sm text-center">
                                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                                    <ThumbsUp className="w-6 h-6 text-blue-600" />
                                </div>
                                {/* <div className="text-lg font-semibold text-gray-900">{recentReviews}</div>
                                <div className="text-sm text-gray-600">Recent Reviews</div> */}
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-gray-300/80 shadow-sm text-center">
                                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                                    <Star className="w-6 h-6 text-amber-600 fill-amber-400" />
                                </div>
                                <div className="text-lg font-semibold text-gray-900">{averageRating}/5</div>
                                <div className="text-sm text-gray-600">Average Rating</div>
                            </div>
                        </div>

                        {/* Premium CTA Button */}
                        <button
                            onClick={handlereview}
                            disabled={buyLoading}
                            className="w-full py-4 bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {buyLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <LoaderCircle className="w-5 h-5 animate-spin" />
                                    <span>Loading...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-3">
                                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                        ✍️
                                    </div>
                                    <span className="text-lg">Rate This Product</span>
                                </div>
                            )}
                        </button>

                        {/* Trust Note */}
                        <div className="text-center mt-4">
                            <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                                <Shield className="w-3 h-3" />
                                All reviews are verified and protected by our trust system
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Reviews