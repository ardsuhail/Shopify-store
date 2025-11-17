// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import { Camera, CheckCircle, LoaderCircle, X, Eye, EyeOff, ArrowLeft } from 'lucide-react';

// export default function BannerAddPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const bannerId = searchParams ? searchParams.get('id') : null;

//   const [bannerForm, setBannerForm] = useState({
//     altText: '',
//     linkUrl: '',
//     position: 'top',
//     isActive: true,
//   });
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [imagePreview, setImagePreview] = useState(null);

//   useEffect(() => {
//     if (!bannerId) return;
    
//     setLoading(true);
//     setIsEditing(true);

//     fetch(`/api/banner/${bannerId}`)
//       .then((res) => {
//         if (!res.ok) throw new Error('Failed to fetch banner');
//         return res.json();
//       })
//       .then((data) => {
//         if (data && data.banner) {
//           const b = data.banner;
//           setBannerForm({
//             altText: b.altText || '',
//             linkUrl: b.linkUrl || '',
//             position: b.position || 'top',
//             isActive: b.isActive !== undefined ? b.isActive : true,
//           });
//           if (b.images || b.image) {
//             setFile(b.images || b.image);
//             setImagePreview(b.images || b.image);
//           }
//         }
//       })
//       .catch((err) => {
//         console.error('Error fetching banner:', err);
//         alert('Error loading banner data');
//       })
//       .finally(() => setLoading(false));
//   }, [bannerId]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setBannerForm((prev) => ({ 
//       ...prev, 
//       [name]: type === 'checkbox' ? checked : value 
//     }));
//   };

//   const handleFileChange = (e) => {
//     const selected = e.target.files && e.target.files[0];
//     if (!selected) return;
    
//     const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
//     if (!validTypes.includes(selected.type)) {
//       alert('Please select a valid image (JPG, PNG, WebP)');
//       return;
//     }
    
//     if (selected.size > 5 * 1024 * 1024) {
//       alert('Image size should be less than 5MB');
//       return;
//     }
    
//     setFile(selected);
//     setImagePreview(URL.createObjectURL(selected));
//   };

//   const removeImage = () => {
//     setFile(null);
//     setImagePreview(null);
//     const fileInput = document.querySelector('input[type="file"]');
//     if (fileInput) fileInput.value = '';
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Enhanced validation
//     if (!bannerForm.altText.trim()) {
//       alert('Alt Text is required');
//       return;
//     }

//     if (!file && !isEditing) {
//       alert('Please select an image');
//       return;
//     }

//     setLoading(true);
    
//     try {
//       const url = bannerId ? `/api/banner/${bannerId}` : '/api/banner';
//       const method = bannerId ? 'PATCH' : 'POST';
      
//       const formData = new FormData();
//       formData.append('altText', bannerForm.altText.trim());
//       formData.append('linkUrl', bannerForm.linkUrl.trim());
//       formData.append('position', bannerForm.position);
//       formData.append('isActive', bannerForm.isActive.toString());
      
//       if (file instanceof File) {
//         formData.append('image', file);
//       }

//       console.log("📤 Submitting to:", url, "Method:", method);
      
//       const response = await fetch(url, { 
//         method, 
//         body: formData 
//       });
      
//       const result = await response.json();
//       console.log("📨 Response:", result);
      
//       if (result.success) {
//         const successMessage = bannerId ? 'Banner updated successfully! 🎉' : 'Banner created successfully! 🎉';
//         alert(successMessage);
        
//         // Redirect to banners list
//         setTimeout(() => {
//           router.push('/admin/banner/allBanners');
//         }, 1000);
        
//       } else {
//         alert(result.message || 'Operation failed. Please try again.');
//       }
//     } catch (error) {
//       console.error('Save error:', error);
//       alert('Error saving banner. Please check your connection and try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBack = () => {
//     router.push('/admin/banner/allBanners');
//   };

//   const toggleActiveStatus = () => {
//     setBannerForm(prev => ({
//       ...prev,
//       isActive: !prev.isActive
//     }));
//   };

//   // Loading state
//   if (loading && bannerId) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4 flex items-center justify-center">
//         <div className="text-center">
//           <LoaderCircle className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
//           <p className="text-gray-600 text-lg">Loading banner data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
//       <div className="max-w-4xl mx-auto">
        
//         {/* Header Section with Back Button */}
//         <div className="flex items-center justify-between mb-8">
//           <button
//             onClick={handleBack}
//             className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-2xl transition-all duration-300 group"
//           >
//             <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
//             <span>Back to Banners</span>
//           </button>
          
//           <div className="text-center flex-1">
//             <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
//               {bannerId ? 'Edit Banner' : 'Create New Banner'}
//             </h1>
//             <p className="text-gray-600 max-w-md mx-auto">
//               {bannerId 
//                 ? 'Update your banner details and image' 
//                 : 'Upload banner image and configure settings for your website'
//               }
//             </p>
//           </div>
          
//           <div className="w-20"></div> {/* Spacer for balance */}
//         </div>

//         {/* Main Form */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
//           {/* Left Column - Form Fields */}
//           <div className="lg:col-span-2">
//             <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm rounded-3xl border border-green-200/80 shadow-2xl p-6 sm:p-8 space-y-8">
              
//               {/* Banner Information Section */}
//               <div className="space-y-6">
//                 <div className="flex items-center justify-between">
//                   <h2 className="text-xl font-semibold text-gray-900">Banner Details</h2>
//                   <div className="flex items-center gap-2 text-sm">
//                     <span className={`px-3 py-1 rounded-full font-medium ${
//                       bannerForm.isActive 
//                         ? 'bg-green-100 text-green-800 border border-green-200' 
//                         : 'bg-gray-100 text-gray-800 border border-gray-200'
//                     }`}>
//                       {bannerForm.isActive ? 'Active' : 'Inactive'}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 gap-6">
                  
//                   {/* Alt Text Input */}
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                       Alt Text for Banner *
//                     </label>
//                     <input 
//                       name="altText" 
//                       value={bannerForm.altText} 
//                       onChange={handleChange} 
//                       placeholder="Enter descriptive text for SEO and accessibility"
//                       required 
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-300 placeholder-gray-400 bg-white shadow-sm hover:shadow-md"
//                     />
//                   </div>

//                   {/* Link URL Input */}
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                       Link URL (Optional)
//                     </label>
//                     <input 
//                       type="url" 
//                       name="linkUrl" 
//                       value={bannerForm.linkUrl} 
//                       onChange={handleChange} 
//                       placeholder="https://example.com/your-page"
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-300 placeholder-gray-400 bg-white shadow-sm hover:shadow-md"
//                     />
//                   </div>

//                   {/* Position Selection */}
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                       Banner Position *
//                     </label>
//                     <select 
//                       name="position" 
//                       value={bannerForm.position} 
//                       onChange={handleChange} 
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-300 bg-white shadow-sm hover:shadow-md"
//                     >
//                       <option value="top">Top Banner</option>
//                       <option value="bottom">Bottom Banner</option>
//                       <option value="side">Side Banner</option>
//                     </select>
//                   </div>

//                   {/* Active Status Toggle */}
//                   <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
//                     <div className="space-y-1">
//                       <label className="text-sm font-medium text-gray-700">
//                         Banner Status
//                       </label>
//                       <p className="text-xs text-gray-500">
//                         {bannerForm.isActive 
//                           ? 'This banner is currently visible on your website' 
//                           : 'This banner is hidden from your website'
//                         }
//                       </p>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={toggleActiveStatus}
//                       className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
//                         bannerForm.isActive ? 'bg-green-600' : 'bg-gray-300'
//                       }`}
//                     >
//                       <span
//                         className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                           bannerForm.isActive ? 'translate-x-6' : 'translate-x-1'
//                         }`}
//                       />
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Submit Button */}
//               <div className="pt-6">
//                 <button
//                   type="submit"
//                   disabled={loading || (!file && !bannerId) || !bannerForm.altText.trim()}
//                   className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] disabled:hover:scale-100 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed group"
//                 >
//                   {loading ? (
//                     <div className="flex items-center justify-center gap-3">
//                       <LoaderCircle className="w-6 h-6 animate-spin" />
//                       <span>{bannerId ? 'Updating Banner...' : 'Creating Banner...'}</span>
//                     </div>
//                   ) : (
//                     <div className="flex items-center justify-center gap-3">
//                       <CheckCircle className="w-6 h-6" />
//                       <span>{bannerId ? 'Update Banner' : 'Create Banner'}</span>
//                     </div>
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>

//           {/* Right Column - Image Upload */}
//           <div className="lg:col-span-1">
//             <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-green-200/80 shadow-2xl p-6 sm:p-8 h-fit sticky top-8">
              
//               <div className="space-y-6">
//                 <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3 border-b pb-2">
//                   <Camera className="w-6 h-6 text-green-600" />
//                   Banner Image {!bannerId && '*'}
//                 </h2>

//                 <div className="space-y-4">
                  
//                   {/* Image Preview */}
//                   {imagePreview ? (
//                     <div className="relative group">
//                       <div className="w-full aspect-video rounded-2xl border-2 border-green-200 overflow-hidden shadow-lg bg-gray-100">
//                         <img
//                           src={imagePreview}
//                           alt="Banner preview"
//                           className="w-full h-full object-cover"
//                         />
//                       </div>
//                       <button
//                         type="button"
//                         onClick={removeImage}
//                         className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-lg transition-all duration-300 hover:scale-110"
//                       >
//                         <X className="w-4 h-4" />
//                       </button>
//                       <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
//                         Preview
//                       </div>
//                     </div>
//                   ) : (
//                     /* Upload Area */
//                     <label className="block w-full aspect-video border-3 border-dashed border-green-300 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-green-50 hover:border-green-400 transition-all duration-300 group shadow-lg hover:shadow-xl">
//                       <Camera className="w-12 h-12 text-green-500 group-hover:text-green-600 transition-colors" />
//                       <div className="text-center">
//                         <p className="text-sm font-medium text-green-600 group-hover:text-green-700">
//                           Click to upload image
//                         </p>
//                         <p className="text-xs text-gray-500 mt-1">
//                           JPG, PNG, WebP • Max 5MB
//                         </p>
//                       </div>
//                       <input
//                         type="file"
//                         onChange={handleFileChange}
//                         className="hidden"
//                         accept="image/jpeg,image/jpg,image/png,image/webp"
//                       />
//                     </label>
//                   )}

//                   {/* Image Info */}
//                   <div className="space-y-3">
//                     <div className="flex items-center justify-between text-sm">
//                       <span className="font-medium text-gray-700">Status:</span>
//                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                         file || imagePreview 
//                           ? 'bg-green-100 text-green-800' 
//                           : 'bg-yellow-100 text-yellow-800'
//                       }`}>
//                         {file || imagePreview ? 'Image Selected' : 'No Image'}
//                       </span>
//                     </div>
                    
//                     {bannerId && file && (
//                       <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3">
//                         <p className="text-xs text-blue-700 text-center">
//                           💡 Leave unchanged to keep current image
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Camera, CheckCircle, LoaderCircle, X, ArrowLeft } from 'lucide-react';

// Loading component for Suspense fallback
function BannerFormLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4 flex items-center justify-center">
      <div className="text-center">
        <LoaderCircle className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
        <p className="text-gray-600 text-lg">Loading banner form...</p>
      </div>
    </div>
  );
}

// Main component that uses useSearchParams
function BannerAddForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bannerId = searchParams ? searchParams.get('id') : null;

  const [bannerForm, setBannerForm] = useState({
    altText: '',
    linkUrl: '',
    position: 'top',
    isActive: true,
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (!bannerId) return;
    
    setLoading(true);
    setIsEditing(true);

    fetch(`/api/banner/${bannerId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch banner');
        return res.json();
      })
      .then((data) => {
        if (data && data.banner) {
          const b = data.banner;
          setBannerForm({
            altText: b.altText || '',
            linkUrl: b.linkUrl || '',
            position: b.position || 'top',
            isActive: b.isActive !== undefined ? b.isActive : true,
          });
          if (b.images || b.image) {
            setFile(b.images || b.image);
            setImagePreview(b.images || b.image);
          }
        }
      })
      .catch((err) => {
        console.error('Error fetching banner:', err);
        alert('Error loading banner data');
      })
      .finally(() => setLoading(false));
  }, [bannerId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBannerForm((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleFileChange = (e) => {
    const selected = e.target.files && e.target.files[0];
    if (!selected) return;
    
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(selected.type)) {
      alert('Please select a valid image (JPG, PNG, WebP)');
      return;
    }
    
    if (selected.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }
    
    setFile(selected);
    setImagePreview(URL.createObjectURL(selected));
  };

  const removeImage = () => {
    setFile(null);
    setImagePreview(null);
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Enhanced validation
    if (!bannerForm.altText.trim()) {
      alert('Alt Text is required');
      return;
    }

    if (!file && !isEditing) {
      alert('Please select an image');
      return;
    }

    setLoading(true);
    
    try {
      const url = bannerId ? `/api/banner/${bannerId}` : '/api/banner';
      const method = bannerId ? 'PATCH' : 'POST';
      
      const formData = new FormData();
      formData.append('altText', bannerForm.altText.trim());
      formData.append('linkUrl', bannerForm.linkUrl.trim());
      formData.append('position', bannerForm.position);
      formData.append('isActive', bannerForm.isActive.toString());
      
      if (file instanceof File) {
        formData.append('image', file);
      }

      console.log("📤 Submitting to:", url, "Method:", method);
      
      const response = await fetch(url, { 
        method, 
        body: formData 
      });
      
      const result = await response.json();
      console.log("📨 Response:", result);
      
      if (result.success) {
        const successMessage = bannerId ? 'Banner updated successfully! 🎉' : 'Banner created successfully! 🎉';
        alert(successMessage);
        
        // Redirect to banners list
        setTimeout(() => {
          router.push('/admin/banner/allBanners');
        }, 1000);
        
      } else {
        alert(result.message || 'Operation failed. Please try again.');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Error saving banner. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/admin/banner/allBanners');
  };

  const toggleActiveStatus = () => {
    setBannerForm(prev => ({
      ...prev,
      isActive: !prev.isActive
    }));
  };

  // Loading state for banner data
  if (loading && bannerId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <LoaderCircle className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading banner data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section with Back Button */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-2xl transition-all duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Banners</span>
          </button>
          
          <div className="text-center flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {bannerId ? 'Edit Banner' : 'Create New Banner'}
            </h1>
            <p className="text-gray-600 max-w-md mx-auto">
              {bannerId 
                ? 'Update your banner details and image' 
                : 'Upload banner image and configure settings for your website'
              }
            </p>
          </div>
          
          <div className="w-20"></div> {/* Spacer for balance */}
        </div>

        {/* Main Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Form Fields */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm rounded-3xl border border-green-200/80 shadow-2xl p-6 sm:p-8 space-y-8">
              
              {/* Banner Information Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Banner Details</h2>
                  <div className="flex items-center gap-2 text-sm">
                    <span className={`px-3 py-1 rounded-full font-medium ${
                      bannerForm.isActive 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-gray-100 text-gray-800 border border-gray-200'
                    }`}>
                      {bannerForm.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  
                  {/* Alt Text Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      Alt Text for Banner *
                    </label>
                    <input 
                      name="altText" 
                      value={bannerForm.altText} 
                      onChange={handleChange} 
                      placeholder="Enter descriptive text for SEO and accessibility"
                      required 
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-300 placeholder-gray-400 bg-white shadow-sm hover:shadow-md"
                    />
                  </div>

                  {/* Link URL Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      Link URL (Optional)
                    </label>
                    <input 
                      type="url" 
                      name="linkUrl" 
                      value={bannerForm.linkUrl} 
                      onChange={handleChange} 
                      placeholder="https://example.com/your-page"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-300 placeholder-gray-400 bg-white shadow-sm hover:shadow-md"
                    />
                  </div>

                  {/* Position Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      Banner Position *
                    </label>
                    <select 
                      name="position" 
                      value={bannerForm.position} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-300 bg-white shadow-sm hover:shadow-md"
                    >
                      <option value="top">Top Banner</option>
                      <option value="bottom">Bottom Banner</option>
                      <option value="side">Side Banner</option>
                    </select>
                  </div>

                  {/* Active Status Toggle */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">
                        Banner Status
                      </label>
                      <p className="text-xs text-gray-500">
                        {bannerForm.isActive 
                          ? 'This banner is currently visible on your website' 
                          : 'This banner is hidden from your website'
                        }
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={toggleActiveStatus}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                        bannerForm.isActive ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          bannerForm.isActive ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading || (!file && !bannerId) || !bannerForm.altText.trim()}
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] disabled:hover:scale-100 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-3">
                      <LoaderCircle className="w-6 h-6 animate-spin" />
                      <span>{bannerId ? 'Updating Banner...' : 'Creating Banner...'}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <CheckCircle className="w-6 h-6" />
                      <span>{bannerId ? 'Update Banner' : 'Create Banner'}</span>
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column - Image Upload */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-green-200/80 shadow-2xl p-6 sm:p-8 h-fit sticky top-8">
              
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3 border-b pb-2">
                  <Camera className="w-6 h-6 text-green-600" />
                  Banner Image {!bannerId && '*'}
                </h2>

                <div className="space-y-4">
                  
                  {/* Image Preview */}
                  {imagePreview ? (
                    <div className="relative group">
                      <div className="w-full aspect-video rounded-2xl border-2 border-green-200 overflow-hidden shadow-lg bg-gray-100">
                        <img
                          src={imagePreview}
                          alt="Banner preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-lg transition-all duration-300 hover:scale-110"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                        Preview
                      </div>
                    </div>
                  ) : (
                    /* Upload Area */
                    <label className="block w-full aspect-video border-3 border-dashed border-green-300 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-green-50 hover:border-green-400 transition-all duration-300 group shadow-lg hover:shadow-xl">
                      <Camera className="w-12 h-12 text-green-500 group-hover:text-green-600 transition-colors" />
                      <div className="text-center">
                        <p className="text-sm font-medium text-green-600 group-hover:text-green-700">
                          Click to upload image
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          JPG, PNG, WebP • Max 5MB
                        </p>
                      </div>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                      />
                    </label>
                  )}

                  {/* Image Info */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        file || imagePreview 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {file || imagePreview ? 'Image Selected' : 'No Image'}
                      </span>
                    </div>
                    
                    {bannerId && file && (
                      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3">
                        <p className="text-xs text-blue-700 text-center">
                          💡 Leave unchanged to keep current image
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function BannerAddPage() {
  return (
    <Suspense fallback={<BannerFormLoading />}>
      <BannerAddForm />
    </Suspense>
  );
}