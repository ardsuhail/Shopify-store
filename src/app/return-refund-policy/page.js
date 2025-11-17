"use client"
import React, { useState } from 'react'
import { RotateCcw, Shield, CheckCircle, Package, Truck, Clock, Mail, Instagram, ChevronDown, ChevronUp, AlertCircle, DollarSign, RefreshCw, Home } from 'lucide-react'

const ReturnRefundPolicy = () => {
  const [openSections, setOpenSections] = useState({})

  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const sections = [
    {
      id: 'eligibility',
      icon: <CheckCircle className="w-6 h-6" />,
      title: 'Eligibility for Returns',
      content: `We accept returns in the following cases:

✅ You received a damaged or defective product
✅ You received a wrong item
✅ The product is not as described on our website

Important Conditions:
• Products must be unused and in original condition
• All tags and packaging must be intact
• Return requests must be raised within 7 days of delivery
• Original proof of purchase is required

Your satisfaction is our priority, and we make the return process simple and transparent.`
    },
    {
      id: 'non-returnable',
      icon: <AlertCircle className="w-6 h-6" />,
      title: 'Items That Cannot Be Returned',
      content: `For health, safety, and fairness reasons, we cannot accept returns for:

❌ Products that are used or damaged after delivery
❌ Items purchased under clearance, sale, or final offers (unless defective)
❌ Personal care or hygiene products (due to safety concerns)
❌ Customized or personalized items
❌ Products without original packaging

These exceptions help us maintain quality standards and fair pricing for all customers.`
    },
    {
      id: 'return-process',
      icon: <RotateCcw className="w-6 h-6" />,
      title: 'How to Request a Return',
      content: `Initiating a return is simple and straightforward:

Step 1: Email us at support@shopovix.com with:
• Your Order ID
• Clear images showing the defect or issue
• Detailed reason for return

Step 2: Our support team will review your request within 24–48 hours

Step 3: If approved, we'll provide detailed return instructions

Step 4: Pack the item securely with all original packaging

we're committed to making this process as smooth as possible for you.`
    },
    {
      id: 'refund-process',
      icon: <DollarSign className="w-6 h-6" />,
      title: 'Refund Process',
      content: `Once we receive your returned item:

🔍 Inspection Phase:
• We carefully inspect the returned product
• Verify it meets our return conditions
• Check for original packaging and tags

💰 Refund Timeline:
• Approved refunds processed within 5–7 business days
• Issued to your original payment method
• You'll receive confirmation email upon completion

⏱️ Processing Times:
• UPI Refunds: 1-3 business days
• Card Refunds: 5-7 business days
• Wallet Refunds: 1-2 business days

We ensure transparent communication throughout the process.`
    },
    {
      id: 'missing-refunds',
      icon: <Clock className="w-6 h-6" />,
      title: 'Late or Missing Refunds',
      content: `If you haven't received your refund yet:

Step 1: Check your bank or payment account again
Step 2: Contact your bank - processing times may vary
Step 3: Still no refund? Email us at support@shopovix.com

Common Reasons for Delays:
• Bank processing times (especially on weekends)
• Incorrect account information
• Payment gateway delays
• Bank security checks

we'll work with you to resolve any issues promptly.`
    },
    {
      id: 'exchanges',
      icon: <RefreshCw className="w-6 h-6" />,
      title: 'Exchanges',
      content: `We offer exchanges for:

🔄 Defective or damaged items
🔄 Wrong size or color (based on your original order)
🔄 Items not matching the description

Exchange Process:
1. Contact us with your Order ID and issue description
2. we'll verify product availability for exchange
3. If available, we'll process the exchange immediately
4. You'll receive tracking information once shipped

Note: Exchanges are subject to product availability. If your desired item is out of stock, we'll offer a refund instead.`
    },
   {
  id: 'shipping',
  icon: <Truck className="w-6 h-6" />,
  title: 'Return Shipping Process',
  content: `Return Shipping Guidelines:

📦 Our Responsibility (Wrong/Defective Product):
• We cover complete return shipping cost
• Free pickup arranged from your location
• Prepaid shipping label provided
• Quick resolution within 24 hours

📦 Customer-Initiated Returns (Size/Change of Mind):
• Return shipping cost is customer's responsibility
• Use trackable courier service only
• Share tracking details with our support team
• Ensure original packaging is intact

🚚 Recommended Couriers:
• Delhivery • DTDC • Blue Dart
• Any reliable trackable service

💡 Important: 
• Returns without tracking won't be accepted
• Use insured shipping for high-value items
• Contact us before shipping for approval
• Refund processed after we receive and verify the product`
}
  ]

  const policyHighlights = [
    {
      icon: <Clock className="w-8 h-8 text-green-600" />,
      title: "7-Day Return Window",
      description: "Plenty of time to review your purchase"
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Hassle-Free Process",
      description: "Simple steps for returns & refunds"
    },
    {
      icon: <DollarSign className="w-8 h-8 text-green-600" />,
      title: "Quick Refunds",
      description: "Processed within 5-7 business days"
    },
    {
      icon: <Mail className="w-8 h-8 text-green-600" />,
      title: "24-48 Hour Response",
      description: "Fast support for your queries"
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
                <RotateCcw className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                <Shield className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent mb-4">
            Return & Refund Policy
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            Your satisfaction is our priority - Clear, fair, and transparent return process
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-green-200 shadow-sm">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Buyer Protection</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-green-200 shadow-sm">
              <Clock className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">7-Day Returns</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-green-200 shadow-sm">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Quick Refunds</span>
            </div>
          </div>

          {/* Effective Date & Contact */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-green-200 shadow-sm max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-sm text-gray-500">Last Update</p>
                <p className="font-semibold text-gray-900">July 18, 2025</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Store</p>
                <p className="font-semibold text-gray-900">Shopovix</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Contact</p>
                <p className="font-semibold text-gray-900">support@shopovix.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-3xl border border-green-200/80 shadow-2xl p-8 mb-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Satisfaction Matters</h2>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
              At <strong>Shopovix</strong>, we genuinely care about your shopping experience. 
              If something isn&apos;t right with your order, we&apos;re here to help. Our return and refund policy 
              is designed to be fair, transparent, and customer-friendly.
            </p>
          </div>
        </div>

        {/* Policy Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {policyHighlights.map((highlight, index) => (
            <div key={index} className="bg-white rounded-2xl border border-green-200 p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {highlight.icon}
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{highlight.title}</h3>
              <p className="text-sm text-gray-600">{highlight.description}</p>
            </div>
          ))}
        </div>

        {/* Interactive Policy Sections */}
        <div className="space-y-6 mb-16">
          {sections.map((section, index) => (
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
                      Click to {openSections[section.id] ? 'collapse' : 'expand'} policy details
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

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-8 text-white shadow-2xl">
            <Mail className="w-12 h-12 mb-4 opacity-90" />
            <h3 className="text-2xl font-bold mb-4">Ready to Return?</h3>
            <p className="text-lg mb-6 opacity-90">
              Start your return process by emailing us with your order details
            </p>
            <button 
              onClick={() => window.location = 'mailto:support@shopovix.com'}
              className="bg-white text-green-600 hover:bg-gray-100 font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Start Return Process
            </button>
          </div>
          
          <div className="bg-white rounded-3xl border border-green-200 p-8 shadow-2xl">
            <Package className="w-12 h-12 text-green-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h3>
            <p className="text-gray-700 mb-6">
              Our support team is here to assist you with any questions
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">support@shopovix.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Instagram className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">@shopovix</span>
              </div>
            </div>
          </div>
        </div>

        {/* Final Trust Note */}
        <div className="text-center py-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-green-200 shadow-sm">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Home className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Thank You for Shopping with Shopovix</h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              we&apos;re committed to giving you a smooth and reliable shopping experience every time. 
              Your trust is valuable to us, and we strive to maintain it through transparent policies 
              and excellent customer service.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReturnRefundPolicy