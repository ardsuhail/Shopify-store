"use client"
import React, { useState } from 'react'
import { Shield, Lock, Eye, Trash2, Download, Mail, ChevronDown, ChevronUp, CheckCircle, FileText, Server, Cookie, Users } from 'lucide-react'

const PrivacyPolicy = () => {
  const [openSections, setOpenSections] = useState({})

  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const sections = [
    {
      id: 'information-collection',
      icon: <FileText className="w-6 h-6" />,
      title: 'Information We Collect',
      content: `At Shopovix, we believe in transparency. Here's what we collect:
      
• Personal Information: Name, email address, phone number, shipping and billing address
• Payment Information: Payment method details (we do not store your card or UPI info)
• Device Information: IP address, browser type, operating system, and device identifiers
• Usage Data: Pages visited, time spent, and interactions with our site

We only collect what's necessary to provide you with the best shopping experience.`
    },
    {
      id: 'information-usage',
      icon: <Server className="w-6 h-6" />,
      title: 'How We Use Your Information',
      content: `Your information helps us serve you better. We use it to:

• Process your orders and deliver your products efficiently
• Provide exceptional customer support when you need it
• Continuously improve our website and shopping experience
• Send updates, order confirmations, and promotional emails (only with your consent)
• Comply with legal obligations and maintain security

Every use is designed to enhance your experience with us.`
    },
    {
      id: 'information-sharing',
      icon: <Users className="w-6 h-6" />,
      title: 'Sharing Your Information',
      content: `We value your privacy and do not sell or rent your personal information to third parties. We only share when necessary with:

• Trusted payment gateways for secure transaction processing
• Reliable shipping partners to ensure timely delivery
• Analytics providers to help us understand and improve user experience
• Law enforcement only when required by applicable laws

All our partners are carefully vetted and required to protect your data with the same standards we maintain.`
    },
    {
      id: 'cookies',
      icon: <Cookie className="w-6 h-6" />,
      title: 'Cookies and Tracking Technologies',
      content: `We use cookies to enhance your browsing experience:

• Remember your login and cart preferences for convenience
• Understand user behavior to optimize site performance
• Provide a smooth and personalized shopping journey

You have full control - you can manage or delete cookies anytime through your browser settings.`
    },
    {
      id: 'data-rights',
      icon: <Download className="w-6 h-6" />,
      title: 'Your Data Rights',
      content: `You're in control of your data. You have the right to:

• Access all personal data we hold about you
• Request correction of any inaccurate information
• Request deletion of your personal data
• Withdraw consent for marketing communications
• Request a portable copy of your information

To exercise any of these rights, simply email us at shopovixstore@gmail.com and we'll promptly assist you.`
    },
    {
      id: 'data-retention',
      icon: <Trash2 className="w-6 h-6" />,
      title: 'Data Retention',
      content: `We believe in data minimization. We retain your personal information only as long as necessary to:

• Provide our services to you
• Comply with legal obligations
• Resolve disputes and enforce agreements

You can request deletion of your data at any time, and we'll process it in accordance with applicable laws.`
    },
    {
      id: 'security',
      icon: <Lock className="w-6 h-6" />,
      title: 'Security Measures',
      content: `Your security is our priority. We implement:

• Advanced technical security measures including encryption
• Comprehensive organizational security protocols
• Regular security assessments and updates
• Staff training on data protection best practices

While we implement robust security measures, please note that no method of transmission over the Internet is 100% secure. We continuously work to enhance our security practices.`
    },
    {
      id: 'policy-changes',
      icon: <Eye className="w-6 h-6" />,
      title: 'Policy Updates',
      content: `We may update this Privacy Policy to reflect:

• Changes in our data practices
• Evolving legal requirements
• Enhancements in data protection standards

Any changes will be posted here with an updated effective date. We encourage you to review this policy periodically.`
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
                <Shield className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            Your privacy and trust are fundamental to everything we do at Shopovix
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-green-200 shadow-sm">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-green-200 shadow-sm">
              <Lock className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Secure Data</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-green-200 shadow-sm">
              <Eye className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Transparent</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-green-200 shadow-sm max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500">Effective Date</p>
                <p className="font-semibold text-gray-900">July 18, 2025</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Store</p>
                <p className="font-semibold text-gray-900">Shopovix.store</p>
              </div>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-3xl border border-green-200/80 shadow-2xl p-8 mb-12">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed">
              At <strong>Shopovix</strong>, we respect your privacy and are committed to protecting your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you visit our website. 
              We believe in being transparent about our practices so you can shop with confidence.
            </p>
          </div>
        </div>

        {/* Interactive Policy Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div 
              key={section.id}
              className="bg-white rounded-3xl border border-green-200/80 shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-green-50/50 transition-colors duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    {section.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      {section.title}
                      {openSections[section.id] && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Expanded</span>
                      )}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      Click to {openSections[section.id] ? 'collapse' : 'expand'} details
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center transition-transform duration-300">
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
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl shadow-2xl p-8 sm:p-12 mt-16 text-center text-white">
          <div className="max-w-2xl mx-auto">
            <Mail className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl font-bold mb-4">Questions About Your Privacy?</h2>
            <p className="text-xl mb-8 opacity-90">
              We&apos;re here to help you understand how we protect your data
            </p>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-8">
              <p className="text-2xl font-semibold mb-2">shopovixstore@gmail.com</p>
              <p className="opacity-90">We typically respond within 24 hours</p>
            </div>
            <button 
              onClick={() => window.location = 'mailto:shopovixstore@gmail.com'}
              className="bg-white text-green-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
            >
              Contact Our Privacy Team
            </button>
          </div>
        </div>

        {/* Final Trust Note */}
        <div className="text-center mt-12 py-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-green-200 shadow-sm">
            <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Privacy Matters</h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Thank you for trusting Shopovix. We&apos;re committed to protecting your privacy 
              and providing a secure shopping experience. Your trust is the foundation of our relationship.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy