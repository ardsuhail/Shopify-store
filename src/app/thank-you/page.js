"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  CheckCircle, 
  Truck, 
  Shield, 
  Clock, 
  Mail, 
  Phone, 
  MapPin,
  Download,
  Share2,
  Home,
  Instagram
} from "lucide-react";

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [orderDetails, setOrderDetails] = useState({
    name: searchParams.get("name") || "Customer",
    orderId: searchParams.get("orderId") || "",
    total: searchParams.get("total") || "0",
    payment: searchParams.get("payment") || "ONLINE",
    address: searchParams.get("address") || ""
  });

  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(20);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Countdown for redirect
    if (!loading) {
      const countdownTimer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownTimer);
            // router.push("/");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownTimer);
    }
  }, [loading, router]);

  useEffect(() => {
  if (countdown === 0) {
    router.push("/");
  }
}, [countdown, router]);
  // ✅ Last 8 characters of order ID
  const shortOrderId = orderDetails.orderId ? orderDetails.orderId.slice(-8) : "N/A";
  
  // ✅ Format amount properly
  const formattedAmount = orderDetails.total ? `₹${parseInt(orderDetails.total).toLocaleString()}` : "₹0";

  const handleDownloadInvoice = () => {
    alert("Invoice will be sent to your email!");
  };

 //simple share button but workss only pc👇

//   const handleShareOrder = () => {
//     if (navigator.share) {
//       navigator.share({
//         title: 'My Order from Shopovix',
//         text: `I just placed an order on Shopovix! Order ID: ${shortOrderId}`,
//         url: window.location.href,
//       });
//     } else {
//       navigator.clipboard.writeText(window.location.href);
//       alert("Order link copied to clipboard!");
//     }
//   };
const handleShareOrder = async () => {
  try {
    const shareData = {
      title: 'Shopovix Order Confirmation',
      text: `I just placed an order on Shopovix! Order ID: ${shortOrderId}. Total: ${formattedAmount}`,
      url: window.location.href,
    };

    // ✅ Check if native sharing is supported
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      // ✅ Fallback for desktop - copy link with better message
      fallbackCopyText();
    }
  } catch (err) {
    // User ne share cancel kiya - kuch mat karo
    console.log('Share was cancelled by user');
  }
};

// ✅ Better fallback for desktop
const fallbackCopyText = () => {
  const textToCopy = window.location.href;
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        // ✅ Custom toast-style notification instead of alert
        showCustomToast('📋 Link copied! You can now paste it anywhere.');
      })
      .catch(() => {
        showOldSchoolCopyPrompt(textToCopy);
      });
  } else {
    showOldSchoolCopyPrompt(textToCopy);
  }
};

// ✅ Custom toast notification
const showCustomToast = (message) => {
  // Create toast element
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #10B981;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-weight: 500;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    animation: slideIn 0.3s ease;
  `;
  
  // Add CSS animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // Remove after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      document.body.removeChild(toast);
      document.head.removeChild(style);
    }, 300);
  }, 3000);
};

// ✅ Old school copy prompt as last resort
const showOldSchoolCopyPrompt = (text) => {
  const tempInput = document.createElement('input');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  tempInput.setSelectionRange(0, 99999);
  
  try {
    document.execCommand('copy');
    showCustomToast('📋 Link copied to clipboard!');
  } catch (err) {
    // Final fallback - show text to copy manually
    const shouldCopy = confirm('📋 Copy this link to share:\n\n' + text + '\n\nPress OK to copy');
    if (shouldCopy) {
      tempInput.select();
      document.execCommand('copy');
      showCustomToast('✅ Link copied!');
    }
  }
  
  document.body.removeChild(tempInput);
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing your order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Shopovix</span>
            </div>
            <button
              onClick={() => router.push("/")}
              className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Thank you for your purchase, <span className="font-semibold text-green-600">{orderDetails.name}</span>
          </p>
          {/* <p className="text-gray-500">
            A confirmation email has been sent to your email address
          </p> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Details Card */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Order ID</h3>
                    <p className="text-lg font-semibold text-gray-900">{shortOrderId}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Payment Method</h3>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-green-500" />
                      <p className="text-lg font-semibold text-gray-900 capitalize">
                        {orderDetails.payment.toLowerCase()}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Total Amount</h3>
                    <p className="text-2xl font-bold text-green-600">{formattedAmount}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Order Date</h3>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date().toLocaleDateString('en-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address - ONLY IF ADDRESS IS AVAILABLE */}
            {orderDetails.address && (
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Address</h2>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900 mb-2">{orderDetails.name}</p>
                    <p className="text-gray-600 leading-relaxed">{orderDetails.address}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Next?</h2>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Order Confirmation</h3>
                    <p className="text-gray-600">Check your email for order details and tracking information</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Truck className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Shipping Updates</h3>
                    <p className="text-gray-600">We'll notify you when your order ships</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Delivery</h3>
                    <p className="text-gray-600">Expected delivery in 3-7 business days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleDownloadInvoice}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-semibold transition-colors"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Invoice</span>
                </button>
                
                <button
                  onClick={handleShareOrder}
                  className="w-full flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-semibold transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share Order</span>
                </button>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Need Help?</h3>
              <p className="mb-4 opacity-90">Follow us on Instagram for updates</p>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Instagram className="w-5 h-5 opacity-80" />
                  <span>@ardsuhail</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 opacity-80" />
                  <span>support@shopovix.store</span>
                </div>
              </div>
              
              <a 
                href="https://www.instagram.com/ardsuhail" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full mt-6 bg-white text-blue-600 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
              >
                <Instagram className="w-5 h-5" />
                <span>Follow on Instagram</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Why Shop With Us?</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span className="text-sm">100% Secure Payment</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Truck className="w-5 h-5 text-blue-500" />
                  <span className="text-sm">Free Shipping</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <span className="text-sm">24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Auto Redirect Notice */}
        <div className="text-center bg-white rounded-2xl shadow-sm border p-6 max-w-2xl mx-auto">
          <p className="text-gray-600 mb-2">
            You will be automatically redirected to the homepage in{" "}
            <span className="font-bold text-green-600">{countdown}</span> seconds
          </p>
          <button
            onClick={() => router.push("/")}
            className="text-blue-600 hover:text-blue-700 font-semibold underline"
          >
            Go to homepage now
          </button>
        </div>
      </div>


     
    </div>
  );
}