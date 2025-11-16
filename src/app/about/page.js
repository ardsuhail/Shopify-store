"use client"
import React from 'react'
import Link from 'next/link'
import { 
  Star, 
  Shield, 
  Truck, 
  HeadphonesIcon, 
  Award, 
  Users, 
  Target, 
  Heart,
  CheckCircle,
  Instagram,
  Mail,
  MapPin,
  Clock,
  ThumbsUp
} from 'lucide-react'

const AboutPage = () => {
  const stats = [
    { number: '10,000+', label: 'Happy Customers', icon: Users },
    { number: '500+', label: 'Quality Products', icon: Award },
    { number: '24/7', label: 'Customer Support', icon: HeadphonesIcon },
    // { number: '150+', label: 'Cities Served', icon: MapPin }
  ]

  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To make innovative, high-quality products accessible to every Indian home at affordable prices.'
    },
    {
      icon: Heart,
      title: 'Our Philosophy',
      description: 'We believe in building relationships, not just making sales. Every customer is family.'
    },
    {
      icon: Shield,
      title: 'Our Promise',
      description: 'Complete transparency in pricing, genuine products, and hassle-free shopping experience.'
    }
  ]

  const features = [
    {
      icon: CheckCircle,
      title: 'Handpicked Products',
      description: 'Every product undergoes rigorous quality checks and is selected based on real customer needs.'
    },
    {
      icon: Star,
      title: 'Premium Quality',
      description: 'We never compromise on quality. Each item is tested for durability and performance.'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Quick shipping across India with real-time tracking and safe packaging.'
    },
    {
      icon: HeadphonesIcon,
      title: '24/7 Support',
      description: 'Round-the-clock customer service to resolve your queries instantly.'
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
            Welcome to <span className="text-yellow-300">Shopovix</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Where <span className="font-semibold">Innovation Meets Everyday Living</span> - 
            Transforming Your Daily Experience One Product at a Time
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
              🛍️ Curated Excellence
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
              🤝 Customer First
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
              🚀 Fast & Reliable
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-emerald-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                Our <span className="text-emerald-600">Journey</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Shopovix began with a simple yet powerful vision - to make modern, innovative products 
                accessible to every Indian household. What started as a small online store has blossomed into 
                a trusted brand serving thousands of satisfied customers across the nation.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Each product in our collection reflects our passion for solving everyday challenges with 
                style, intelligence, and affordability. We&apos;re not just selling products we&apos;re enhancing 
                lifestyles and building a community of smart shoppers.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-emerald-600">
                  <ThumbsUp className="w-5 h-5" />
                  <span className="font-semibold">Trusted Brand</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-600">
                  <Award className="w-5 h-5" />
                  <span className="font-semibold">Quality Assured</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-100">
                <div className="grid gap-6">
                  {values.map((value, index) => (
                    <div key={index} className="flex gap-4 group">
                      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <value.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{value.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{value.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Why <span className="text-emerald-600">Choose Shopovix?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We&apos;re different because we care about what truly matters - your satisfaction and trust.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-emerald-200">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Difference Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              What Makes Us <span className="text-emerald-600">Different?</span>
            </h2>
            <p className="text-lg text-gray-600 mb-12 leading-relaxed">
              While big stores focus on volume, we focus on value. Here's how we stand out:
            </p>

            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">We Understand You</h3>
                <p className="text-gray-600">
                  We listen to your needs and curate products that solve real problems in your daily life.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="text-4xl mb-4">💝</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Human Connection</h3>
                <p className="text-gray-600">
                  We build relationships, not just process orders. Every interaction matters to us.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="text-4xl mb-4">🔓</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Complete Transparency</h3>
                <p className="text-gray-600">
                  No hidden costs, no false promises. What you see is what you get, always.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Experience the Shopovix Difference?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of satisfied customers who trust us for their daily needs.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link 
              href="/products" 
              className="bg-white text-emerald-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              Start Shopping Now
            </Link>
            <Link 
              href="/contact" 
              className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-colors duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Connect Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Let's Build Something Amazing Together</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            We&apos;re not just an online store - we&apos;re building a community of smart, modern shoppers.
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8 border border-pink-100">
              <Instagram className="w-12 h-12 text-pink-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Instagram</h3>
              <p className="text-gray-600 mb-4">@shopovix</p>
              <p className="text-sm text-gray-500">Behind-the-scenes & updates</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100">
              <Mail className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Email</h3>
              <p className="text-gray-600 mb-4">shopovixstore@gmail.com</p>
              <p className="text-sm text-gray-500">24-48 hour response</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
              <Clock className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Support</h3>
              <p className="text-gray-600 mb-4">Always Available</p>
              <p className="text-sm text-gray-500">Quick resolutions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Thank You */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="text-6xl mb-6">😊</div>
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Thank You for Choosing Shopovix!
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Your trust means everything to us. we&apos;re committed to making sure you always have 
              a reason to come back with a smile. Welcome to the Shopovix family!
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage