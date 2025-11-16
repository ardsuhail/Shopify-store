"use client"
import React, { useState } from 'react'
import { Truck, Clock, MapPin, Package, CheckCircle, Shield, CreditCard, Lock, Mail, Phone, Globe, ChevronDown, ChevronUp } from 'lucide-react'

const ShippingInformation = () => {
  const [openSections, setOpenSections] = useState({})

  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const shippingData = {
    domestic: {
      title: "Domestic Shipping (India)",
      timeline: "2-7 Business Days",
      cost: "FREE",
      freeShipping: "Free shipping on all orders"
    },
    processing: {
      title: "Order Processing",
      time: "1-2 Business Days",
      description: "We prepare your order with care"
    }
  }

  const sections = [
    {
      id: 'delivery-timeline',
      icon: <Clock className="w-6 h-6" />,
      title: 'Delivery Timeline',
      content: `🚚 Standard Delivery: 2-7 business days
📍 Delivery times vary by location:
• Metro Cities: 2-4 days
• Tier 2 Cities: 3-5 days  
• Tier 3 Cities & Rural Areas: 5-7 days

📦 Order Processing:
• Orders placed before 2 PM are processed same day
• Weekend orders processed next business day
• You'll receive tracking information via Shiprocket

Note: Delivery times may extend during festivals or extreme weather conditions. We appreciate your patience!`
    },
    {
      id: 'shipping-areas',
      icon: <MapPin className="w-6 h-6" />,
      title: 'Shipping Areas & Cost',
      content: `🇮🇳 Currently Serving: All India

💰 Shipping Costs:
• FREE Shipping on ALL orders
• No minimum order value required
• Complete transparency - no hidden charges

📍 Service Areas:
✅ All major metro cities
✅ Tier 2 & 3 cities  
✅ Most rural areas (via Shiprocket network)

We use Shiprocket as our shipping partner to ensure reliable delivery across India with real-time tracking.`
    },
    {
      id: 'tracking',
      icon: <Package className="w-6 h-6" />,
      title: 'Order Tracking',
      content: `📱 How to Track Your Order:

1. Order Confirmation: Immediate email with order details
2. Shipping Confirmation: Tracking number sent via email/SMS through Shiprocket
3. Live Tracking: Use tracking number on Shiprocket dashboard
4. Delivery Updates: Real-time status on your account

🔔 Notifications You'll Receive:
• Order confirmation email
• Shipping confirmation with tracking link
• Out for delivery alert
• Successful delivery confirmation

Need help tracking? Contact our support team via Instagram or email!`
    },
    {
      id: 'shipping-partner',
      icon: <Truck className="w-6 h-6" />,
      title: 'Shipping Partner',
      content: `🚛 Our Shipping Partner: Shiprocket

Why We Use Shiprocket:
✅ All India coverage including remote areas
✅ Real-time tracking dashboard
✅ Multiple courier partners for best service
✅ Secure handling and insurance
✅ Professional delivery network

📦 How It Works:
1. We process your order in 1-2 days
2. Shiprocket assigns best courier for your location
3. You get tracking details instantly
4. Real-time updates until delivery

Your orders are in safe hands with our trusted partner Shiprocket!`
    },
    {
      id: 'shipping-policy',
      icon: <Shield className="w-6 h-6" />,
      title: 'Shipping Policy',
      content: `📋 Our Shipping Guarantee:

• FREE shipping on all orders across India
• 1-2 business days order processing time
• 2-7 days delivery timeline
• Real-time tracking via Shiprocket
• Secure and insured deliveries

📍 Service Coverage:
Currently serving all Indian states and union territories through our Shiprocket network.

❌ Service Limitations:
• Some extremely remote areas may have longer delivery times
• Service temporarily unavailable in conflict-affected regions

🌍 International Shipping:
Currently focused on serving India. International shipping coming soon!`
    },
    {
      id: 'contact-support',
      icon: <Mail className="w-6 h-6" />,
      title: 'Contact & Support',
      content: `📞 Need Shipping Help?

We're here to assist you through:

📧 Email: shopovixstore@gmail.com
📱 Instagram: Direct message on our official page
💬 Contact Form: Available on our website

⏰ Support Hours:
• Monday to Saturday: 9:00 AM - 6:00 PM
• Sunday: 10:00 AM - 4:00 PM

We typically respond within 24 hours during business hours.

For urgent shipping issues, please include your order number in your message for faster resolution.`
    }
  ]

  const highlights = [
    {
      icon: <Truck className="w-8 h-8 text-green-600" />,
      title: "All India Delivery",
      description: "Serving across India via Shiprocket"
    },
    {
      icon: <Clock className="w-8 h-8 text-green-600" />,
      title: "2-7 Day Delivery",
      description: "Fast and reliable"
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "FREE Shipping",
      description: "On all orders"
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-green-600" />,
      title: "Real-time Tracking",
      description: "Via Shiprocket"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Premium Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center shadow-2xl">
                <Truck className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                <Globe className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent mb-4">
            Shipping Information
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            Fast, reliable, and completely FREE shipping across India via Shiprocket
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-green-200 shadow-sm">
              <Truck className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">All India Delivery</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-green-200 shadow-sm">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">FREE Shipping</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-green-200 shadow-sm">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Shiprocket Partner</span>
            </div>
          </div>
        </div>

        {/* Shipping Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-6 text-white shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-8 h-8 opacity-90" />
              <h3 className="text-xl font-bold">Domestic Shipping</h3>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{shippingData.domestic.timeline}</p>
              <p className="opacity-90">Standard Delivery</p>
              <div className="bg-white/20 rounded-xl p-3 mt-3">
                <p className="font-semibold text-lg">{shippingData.domestic.freeShipping}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-green-200 p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-8 h-8 text-green-600" />
              <h3 className="text-xl font-bold text-gray-900">Order Processing</h3>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-gray-900">{shippingData.processing.time}</p>
              <p className="text-gray-600">{shippingData.processing.description}</p>
            </div>
          </div>
        </div>

        {/* Policy Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {highlights.map((highlight, index) => (
            <div key={index} className="bg-white rounded-2xl border border-green-200 p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {highlight.icon}
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{highlight.title}</h3>
              <p className="text-sm text-gray-600">{highlight.description}</p>
            </div>
          ))}
        </div>

        {/* Interactive Shipping Sections */}
        <div className="space-y-6 mb-16">
          {sections.map((section) => (
            <div 
              key={section.id}
              className="bg-white rounded-3xl border border-green-200/80 shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-green-50/50 transition-colors duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {section.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      {section.title}
                      {openSections[section.id] && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Details</span>
                      )}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      Click to {openSections[section.id] ? 'collapse' : 'expand'} information
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:bg-green-200">
                  {openSections[section.id] ? (
                    <ChevronUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-green-600" />
                  )}
                </div>
              </button>
              
              <div 
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  openSections[section.id] ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-8 pb-8">
                  <div className="border-t border-green-200 pt-6">
                    <div className="prose prose-green max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed text-lg">
                        {section.content}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Support Section */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl shadow-2xl p-8 sm:p-12 text-center text-white">
          <div className="max-w-2xl mx-auto">
            <Mail className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl font-bold mb-4">Need Shipping Help?</h2>
            <p className="text-xl mb-8 opacity-90">
              Contact us via Instagram or email for any delivery questions
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <Mail className="w-8 h-8 mx-auto mb-3 opacity-90" />
                <p className="text-lg font-semibold mb-2">Email Support</p>
                <p className="text-lg font-bold">shopovixstore@gmail.com</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <Clock className="w-8 h-8 mx-auto mb-3 opacity-90" />
                <p className="text-lg font-semibold mb-2">AVG Response Time</p>
                <p className="text-lg font-bold">8Hours</p>
              </div>
            </div>
            <button 
              onClick={() => window.location = 'mailto:shopovixstore@gmail.com'}
              className="bg-white text-green-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
            >
              Contact Shipping Support
            </button>
          </div>
        </div>

        {/* Final Note */}
        <div className="text-center mt-12 py-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-green-200 shadow-sm">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Reliable Delivery Guaranteed</h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We partner with Shiprocket to ensure your orders reach you safely and on time with complete FREE shipping. 
              Your satisfaction is our delivery promise.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShippingInformation