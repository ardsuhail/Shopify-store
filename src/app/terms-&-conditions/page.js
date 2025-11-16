"use client"
import React, { useState } from 'react'
import { FileText, Shield, CheckCircle, Package, Truck, RotateCcw, CreditCard, AlertCircle, Mail, Instagram, ChevronDown, ChevronUp, Users, Lock, Globe } from 'lucide-react'

const TermsAndConditions = () => {
  const [openSections, setOpenSections] = useState({})

  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const sections = [
    {
      id: 'website-use',
      icon: <Globe className="w-6 h-6" />,
      title: 'Use of Our Website',
      content: `By using Shopovix, you agree to the following terms:

• You are at least 16 years old or have legal parental/guardian consent
• You will provide accurate and up-to-date information during checkout
• You will not use our website for any illegal or unauthorized purpose
• You will not attempt to harm, disrupt, or interfere with our website's functionality

We reserve the right to terminate or suspend access to our website for violations of these terms.`
    },
    {
      id: 'product-information',
      icon: <Package className="w-6 h-6" />,
      title: 'Product Information',
      content: `We strive for accuracy in all product details, but please note:

• Minor color or appearance variations may occur due to lighting or screen settings
• All products are subject to availability and may run out of stock
• Prices may change without prior notice due to market conditions
• Product descriptions and images are for representative purposes only

We make every effort to ensure our product information is current and accurate.`
    },
    {
      id: 'orders-payments',
      icon: <CreditCard className="w-6 h-6" />,
      title: 'Orders and Payments',
      content: `Order Processing Guidelines:

• You will receive an order confirmation email upon successful placement
• Orders are processed only after successful payment verification
• We reserve the right to cancel any order at our discretion
• Order cancellation may occur due to: suspected fraud, stock unavailability, pricing errors, or restricted locations
• All payments are processed through secure, encrypted payment gateways

Your financial security is our top priority.`
    },
    {
      id: 'shipping-delivery',
      icon: <Truck className="w-6 h-6" />,
      title: 'Shipping & Delivery',
      content: `Delivery Expectations and Timelines:

• We aim to dispatch your order within 1-3 business days
• Standard delivery typically takes 4-7 working days depending on location
• Express shipping options may be available at checkout
• Delivery delays due to courier services or unforeseen circumstances are beyond our control
• Tracking information will be provided once your order is shipped

Please refer to our detailed Shipping Policy for complete information.`
    },
    {
      id: 'returns-refunds',
      icon: <RotateCcw className="w-6 h-6" />,
      title: 'Returns & Refunds',
      content: `Our Return and Refund Policy:

• Returns accepted for damaged, defective, or incorrect items only
• Return requests must be raised within 7 days of delivery
• Items must be in original condition with all tags attached
• Refunds processed to original payment method after quality inspection
• Return shipping costs may apply for non-defective items

Complete details available in our Refund Policy.`
    },
    {
      id: 'intellectual-property',
      icon: <FileText className="w-6 h-6" />,
      title: 'Intellectual Property',
      content: `Protection of Our Content:

• All content on Shopovix is our exclusive property
• This includes images, logos, graphics, text, and product designs
• Unauthorized use, reproduction, or distribution is strictly prohibited
• You may not use our content for commercial purposes without written permission
• Violations may result in legal action

We take intellectual property rights seriously.`
    },
    {
      id: 'third-party-services',
      icon: <Users className="w-6 h-6" />,
      title: 'Third-Party Services',
      content: `External Service Providers:

• We use trusted third-party services for payments, delivery, and analytics
• Their terms and privacy policies apply when using their services through our site
• We carefully select partners who meet our security and privacy standards
• We are not responsible for third-party service interruptions or issues
• Your data shared with third parties is protected by contractual agreements

We work only with reputable service providers.`
    },
    {
      id: 'liability',
      icon: <AlertCircle className="w-6 h-6" />,
      title: 'Limitation of Liability',
      content: `Understanding Our Responsibilities:

• We are not liable for indirect or incidental damages from website use
• Not responsible for losses due to delivery delays or damaged shipments
• Not liable for issues beyond our reasonable control
• Our total liability is limited to the order value in question
• We maintain appropriate insurance for business operations

We strive to provide reliable service while managing reasonable expectations.`
    },
    {
      id: 'terms-changes',
      icon: <Shield className="w-6 h-6" />,
      title: 'Changes to Terms',
      content: `Policy Updates and Modifications:

• We reserve the right to update these Terms at any time
• Changes will be effective immediately upon posting
• Continued use of our website constitutes acceptance of updated terms
• We will notify users of significant changes when possible
• The "Effective Date" at the top indicates the last revision

We recommend reviewing these terms periodically.`
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
                <FileText className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent mb-4">
            Terms & Conditions
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            Clear guidelines for a smooth and trustworthy shopping experience
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-green-200 shadow-sm">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Transparent Policies</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-green-200 shadow-sm">
              <Lock className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Secure Shopping</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-green-200 shadow-sm">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Buyer Protection</span>
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
                <p className="font-semibold text-gray-900">Shopovix.store</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Contact</p>
                <p className="font-semibold text-gray-900">shopovixstore@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Introduction */}
        <div className="bg-white rounded-3xl border border-green-200/80 shadow-2xl p-8 mb-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Shopovix</h2>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
              By accessing or using our website, you agree to be bound by the following Terms and Conditions. 
              Please read them carefully before placing any order or browsing our site. These terms are designed 
              to ensure a safe, fair, and enjoyable shopping experience for all our customers.
            </p>
          </div>
        </div>

        {/* Interactive Terms Sections */}
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
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Detailed</span>
                      )}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      Click to {openSections[section.id] ? 'collapse' : 'expand'} terms
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

        {/* Contact Section */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl shadow-2xl p-8 sm:p-12 text-center text-white mb-12">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-center gap-6 mb-8">
              <Mail className="w-12 h-12 opacity-90" />
              <Instagram className="w-12 h-12 opacity-90" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Questions About Our Terms?</h2>
            <p className="text-xl mb-8 opacity-90">
              We&apos;re here to clarify any questions you may have
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <p className="text-lg font-semibold mb-2">Email Support</p>
                <p className="text-2xl font-bold">shopovixstore@gmail.com</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <p className="text-lg font-semibold mb-2">Social Media</p>
                <p className="text-2xl font-bold">@shopovix</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location = 'mailto:shopovixstore@gmail.com'}
                className="bg-white text-green-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
              >
                Email Us
              </button>
              <button 
                onClick={() => window.open('https://instagram.com/shopovix', '_blank')}
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
              >
                Follow on Instagram
              </button>
            </div>
          </div>
        </div>

        {/* Final Trust Note */}
        <div className="text-center py-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-green-200 shadow-sm">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Thank You for Choosing Shopovix</h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We appreciate your trust and are committed to providing you with a smooth, reliable, 
              and enjoyable shopping experience. Your satisfaction is our top priority.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsAndConditions