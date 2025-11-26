"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Script from "next/script";
import {
  ShieldCheck,
  Truck,
  Clock,
  CreditCard,
  Smartphone,
  Wallet,
  CheckCircle2,
  ChevronDown
} from "lucide-react";
import { Suspense } from "react";
const PremiumCheckoutPage = () => {

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  
  const quantity = parseInt(searchParams.get("quantity")) || 1;
  const itemsParam = searchParams.get("items");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    pincode: "",
    country: "India",
    state: "",
    city: ""
  });
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  // const [orderAmount, setOrderAmount] = useState("");
  // const [finalAmount, setFinalAmount] = useState("");
  // const [finalAmount, setFinalAmount] = useState(orderAmount);
  const [message, setMessage] = useState("");
  const [cartItems, setCartItems] = useState([])

  const router = useRouter()
  useEffect(() => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "InitiateCheckout");
  }
}, []);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      const res = await fetch(`/api/getProduct?id=${id}`);
      const data = await res.json();
      setProduct(data.product);
      setLoading(false);
    };

    fetchProduct();
  }, [id]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        // CASE 1: Cart se aaye hain (multiple items)
        if (itemsParam) {
          const parsedItems = JSON.parse(decodeURIComponent(itemsParam));
          setCartItems(Array.isArray(parsedItems) ? parsedItems : [parsedItems]);
          setLoading(false);
        }
        // CASE 2: Single product se aaye hain (Buy Now) - ORIGINAL LOGIC
        else if (id) {
          const res = await fetch(`/api/getProduct?id=${id}`);
          const data = await res.json();
          setProduct(data.product);
          setLoading(false);
          
          // Single product ko cart items format mein bhi set karo for totals
          const cartItem = {
            id: data.product.id,
            title: data.product.title,
            product_price: data.product.price || data.product.variants?.[0]?.price,
            product_image: data.product.image || data.product.images?.[0]?.src,
            quantity: quantity
          };
          setCartItems([cartItem]);
        }
        // CASE 3: Kuch bhi nahi mila
        else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error loading checkout data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [itemsParam, id, quantity]);

  // ✅ ORIGINAL CALCULATION SAME - Dono cases handle karo
  const subtotal = itemsParam 
    ? cartItems.reduce((total, item) => total + (parseFloat(item.product_price) * item.quantity), 0)
    : product ? product.price * quantity : 0;
  
  const shippingCost = 0;
  const grandTotal = subtotal + shippingCost - discount;

  // setOrderAmount(subtotal)
  // setFinalAmount(grandTotal)
  
  const getFirstImageUrl = (product) => {
    return product?.image || product?.images?.[0] || "/default-image.jpg";
  };

  const utmData = {
  fbclid: searchParams.get("fbclid") || "",
  utm_source: searchParams.get("utm_source") || "",
  utm_campaign: searchParams.get("utm_campaign") || "",
  utm_medium: searchParams.get("utm_medium") || "",
};
  // ✅ handleBuyNow function mein yeh change karo:
  const handleBuyNow = async () => {
    // ✅ Form validation
    if (!validateForm()) return;

    setPayLoading(true);

    try {
      const amount = grandTotal;
  const productsData = itemsParam ? cartItems : [product];
      const res = await fetch("/api/customer-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          ...formData,
          product: productsData, // ✅ Array me wrap karo
          totalAmount: amount,
          paymentMethod: paymentMethod,
          // ✅ Consistent field names use karo
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          pixelData:utmData

        })
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Order creation failed");
      }

      // ✅ COD handling
      if (paymentMethod === "cod") {
        localStorage.setItem("orderCompleted", "true");
        router.push(`/thank-you?name=${formData.fullName}&orderId=${data.order?.orderId}&total=${amount}&payment=COD`);
        return;
      }

      // ✅ Razorpay handling
      const orderID = data.order?.id; // ✅ Razorpay order ID

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: Math.round(amount * 100),
        currency: "INR",
        name: "Shopovix",
        description: "Thanks for your purchase!",
        image: "https://www.shopovix.store/cdn/shop/files/Screenshot_2025-03-11_000546.png",
        order_id: orderID,
        // ... rest of options
        // ✅ Clean handler function
        handler: async function (response) {
          try {
            const verifyRes = await fetch("/api/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: orderID,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              // ✅ Success - redirect to thank you page
              router.push(`/thank-you?name=${formData.fullName}&orderId=${data.order?.orderId}&total=${grandTotal}&paymentmethod=${paymentMethod}&address=${formData.address}`);
            } else {
              alert("Payment verification failed");
            }
          } catch (err) {
            alert("Payment error occurred");
          } finally {
            setPayLoading(false);
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone
        },
        theme: { color: "#3399cc" }
      }

      // Razorpay integration continue...
      if (typeof window !== "undefined" && window.Razorpay) {
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      } else {
        console.error("❌ Razorpay SDK not loaded");
        alert("Payment gateway not loaded. Please refresh and try again.");
        setPayLoading(false);
      }
    } catch (error) {
      console.error("Order error:", error);
      alert(error.message || "Something went wrong");
    } finally {
      setPayLoading(false);
    }

  };

  // ✅ Form validation function
  const validateForm = () => {
    const required = ['fullName', 'phone', 'email', 'address', 'pincode', 'state', 'city'];
    for (let field of required) {
      if (!formData[field]?.trim()) {
        alert(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    // ✅ Phone validation
    if (formData.phone.length < 10) {
      alert("Please enter a valid phone number");
      return false;
    }

    // ✅ Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address");
      return false;
    }

    return true;
  };
    const applyCoupon = async () => {
    if (!couponCode) {
      setMessage("Please enter a coupon code");
      return;
    }

    try {
      const res = await fetch("/api/coupon/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode,
          orderAmount: grandTotal,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error);
        return;
      }

      setDiscount(data.discount);
      // setFinalAmount(data.finalAmount);
      setMessage("Coupon applied successfully 🎉");

    } catch (err) {
      setMessage("Something went wrong");
    }
  };
  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-pulse text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your premium experience...</p>
      </div>
    </div>
  );

  if (!itemsParam && !product) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-xl text-gray-700">Product Not Found</p>
    </div>
  );
  return (
    <>  <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>
      <div className="min-h-screen bg-gray-50">
        {/* Trust Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium">SSL Secure</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium">Secure Payment</span>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Need help? <span className="text-blue-600 font-medium">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Product Summary */}
             <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                {itemsParam ? (
                  // ✅ Cart items display
                  <div className="space-y-4">
                    {cartItems.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 border-b pb-4 last:border-b-0">
                        <img
                          src={item.product_image}
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded-xl shadow-sm"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item.title}</h3>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                            </div>
                            <span className="text-lg font-semibold text-gray-900">
                              ₹{(parseFloat(item.product_price) * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // ✅ Single product display - ORIGINAL SAME
                  <div className="flex items-center space-x-4">
                    <img
                      src={product?.image}
                      alt={product?.title}
                      className="w-20 h-20 object-cover rounded-xl shadow-sm"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{product?.title}</h3>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Qty:</span>
                          <select
                            className="border rounded-lg px-3 py-1 text-sm"
                            value={quantity}
                            onChange={(e) => window.location.href = `/checkout?id=${id}&quantity=${e.target.value}`}
                          >
                            {[1, 2, 3, 4, 5,6,7,8,9,10].map(num => (
                              <option key={num} value={num}>{num}</option>
                            ))}
                          </select>
                        </div>
                        <span className="text-lg font-semibold text-gray-900">₹{product?.price}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Customer Information */}
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="+91 00000 00000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Complete Address *
                    </label>
                    <textarea
                      rows={3}
                      required
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Street address, apartment, floor, etc."
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="110001"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      disabled
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 text-gray-600"
                      value="India"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Method - Only Free Shipping */}
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Method</h2>
                <div className="space-y-4">
                  <div className="border-2 border-blue-500 bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Truck className="w-5 h-5 text-gray-600" />
                        <div>
                          <h3 className="font-medium text-gray-900">Free Shipping</h3>
                          <p className="text-sm text-gray-600">Free • 2-7 business days</p>
                        </div>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method - Only Online and COD */}
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>
                <div className="space-y-4">
                  <div
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === "online" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                      }`}
                    onClick={() => setPaymentMethod("online")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-900">Online Payment</span>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                        {paymentMethod === "online" && (
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                    </div>
                    {paymentMethod === "online" && (
                      <div className="mt-3 text-sm text-gray-600">
                        <p>You will be redirected to Razorpay for secure payment</p>
                      </div>
                    )}
                  </div>
                  <div
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === "cod" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                      }`}
                    onClick={() => setPaymentMethod("cod")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Wallet className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-900">Cash on Delivery</span>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                        {paymentMethod === "cod" && (
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border p-6 sticky top-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Total</h2>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span>Free</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Discount</span>
                      <span className="text-green-600">-₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>₹{grandTotal.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
                  </div>
                </div>

                {/* Coupon Code */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apply Coupon
                  </label>

                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 border w-full border-gray-300 rounded-xl px-4 py-2"
                      placeholder="Enter coupon code"
                    />

                    <button
                      onClick={applyCoupon}
                      className="bg-black text-white px-4 py-2 rounded-xl font-medium hover:bg-gray-800 transition-colors"
                    >
                      Apply
                    </button>
                  </div>

                  {message && (
                    <p className="mt-2 text-sm text-blue-600">{message}</p>
                  )}
                </div>


                {/* Place Order Button */}

                <button
                  onClick={
                    handleBuyNow
                   
                  }
                  disabled={payLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {payLoading ? "Processing..." : paymentMethod === "online" ? "Pay Securely" : "Place Order (COD)"}
                </button>

                {/* Trust Badges */}
                <div className="mt-6 text-center space-y-3">
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <ShieldCheck className="w-4 h-4 text-green-600" />
                      <span>SSL Secure</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      <span>PCI Compliant</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Your payment information is encrypted and secure
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Footer */}
        <div className="bg-white border-t mt-12">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <Truck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900">Free Shipping</h4>
                <p className="text-sm text-gray-600">On all orders</p>
              </div>
              <div>
                <ShieldCheck className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900">Secure Payment</h4>
                <p className="text-sm text-gray-600">100% Protected</p>
              </div>
              <div>
                <CheckCircle2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900">Quality Guarantee</h4>
                <p className="text-sm text-gray-600">7-Day Returns</p>
              </div>
              <div>
                <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900">24/7 Support</h4>
                <p className="text-sm text-gray-600">Always Here to Help</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Page() {
  return <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="animate-pulse text-center">
      <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
      <p className="text-gray-600">Loading your premium experience...</p>
    </div>
  </div>} >
    <PremiumCheckoutPage />
  </Suspense>
}