// "use client"
// import React from 'react'
// import { useState, useEffect } from 'react'
// import ReactStars from "react-stars";
// import { useSearchParams } from 'next/navigation';
// import { useRouter } from 'next/navigation';
// import { LoaderCircle, Camera, AlertTriangle, Star, Shield, CheckCircle, User, Mail, MessageSquare, Image } from 'lucide-react';
// import { Suspense } from 'react'
// import { useSession } from 'next-auth/react';
// const Createreview = () => {
//   const [loading, setLoading] = useState(false)
//   const searchParams = useSearchParams();
//   const productId = searchParams.get("products");
//   const [error, setError] = useState(null)
//   const [message, setMessage] = useState(null)
//   const router = useRouter()
//   const { data: session } = useSession();
//   const [reviews, setReviews] = useState({
//     customerName: "",
//     email: "",
//     desc: "",
//     rating: 0,
//   })
//   const [files, setFiles] = useState([])
//   const [preview, setPreview] = useState(null);
//   const [errorMessage, setErrorMessage] = useState("")

//   // Handle file input
//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//     setFiles(prev => [...prev, ...files]);
//   };

//   // Remove selected image
//   const removeImage = (index) => {
//     setFiles(files.filter((_, i) => i !== index));
//   };

//   const handleChange = (e) => {
//     setReviews({ ...reviews, [e.target.name]: e.target.value })
//   }

//   const handleRatingChange = (newRating) => {
//     setReviews({ ...reviews, rating: newRating });
//   };

//   useEffect(() => {
//   if (session?.user?.email) {
//     setReviews(prev => ({ ...prev, email: session.user.email }));
//   }
// }, [session]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!reviews.customerName || !reviews.rating || !reviews.desc) {
//       setErrorMessage("All fields are required")
//       return;
//     }
//     setErrorMessage("")
//     setLoading(true)
//     const formdata = new FormData();
//     formdata.append("customerName", reviews.customerName);
//     formdata.append("email", reviews.email);
//     formdata.append("rating", reviews.rating);
//     formdata.append("desc", reviews.desc);
//     formdata.append("ProductId", productId);
//     files.forEach((files) => {
//       formdata.append("images", files);
//     })
    
//     const requestOptions = {
//       method: "POST",
//       body: formdata,
//       redirect: "follow"
//     };

//     fetch("/api/reviews", requestOptions)
//       .then((response) => response.json())
//       .then((result) => {
//         if (result.success) {
//           setLoading(false)
//           setReviews({
//             customerName: "",
//             email: "",
//             rating: "",
//             desc: ""
//           })
//           setFiles([])
//           setPreview([])
//           setLoading(true);
//           setTimeout(() => {
//             router.push(`/products/${productId}`);
//           }, 500);
//         } else {
//           setError(result.meesage || "server error")
//           setLoading(false)
//         }
//       })
//       .catch((error) => {
//         setError(error.message)
//         setLoading(false)
//       });
//   }

//   return (
//     <Suspense fallback={
//       <div className="flex justify-center items-center h-96">
//         <LoaderCircle className="animate-spin text-green-500 w-20 h-20" />
//       </div>
//     }>
//       {loading && (
//         <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
//           <div className="bg-white p-8 rounded-2xl shadow-2xl border border-green-200 flex flex-col items-center gap-4">
//             <LoaderCircle className="animate-spin text-green-500 w-12 h-12" />
//             <p className="text-gray-700 font-semibold">Submitting your review...</p>
//           </div>
//         </div>
//       )}

//       <div className="min-h-screen bg-gradient-to-br from-white to-green-50/30 py-8 px-4 sm:px-6 lg:px-8">
//         {/* Premium Header */}
//         <div className="max-w-2xl mx-auto text-center mb-8">
//           <div className="flex items-center justify-center gap-3 mb-4">
//             <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
//               <Star className="w-6 h-6 text-white" />
//             </div>
//             <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">
//               Share Your Experience
//             </h1>
//           </div>
//           <p className="text-gray-600 text-lg">Help others by sharing your honest review</p>
//         </div>

//         {/* Trust Badges */}
//         <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
//           <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-green-200 shadow-sm text-center">
//             <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
//             <p className="text-sm font-semibold text-gray-700">Verified Review</p>
//           </div>
//           <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-green-200 shadow-sm text-center">
//             <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
//             <p className="text-sm font-semibold text-gray-700">Secure Submission</p>
//           </div>
//           <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-green-200 shadow-sm text-center">
//             <Star className="w-8 h-8 text-amber-500 mx-auto mb-2" />
//             <p className="text-sm font-semibold text-gray-700">Honest Ratings</p>
//           </div>
//         </div>

//         <div className="max-w-2xl mx-auto">
//           <form
//             onSubmit={handleSubmit}
//             className="bg-white/90 backdrop-blur-sm rounded-3xl border border-green-200/80 shadow-2xl p-6 sm:p-8 space-y-8"
//           >
//             {/* Personal Information Section */}
//             <div className="space-y-6">
//               <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
//                 <User className="w-6 h-6 text-green-600" />
//                 Personal Information
//               </h2>
              
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                 {/* Name Input */}
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                     <User className="w-4 h-4 text-green-600" />
//                     Your Name *
//                   </label>
//                   <input
//                     type="text"
//                     name="customerName"
//                     required
//                     value={reviews.customerName}
//                     onChange={handleChange}
//                     placeholder="Enter your full name"
//                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-300 placeholder-gray-400 bg-white shadow-sm hover:shadow-md"
//                   />
//                 </div>

//                 {/* Email Input */}
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                     <Mail className="w-4 h-4 text-green-600" />
//                     Email Address
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
//                     required
//                     value={reviews.email}
//                     readOnly={!!session?.user?.email}
//                     onChange={handleChange}
//                     placeholder="your@email.com"
//                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-300 placeholder-gray-400 bg-white shadow-sm hover:shadow-md"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Rating Section */}
//             <div className="space-y-6">
//               <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
//                 <Star className="w-6 h-6 text-amber-500" />
//                 Your Rating *
//               </h2>
              
//               <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-6 text-center">
//                 <ReactStars
//                   count={5}
//                   onChange={handleRatingChange}
//                   size={42}
//                   isHalf={true}
//                   value={reviews.rating}
//                   activeColor="#f59e0b"
//                   emptyIcon={<i className="fa-regular fa-star"></i>}
//                   halfIcon={<i className="fa-solid fa-star-half-stroke"></i>}
//                   fullIcon={<i className="fa-solid fa-star"></i>}
//                 />
//                 <p className="text-sm text-amber-700 mt-3 font-medium">
//                   {reviews.rating ? `You rated: ${reviews.rating} stars` : "Select your rating"}
//                 </p>
//               </div>
//             </div>

//             {/* Review Content Section */}
//             <div className="space-y-6">
//               <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
//                 <MessageSquare className="w-6 h-6 text-green-600" />
//                 Your Review *
//               </h2>
              
//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-gray-700">Share your experience</label>
//                 <textarea
//                   name="desc"
//                   value={reviews.desc}
//                   onChange={handleChange}
//                   placeholder="Tell us about your experience with this product... What did you like? What could be improved?"
//                   rows={6}
//                   className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none resize-none transition-all duration-300 placeholder-gray-400 bg-white shadow-sm hover:shadow-md"
//                 />
//               </div>
//             </div>

//             {/* Image Upload Section */}
//             <div className="space-y-6">
//               <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
//                 <Image className="w-6 h-6 text-green-600" />
//                 Add Photos (Optional)
//               </h2>
              
//               <div className="space-y-4">
//                 <div className="flex flex-wrap gap-4">
//                   {/* Image Previews */}
//                   {files.map((img, id) => (
//                     <div
//                       key={`file-${id}`}
//                       className="relative group"
//                     >
//                       <div className="w-24 h-24 rounded-2xl border-2 border-green-200 overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
//                         <img
//                           src={URL.createObjectURL(img)}
//                           alt={`img-${id}`}
//                           className="w-full h-full object-cover"
//                         />
//                       </div>
//                       <button
//                         type="button"
//                         onClick={() => removeImage(id)}
//                         className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-lg transition-all duration-300 transform hover:scale-110"
//                       >
//                         ×
//                       </button>
//                     </div>
//                   ))}

//                   {/* Upload Button */}
//                   <label className="w-24 h-24 border-3 border-dashed border-green-300 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-green-50 hover:border-green-400 transition-all duration-300 group shadow-lg hover:shadow-xl">
//                     <Camera className="w-8 h-8 text-green-500 group-hover:text-green-600 transition-colors" />
//                     <span className="text-xs font-medium text-green-600 group-hover:text-green-700">
//                       Upload
//                     </span>
//                     <input
//                       type="file"
//                       multiple
//                       onChange={handleFileChange}
//                       className="hidden"
//                       accept="image/*"
//                     />
//                   </label>
//                 </div>
//                 <p className="text-sm text-gray-500">Add photos to make your review more helpful (Max 5 images)</p>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <div className="pt-6">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed group"
//               >
//                 {loading ? (
//                   <div className="flex items-center justify-center gap-3">
//                     <LoaderCircle className="w-6 h-6 animate-spin" />
//                     <span>Submitting Review...</span>
//                   </div>
//                 ) : (
//                   <div className="flex items-center justify-center gap-3">
//                     <CheckCircle className="w-6 h-6" />
//                     <span>Submit Your Review</span>
//                   </div>
//                 )}
//               </button>
//             </div>

//             {/* Trust Note */}
//             <div className="text-center pt-4">
//               <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
//                 <Shield className="w-4 h-4 text-green-600" />
//                 Your review helps other customers make better decisions
//               </p>
//             </div>
//           </form>

//           {/* Error Message */}
//           {errorMessage && (
//             <div className="mt-6 flex items-center gap-4 p-6 bg-red-50 border border-red-200 rounded-2xl shadow-lg max-w-2xl mx-auto">
//               <AlertTriangle className="text-red-600 w-6 h-6 flex-shrink-0" />
//               <div>
//                 <p className="text-red-700 font-semibold text-base">{errorMessage}</p>
//                 <p className="text-red-600 text-sm mt-1">Please fill in all required fields marked with *</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </Suspense>
//   )
// }

// export default Createreview


"use client"
import React from 'react'
import { useState, useEffect, Suspense } from 'react'
import dynamic from 'next/dynamic';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LoaderCircle, Camera, AlertTriangle, Star, Shield, CheckCircle, User, Mail, MessageSquare, Image } from 'lucide-react';

// ReactStars ko dynamically import karo SSR disable karke
const ReactStars = dynamic(() => import("react-stars"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} className="w-8 h-8 text-gray-300" />
      ))}
    </div>
  )
});

// Loading component for Suspense fallback
function CreateReviewLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50/30 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="text-center">
        <LoaderCircle className="animate-spin text-green-500 w-12 h-12 mx-auto mb-4" />
        <p className="text-gray-700 font-semibold">Loading review form...</p>
      </div>
    </div>
  );
}

// Main component that uses useSearchParams
function CreateReviewContent() {
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams();
  const productId = searchParams.get("products");
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const router = useRouter()
  const { data: session } = useSession();
  const [reviews, setReviews] = useState({
    customerName: "",
    email: "",
    desc: "",
    rating: 0,
  })
  const [files, setFiles] = useState([])
  const [preview, setPreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState("")

  // Handle file input
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFiles(prev => [...prev, ...files]);
  };

  // Remove selected image
  const removeImage = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    setReviews({ ...reviews, [e.target.name]: e.target.value })
  }

  const handleRatingChange = (newRating) => {
    setReviews({ ...reviews, rating: newRating });
  };

  useEffect(() => {
    if (session?.user?.email) {
      setReviews(prev => ({ ...prev, email: session.user.email }));
    }
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reviews.customerName || !reviews.rating || !reviews.desc) {
      setErrorMessage("All fields are required")
      return;
    }
    setErrorMessage("")
    setLoading(true)
    const formdata = new FormData();
    formdata.append("customerName", reviews.customerName);
    formdata.append("email", reviews.email);
    formdata.append("rating", reviews.rating);
    formdata.append("desc", reviews.desc);
    formdata.append("ProductId", productId);
    files.forEach((files) => {
      formdata.append("images", files);
    })
    
    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };

    fetch("/api/reviews", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setLoading(false)
          setReviews({
            customerName: "",
            email: "",
            rating: "",
            desc: ""
          })
          setFiles([])
          setPreview([])
          setLoading(true);
          setTimeout(() => {
            router.push(`/products/${productId}`);
          }, 500);
        } else {
          setError(result.meesage || "server error")
          setLoading(false)
        }
      })
      .catch((error) => {
        setError(error.message)
        setLoading(false)
      });
  }

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl border border-green-200 flex flex-col items-center gap-4">
            <LoaderCircle className="animate-spin text-green-500 w-12 h-12" />
            <p className="text-gray-700 font-semibold">Submitting your review...</p>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-white to-green-50/30 py-8 px-4 sm:px-6 lg:px-8">
        {/* Premium Header */}
        <div className="max-w-2xl mx-auto text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">
              Share Your Experience
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Help others by sharing your honest review</p>
        </div>

        {/* Trust Badges */}
        <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-green-200 shadow-sm text-center">
            <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-700">Verified Review</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-green-200 shadow-sm text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-700">Secure Submission</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-green-200 shadow-sm text-center">
            <Star className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-700">Honest Ratings</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="bg-white/90 backdrop-blur-sm rounded-3xl border border-green-200/80 shadow-2xl p-6 sm:p-8 space-y-8"
          >
            {/* Personal Information Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                <User className="w-6 h-6 text-green-600" />
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <User className="w-4 h-4 text-green-600" />
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    required
                    value={reviews.customerName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-300 placeholder-gray-400 bg-white shadow-sm hover:shadow-md"
                  />
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-green-600" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={reviews.email}
                    readOnly={!!session?.user?.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-300 placeholder-gray-400 bg-white shadow-sm hover:shadow-md"
                  />
                </div>
              </div>
            </div>

            {/* Rating Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                <Star className="w-6 h-6 text-amber-500" />
                Your Rating *
              </h2>
              
              <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-6 text-center">
                <ReactStars
                  count={5}
                  onChange={handleRatingChange}
                  size={42}
                  isHalf={true}
                  value={reviews.rating}
                  activeColor="#f59e0b"
                />
                <p className="text-sm text-amber-700 mt-3 font-medium">
                  {reviews.rating ? `You rated: ${reviews.rating} stars` : "Select your rating"}
                </p>
              </div>
            </div>

            {/* Review Content Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-green-600" />
                Your Review *
              </h2>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Share your experience</label>
                <textarea
                  name="desc"
                  value={reviews.desc}
                  onChange={handleChange}
                  placeholder="Tell us about your experience with this product... What did you like? What could be improved?"
                  rows={6}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none resize-none transition-all duration-300 placeholder-gray-400 bg-white shadow-sm hover:shadow-md"
                />
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                <Image className="w-6 h-6 text-green-600" />
                Add Photos (Optional)
              </h2>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  {/* Image Previews */}
                  {files.map((img, id) => (
                    <div
                      key={`file-${id}`}
                      className="relative group"
                    >
                      <div className="w-24 h-24 rounded-2xl border-2 border-green-200 overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
                        <img
                          src={URL.createObjectURL(img)}
                          alt={`img-${id}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(id)}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-lg transition-all duration-300 transform hover:scale-110"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  {/* Upload Button */}
                  <label className="w-24 h-24 border-3 border-dashed border-green-300 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-green-50 hover:border-green-400 transition-all duration-300 group shadow-lg hover:shadow-xl">
                    <Camera className="w-8 h-8 text-green-500 group-hover:text-green-600 transition-colors" />
                    <span className="text-xs font-medium text-green-600 group-hover:text-green-700">
                      Upload
                    </span>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-500">Add photos to make your review more helpful (Max 5 images)</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <LoaderCircle className="w-6 h-6 animate-spin" />
                    <span>Submitting Review...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircle className="w-6 h-6" />
                    <span>Submit Your Review</span>
                  </div>
                )}
              </button>
            </div>

            {/* Trust Note */}
            <div className="text-center pt-4">
              <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                Your review helps other customers make better decisions
              </p>
            </div>
          </form>

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-6 flex items-center gap-4 p-6 bg-red-50 border border-red-200 rounded-2xl shadow-lg max-w-2xl mx-auto">
              <AlertTriangle className="text-red-600 w-6 h-6 flex-shrink-0" />
              <div>
                <p className="text-red-700 font-semibold text-base">{errorMessage}</p>
                <p className="text-red-600 text-sm mt-1">Please fill in all required fields marked with *</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Main page component with Suspense boundary
function Createreview() {
  return (
    <Suspense fallback={<CreateReviewLoading />}>
      <CreateReviewContent />
    </Suspense>
  );
}

export default Createreview;