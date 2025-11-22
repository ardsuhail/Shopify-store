"use client";
import { useState } from "react";

export default function TrackOrderPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  const handleTrack = async () => {
    if (!input.trim()) {
      setError("Please enter your Order ID or AWB Code");
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch("/api/track-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          awb_code: input,
          orderId: input
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Order not found. Please check your tracking ID.");
        setLoading(false);
        return;
      }

      setOrder(data);
    } catch (err) {
      setError("Unable to connect. Please try again.");
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleTrack();
    }
  };

  const statusConfig = {
    "processing": {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: "🔄",
      label: "Processing"
    },
    "confirmed": {
      color: "bg-purple-100 text-purple-800 border-purple-200",
      icon: "✅",
      label: "Confirmed"
    },
    "shipped": {
      color: "bg-orange-100 text-orange-800 border-orange-200",
      icon: "📦",
      label: "Shipped"
    },
    "in transit": {
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: "🚚",
      label: "In Transit"
    },
    "out for delivery": {
      color: "bg-indigo-100 text-indigo-800 border-indigo-200",
      icon: "🏍️",
      label: "Out for Delivery"
    },
    "delivered": {
      color: "bg-green-100 text-green-800 border-green-200",
      icon: "🎉",
      label: "Delivered"
    },
    "cancelled": {
      color: "bg-red-100 text-red-800 border-red-200",
      icon: "❌",
      label: "Cancelled"
    },
  };

  const getCurrentStepIndex = () => {
    const steps = ["processing", "confirmed", "shipped", "in transit", "out for delivery", "delivered"];
    return steps.indexOf(order?.shiprocketStatus?.toLowerCase()) || 0;
  };

  const timelineSteps = [
    { status: "processing", label: "Order Placed", description: "Your order has been received" },
    { status: "confirmed", label: "Order Confirmed", description: "We're preparing your items" },
    { status: "shipped", label: "Shipped", description: "Your package is on the way" },
    { status: "in transit", label: "In Transit", description: "Moving through network" },
    { status: "out for delivery", label: "Out for Delivery", description: "Almost there!" },
    { status: "delivered", label: "Delivered", description: "Package delivered successfully" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">📦</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-600">
            Enter your <span className="font-semibold">Order ID</span>, <span className="font-semibold">AWB Code</span>, 
            or <span className="font-semibold">Razorpay ID</span>
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="space-y-4">
            <div>
              <label htmlFor="tracking" className="block text-sm font-medium text-gray-700 mb-2">
                Tracking Number
              </label>
              <input
                id="tracking"
                type="text"
                placeholder="e.g., ORD123, AWB123456, or razorpay_order_id"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 outline-none"
              />
            </div>

            <button
              onClick={handleTrack}
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Tracking...</span>
                </>
              ) : (
                <>
                  <span>🔍</span>
                  <span>Track Order</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2">
              <span className="text-red-500">⚠️</span>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Results */}
        {order && (
          <div className="space-y-6">
            {/* Order Details Card */}
            {order.orderDetails && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-medium">{order.orderDetails.orderId?.toString().substring(0, 8)}...</span>
                  </div>
                  {order.orderDetails.awbCode && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">AWB Code:</span>
                      <span className="font-medium">{order.orderDetails.awbCode}</span>
                    </div>
                  )}
                  {order.orderDetails.razorpayOrderId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Razorpay ID:</span>
                      <span className="font-medium text-sm">{order.orderDetails.razorpayOrderId}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">₹{order.orderDetails.totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment:</span>
                    <span className="font-medium capitalize">{order.orderDetails.paymentStatus}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Status Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h2>
              <div className={`flex items-center space-x-3 p-4 rounded-xl border ${statusConfig[order.shiprocketStatus?.toLowerCase()]?.color || "bg-gray-100 text-gray-800 border-gray-200"}`}>
                <span className="text-2xl">{statusConfig[order.shiprocketStatus?.toLowerCase()]?.icon || "📋"}</span>
                <div>
                  <p className="font-semibold capitalize">
                    {statusConfig[order.shiprocketStatus?.toLowerCase()]?.label || order.shiprocketStatus}
                  </p>
                  <p className="text-sm opacity-75">
                    Last updated: Just now
                  </p>
                </div>
              </div>

              {order.shiprocketError && (
                <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-700 text-sm">Note: {order.shiprocketError}</p>
                </div>
              )}
            </div>

            {/* Timeline Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Delivery Progress</h3>
              
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200">
                  <div 
                    className="bg-green-500 transition-all duration-1000 ease-out"
                    style={{ 
                      height: `${(getCurrentStepIndex() / (timelineSteps.length - 1)) * 100}%` 
                    }}
                  />
                </div>

                {/* Steps */}
                <div className="space-y-6">
                  {timelineSteps.map((step, index) => {
                    const isCompleted = index <= getCurrentStepIndex();
                    const isCurrent = index === getCurrentStepIndex();
                    
                    return (
                      <div key={step.status} className="flex items-start space-x-4 relative">
                        {/* Step Indicator */}
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 ${
                          isCompleted 
                            ? "bg-green-500 border-green-500 text-white" 
                            : isCurrent
                            ? "bg-white border-green-500 text-green-500"
                            : "bg-white border-gray-300 text-gray-400"
                        }`}>
                          {isCompleted ? "✓" : (index + 1)}
                        </div>
                        
                        {/* Step Content */}
                        <div className="flex-1 pb-6">
                          <p className={`font-medium ${
                            isCompleted || isCurrent ? "text-gray-900" : "text-gray-500"
                          }`}>
                            {step.label}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {step.description}
                          </p>
                          
                          {/* Current Status Badge */}
                          {isCurrent && (
                            <span className="inline-block mt-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                              Current Status
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Help Card */}
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
              <div className="flex items-start space-x-3">
                <span className="text-blue-500 text-lg">💡</span>
                <div>
                  <p className="font-medium text-blue-900">Need Help?</p>
                  <p className="text-blue-700 text-sm mt-1">
                    Contact our support team for any delivery questions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Note */}
        {!order && !error && (
          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">
              Can't find your tracking number? Check your order confirmation email.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}