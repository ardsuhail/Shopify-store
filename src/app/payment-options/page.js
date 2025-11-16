"use client"
import React, { useState } from 'react'
import { CreditCard, Shield, Lock, CheckCircle, Smartphone, QrCode, Building, AlertCircle, ChevronDown, ChevronUp, Mail, Phone } from 'lucide-react'

const PaymentOptions = () => {
  const [openSections, setOpenSections] = useState({})

  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const paymentMethods = [
    {
      id: 'upi',
      name: 'UPI Payments',
      icon: <QrCode className="w-8 h-8" />,
      methods: ['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI', 'Any UPI App'],
      description: 'Instant payment with any UPI app'
    },
    {
      id: 'cards',
      name: 'Credit/Debit Cards',
      icon: <CreditCard className="w-8 h-8" />,
      methods: ['Visa', 'MasterCard', 'RuPay', 'American Express'],
      description: 'Secure card payments'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: <Building className="w-8 h-8" />,
      methods: ['All Major Indian Banks'],
      description: 'Direct bank transfer'
    },
    {
      id: 'wallets',
      name: 'Digital Wallets',
      icon: <Smartphone className="w-8 h-8" />,
      methods: ['Paytm Wallet', 'MobiKwik', 'FreeCharge'],
      description: 'Quick wallet payments'
    }
  ]

  const sections = [
    {
      id: 'payment-security',
      icon: <Shield className="w-6 h-6" />,
      title: 'Payment Security',
      content: `🔒 Your Security is Our Priority:

• SSL Encrypted Connection: All data is encrypted end-to-end
• PCI DSS Compliant: We meet international security standards
• Razorpay Secure: Powered by India's leading payment gateway
• No Data Storage: We never store your card or UPI details
• 3D Secure: Additional authentication for card payments

Your financial information is protected with bank-level security measures.`
    },
    {
      id: 'payment-process',
      icon: <CheckCircle className="w-6 h-6" />,
      title: 'Payment Process',
      content: `🔄 How Payments Work:

1. Select your preferred payment method
2. Enter required details securely
3. Complete authentication (if required)
4. Receive instant payment confirmation
5. Get order confirmation email

Payment Status:
✅ Successful: Order confirmed immediately
❌ Failed: No amount deducted, try again
⏳ Processing: Wait for confirmation

All transactions are processed in Indian Rupees (₹).`
    },
    {
      id: 'supported-methods',
      icon: <CreditCard className="w-6 h-6" />,
      title: 'Supported Payment Methods',
      content: `💳 All Indian Payment Options Available:

UPI Payments:
• Google Pay, PhonePe, Paytm, BHIM UPI
• Any UPI ID payments
• QR code scanning

Cards:
• Visa, MasterCard, RuPay, American Express
• Credit and Debit cards
• International cards (if enabled)

Net Banking:
• All major Indian banks
• Instant bank transfers

Digital Wallets:
• Paytm Wallet, MobiKwik, FreeCharge
• Ola Money, Amazon Pay

We support 100+ payment options through Razorpay.`
    },
    {
      id: 'currency-pricing',
      icon: <Building className="w-6 h-6" />,
      title: 'Currency & Pricing',
      content: `💰 Transparent Pricing:

• All prices in Indian Rupees (₹)
• Inclusive of all applicable taxes
• No hidden charges or fees
• Clear breakdown before payment

Tax Breakdown:
• GST applicable as per Indian laws
• Shipping charges shown separately
• Final amount displayed before payment

Payment in INR ensures no foreign exchange fees for Indian customers.`
    },
    {
      id: 'troubleshooting',
      icon: <AlertCircle className="w-6 h-6" />,
      title: 'Troubleshooting',
      content: `🔧 Common Payment Issues & Solutions:

Payment Failed:
• Check card/bank account balance
• Verify card details are correct
• Ensure 3D Secure authentication is completed
• Contact your bank if issue persists

UPI Payment Issues:
• Ensure UPI app is updated
• Check UPI PIN is correct
• Verify UPI ID is active
• Try scanning QR code instead

General Tips:
• Use stable internet connection
• Keep payment app updated
• Don't refresh page during payment
• Save payment confirmation screenshot

Need immediate help? Contact our support team!`
    }
  ]

  const securityFeatures = [
    {
      icon: <Lock className="w-8 h-8 text-green-600" />,
      title: "SSL Encrypted",
      description: "Bank-level security"
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "PCI DSS Compliant",
      description: "International standards"
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-green-600" />,
      title: "Razorpay Secure",
      description: "Trusted payment partner"
    },
    {
      icon: <CreditCard className="w-8 h-8 text-green-600" />,
      title: "3D Secure",
      description: "Extra authentication layer"
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
                <CreditCard className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                <Shield className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent mb-4">
            Payment Options
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            Secure, fast, and multiple payment methods for your convenience
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-green-200 shadow-sm">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">100% Secure</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-green-200 shadow-sm">
              <Lock className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">PCI DSS Compliant</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-green-200 shadow-sm">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Instant Confirmation</span>
            </div>
          </div>
        </div>

        {/* Payment Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {paymentMethods.map((method) => (
            <div key={method.id} className="bg-white rounded-3xl border border-green-200 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white">
                  {method.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{method.name}</h3>
                  <p className="text-green-600 text-sm">{method.description}</p>
                </div>
              </div>
              <div className="space-y-2">
                {method.methods.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Security Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {securityFeatures.map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl border border-green-200 p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Interactive Payment Sections */}
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
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl shadow-2xl p-8 sm:p-12 text-center text-white mb-12">
          <div className="max-w-2xl mx-auto">
            <Phone className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl font-bold mb-4">Payment Issues?</h2>
            <p className="text-xl mb-8 opacity-90">
              Our support team is here to help with any payment-related questions
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <Mail className="w-8 h-8 mx-auto mb-3 opacity-90" />
                <p className="text-lg font-semibold mb-2">Email Support</p>
                <p className="text-xl font-bold">shopovixstore@gmail.com</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <CheckCircle className="w-8 h-8 mx-auto mb-3 opacity-90" />
                <p className="text-lg font-semibold mb-2">Response Time</p>
                <p className="text-xl font-bold">Within 24 Hours</p>
              </div>
            </div>
            <button 
              onClick={() => window.location = 'mailto:shopovixstore@gmail.com'}
              className="bg-white text-green-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
            >
              Contact Payment Support
            </button>
          </div>
        </div>

        {/* Final Trust Note */}
        <div className="text-center py-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-green-200 shadow-sm">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Payments Are Safe With Us</h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We use Razorpay, one of India&apos;s most trusted payment gateways, to ensure your 
              financial transactions are secure, fast, and reliable. Shop with complete peace of mind.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentOptions