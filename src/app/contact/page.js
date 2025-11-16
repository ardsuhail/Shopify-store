"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  Shield,
  HeadphonesIcon,
  MessageCircle,
  Users,
  LoaderCircle

} from 'lucide-react'
import { Instagram } from 'lucide-react'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
 
  // Simple handler without TypeScript
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
   const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "name": formData.name,
  "email": formData.email,
  "phone": formData.phone,
  "subject": formData.subject,
  "message": formData.message
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("/api/query", requestOptions)
  .then((response) => response.json())
  .then((result) => {
    if(result.success){
      setLoading(false)
      setIsSubmitted(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
    }else{
      setLoading(false)
      setIsSubmitted(false)
      alert(result.message)
    }
    console.log(result)
  })
  .catch((error) => {
    setLoading(false)
    alert("Error submitting the form")
    setIsSubmitted(false)
    console.error(error)
  });
  }

  const contactMethods = [
    // {
    //   icon: Phone,
    //   title: 'Call Us',
    //   description: 'Speak directly with our support team',
    //   details: '+91 1800-123-4567',
    //   link: 'tel:+9118001234567',
    //   color: 'from-green-500 to-emerald-600'
    // },
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Send us an email anytime',
      details: 'support@shopovix.com',
      link: 'mailto:support@shopovix.com',
      color: 'from-blue-500 to-cyan-600'
    },
    // {
    //   icon: MessageCircle,
    //   title: 'Live Chat',
    //   description: 'Instant help via chat',
    //   details: 'Start Chat',
    //   link: '#chat',
    //   color: 'from-purple-500 to-pink-600'
    // },
    // {
    //   icon: MapPin,
    //   title: 'Visit Us',
    //   description: 'Our office location',
    //   details: 'Mumbai, Maharashtra',
    //   link: '#map',
    //   color: 'from-orange-500 to-red-600'
    // }
  ]

  const trustFeatures = [
    {
      icon: Shield,
      title: '100% Secure',
      description: 'Your data is protected with encryption'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock customer service'
    },
    {
      icon: CheckCircle,
      title: 'Quick Response',
      description: 'Typically reply within 24 hours'
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Trained professionals ready to help'
    }
  ]

  const faqs = [
    {
      question: 'What are your customer support hours?',
      answer: 'We provide 24/7 customer support through email. Our team is always ready to assist you.'
    },
    {
      question: 'How long does it take to get a response?',
      answer: 'We typically respond within 12 hours during business hours and within 24 hours for after-hours queries.'
    },
    {
      question: 'Do you offer support in regional languages?',
      answer: 'Yes! Our support team can assist you in Hindi, English.'
    },
    {
      question: 'Can I track my support ticket?',
      answer: 'Absolutely! You will receive a tracking number and can monitor your ticket status in real-time.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-emerald-600 to-teal-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-36 translate-x-36"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-48 -translate-x-48"></div>
        
        <div className="relative container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            We&apos;re Here to <span className="text-yellow-300">Help You</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Get in touch with our friendly team. We&apos;re always ready to assist you with any questions or concerns.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Quick Response
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              100% Secure
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30 flex items-center gap-2">
              <HeadphonesIcon className="w-5 h-5" />
              24/7 Support
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {trustFeatures.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className={`bg-gradient-to-r ${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Multiple Ways to <span className="text-emerald-600">Reach Us</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the most convenient way to get in touch with our support team
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {contactMethods.map((method, index) => (
              <Link
                key={index}
                href={method.link}
                className="group"
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-transparent group-hover:scale-105">
                  <div className={`bg-gradient-to-r ${method.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                    <method.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{method.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{method.description}</p>
                  <p className={`font-semibold ${
                    method.color.includes('green') ? 'text-emerald-600' :
                    method.color.includes('blue') ? 'text-blue-600' :
                    method.color.includes('purple') ? 'text-purple-600' : 'text-orange-600'
                  }`}>
                    {method.details}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Contact Form */}
          <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
            {/* Form Section */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-800 mb-2">
                  Send us a Message
                </h3>
                <p className="text-gray-600">
                  Fill out the form below and we&apos;ll get back to you within 24 hours
                </p>
              </div>

              {isSubmitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-4" />
                  <h4 className="text-2xl font-bold text-gray-800 mb-2">Message Sent Successfully!</h4>
                  <p className="text-gray-600 mb-6">
                    Thank you for contacting us. We&apos;ll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-300"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                        placeholder="+91 12345 67890"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="">Select a subject</option>
                      <option value="order-issue">Order Issue</option>
                      <option value="product-info">Product Information</option>
                      <option value="shipping">Shipping & Delivery</option>
                      <option value="returns">Returns & Refunds</option>
                      <option value="general">General Inquiry</option>
                      <option value="wholesale">Wholesale Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 resize-none"
                      placeholder="Please describe your inquiry in detail..."
                    />
                  </div>

                  {loading?(<div>
                  <button
                    disabled
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 transform shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                  >
                   <LoaderCircle className="w-5 h-5 animate-spin" />
                   Sending...
                   </button>
                  </div>):(
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                  >

                   <Send className="w-5 h-5" />
                   Send Message
                   </button>
                   
                  )} 
                   <p className="text-center text-sm text-gray-500 mt-4">
                   By submitting this form, you agree to our Privacy Policy
                   </p>
                </form>
              )}
            </div>

            {/* Info Section */}
            <div className="space-y-8">
              {/* Office Info */}
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">Our Business Hours</h3>
                <div className="space-y-4">
                  {/* <div className="flex items-center gap-4">
                    <MapPin className="w-6 h-6 text-yellow-300 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Head Office</p>
                      <p className="opacity-90">Mumbai, Maharashtra, India - 400001</p>
                    </div> */}
                  {/* </div> */}
                  <div className="flex items-center gap-4">
                    <Clock className="w-6 h-6 text-yellow-300 flex-shrink-0" />
                    <div>
                    
                      <p className="opacity-90">Monday - Sunday: 9:00 AM - 9:00 PM IST</p>
                    </div>
                  </div>
                  {/* <div className="flex items-center gap-4">
                    <Phone className="w-6 h-6 text-yellow-300 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Support Line</p>
                      <p className="opacity-90">+91 1800-123-4567 (Toll Free)</p>
                    </div> */}
                  {/* </div> */}
                </div>
              </div>

              {/* FAQ Section */}
              <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Quick Answers</h3>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <h4 className="font-semibold text-gray-800 mb-2">{faq.question}</h4>
                      <p className="text-gray-600 text-sm">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Stats */}
              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl p-8 text-white text-center">
                <h3 className="text-2xl font-bold mb-4">Why Customers Trust Us</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold mb-1">10K+</div>
                    <div className="text-sm opacity-90">Happy Customers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold mb-1">98%</div>
                    <div className="text-sm opacity-90">Satisfaction Rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold mb-1">8H</div>
                    <div className="text-sm opacity-90">Avg. Response</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold mb-1">24/7</div>
                    <div className="text-sm opacity-90">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Still Have Questions?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Don&apos;t hesitate to reach out. Our team is always here to help you with any questions or concerns.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link 
              href="https://www.instagram.com/shopovix" 
              target='blank'
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-colors duration-300 shadow-lg hover:shadow-xl flex items-center gap-3"
            >
              <Instagram className="w-5 h-5" />
              DM Us on Instagram
            </Link>
            <Link 
              href="mailto:support@shopovix.com" 
              className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-colors duration-300 flex items-center gap-3"
            >
              <Mail className="w-5 h-5" />
              Email Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactPage