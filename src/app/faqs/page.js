"use client"
import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { 
    Search, 
    ChevronDown, 
    ChevronUp, 
    Shield, 
    Truck, 
    CreditCard, 
    RotateCcw, 
    MessageCircle,
    Phone,
    Mail,
    Clock,
    Star,
    Award,
    CheckCircle,
    Heart
} from 'lucide-react'

import { Instagram } from 'lucide-react'

const FAQsPage = () => {
    const [openItems, setOpenItems] = useState({})
    const [searchTerm, setSearchTerm] = useState('')

    const toggleItem = (id) => {
        setOpenItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    // FAQ Categories with comprehensive questions
  const faqCategories = [
    {
        id: 'ordering',
        title: 'Ordering & Payments',
        icon: <CreditCard className="w-6 h-6" />,
        questions: [
            {
                id: 'order-1',
                question: 'How can I place an order?',
                answer: 'Placing an order is simple! Browse our collections,categories,or products listing page or search any product  select your desired products and click and proceed to checkout. You will need to provide your shipping details and choose a payment method. We accept all major credit/debit cards, UPI, net banking, and wallet payments through Razorpay.'
            },
            {
                id: 'order-2',
                question: 'What payment methods do you accept?',
                answer: 'We accept multiple secure payment options including Credit/Debit Cards (Visa, MasterCard, American Express), UPI payments (Google Pay, PhonePe, Paytm), Net Banking, and Digital Wallets. All payments are securely processed through Razorpay, which is PCI-DSS compliant and ensures your financial data is protected.'
            },
            {
                id: 'order-3',
                question: 'Is it safe to use my credit card on your website?',
                answer: 'Absolutely! We use 256-bit SSL encryption to protect your personal and payment information. Our payment processing is handled by Razorpay, which is PCI-DSS compliant, and we never store your complete credit card details on our servers. Your financial security is our top priority.'
            },
            {
                id: 'order-4',
                question: 'Can I modify or cancel my order after placement?',
                answer: 'You can modify or cancel your order within 30 minutes of placement by contacting our customer support team. After this window, orders enter processing and cannot be modified. For cancellations after shipping, please refer to our return policy.'
            }
        ]
    },
    {
        id: 'shipping',
        title: 'Shipping & Delivery',
        icon: <Truck className="w-6 h-6" />,
        questions: [
            {
                id: 'ship-1',
                question: 'What are your shipping options and costs?',
                answer: 'We are currently offering FREE shipping on all orders across India! All orders are processed through Shiprocket to ensure fast and reliable delivery. Delivery times typically range from 2-7 business days depending on your location.'
            },
            {
                id: 'ship-2',
                question: 'How long does delivery take?',
                answer: 'Delivery times depend on your location: Metro cities: 2-4 days, Tier 2 cities: 3-5 days, Remote areas: 5-7 days. You will receive real-time tracking updates via SMS and email once your order is shipped through our partner Shiprocket.'
            },
            {
                id: 'ship-3',
                question: 'Do you ship internationally?',
                answer: 'Currently, we ship across India including all states and union territories. We are working on expanding our international shipping capabilities. Subscribe to our newsletter for updates on international shipping availability.'
            },
            {
                id: 'ship-4',
                question: 'How can I track my order?',
                answer: 'You can track your order through: 1) Your account dashboard on our website, 2) Tracking link in your confirmation email/SMS, 3) Shiprocket tracking portal, or 4) By contacting our customer support team with your order number.'
            }
        ]
    },
    {
        id: 'returns',
        title: 'Returns & Refunds',
        icon: <RotateCcw className="w-6 h-6" />,
        questions: [
            {
                id: 'return-1',
                question: 'What is your return policy?',
                answer: 'We offer a 7-day hassle-free return policy. Products can be returned if: • The item is unused and in original condition • Original packaging and tags are intact • Return is initiated within 7 days of delivery • Valid reason provided (size issue, wrong item, damaged product)'
            },
            {
                id: 'return-2',
                question: 'How do I initiate a return?',
                answer: 'To initiate a return:Contact our customer support by submiting contact form or  1) Log into your account  2) Go to "Order History" 3) Select the order and item to return 4) Choose return reason 5) Submit request. Our team will approve within 24 hours and arrange pickup from your address. Returns are only accepted within 7 days of delivery.'
            },
            {
                id: 'return-3',
                question: 'How long do refunds take to process?',
                answer: 'Once we receive the returned item: • Credit/Debit card refunds: 5-7 business days • UPI refunds: 2-3 business days • Bank transfers: 3-5 business days. You will receive confirmation via email once the refund is processed.'
            },
            {
                id: 'return-4',
                question: 'Are there any non-returnable items?',
                answer: 'For hygiene and safety reasons, the following are non-returnable: • Personal care products (unless defective) • Innerwear & swimwear • Customized or personalized items • Sale/clearance items (unless defective) • Gift cards'
            }
        ]
    },
    {
        id: 'products',
        title: 'Product Information',
        icon: <Award className="w-6 h-6" />,
        questions: [
            {
                id: 'product-1',
                question: 'Are your products authentic and high quality?',
                answer: 'Yes! We are an authorized retailer for all brands we carry. Every product undergoes rigorous quality checks, and we provide authenticity guarantees. Our high customer satisfaction rate reflects our commitment to quality and authenticity.'
            },
            {
                id: 'product-2',
                question: 'Do you offer product warranties?',
                answer: 'Product warranties vary by item. If a product comes with a manufacturer warranty, it will be clearly mentioned on the product page. Please check the product description for specific warranty details before making your purchase.'
            },
            {
                id: 'product-3',
                question: 'What if I receive a damaged or wrong product?',
                answer: 'In rare cases of damaged/wrong items: 1) Contact us within 48 hours of delivery 2) Share photos of the product and packaging 3) Our team will verify and arrange replacement/return. We cover all costs for such instances.'
            },
            {
                id: 'product-4',
                question: 'How do I care for and maintain my products?',
                answer: 'Care instructions are provided with each product. You can also find detailed care guides on product pages. For specific queries, our customer support team can provide personalized advice.'
            }
        ]
    },
    {
        id: 'account',
        title: 'Account & Security',
        icon: <Shield className="w-6 h-6" />,
        questions: [
            {
                id: 'account-1',
                question: 'How do I create an account?',
                answer: 'Creating an account is free and easy! Click on the user icon in the top right corner, select "Sign Up", and you can register using Google authentication or your email. Google authentication provides instant access while email registration requires verification.'
            },
            {
                id: 'account-2',
                question: 'How can I update my profile information?',
                answer: 'After logging in, click on the user icon in the top right corner and select "Profile". Here you can: • Update your personal details (name, email, phone) • Add or edit shipping addresses • Manage communication preferences • All changes are saved instantly.'
            },
            // {
            //     id: 'account-3',
            //     question: 'I forgot my password. How can I reset it?',
            //     answer: 'If you used email registration, click "Forgot Password" on the login page, enter your registered email, and we will send a reset link. The link expires in 2 hours for security. Google authentication users can reset through their Google account.'
            // },
            {
                id: 'account-4',
                question: 'Is my personal information secure with you?',
                answer: 'We take data security seriously. We use enterprise-grade encryption, comply with data protection regulations, and never share your information with third parties without consent. Read our Privacy Policy for detailed information on data handling.'
            }
        ]
    },
    {
        id: 'support',
        title: 'Customer Support',
        icon: <MessageCircle className="w-6 h-6" />,
        questions: [
            {
                id: 'support-1',
                question: 'How can I contact customer support?',
                answer: 'You can reach us through: • Instagram: Direct message on our official page • Email: Send us your queries at our support email • Contact Form: Use the contact form on our website • We typically respond within 24 hours during business hours.'
            },
            {
                id: 'support-2',
                question: 'What are your customer support hours?',
                answer: 'Our customer support team is available: • Monday to Saturday: 10:00 AM to 7:00 PM IST • Sunday: 10:00 AM to 4:00 PM IST • We strive to respond to all queries within 24 hours.'
            },
            {
                id: 'support-3',
                question: 'Do you have a physical store?',
                answer: 'Currently, we operate as an online-only store. This allows us to offer better prices and wider selection. All orders are shipped directly from our warehouses to your doorstep through our shipping partners.'
            },
            {
                id: 'support-4',
                question: 'Can I request a custom product or bulk order?',
                answer: 'Yes! We welcome custom orders and bulk purchases. Please contact us through email with your specific requirements, and our team will get back to you with pricing and availability within 24 hours.'
            }
        ]
    }
]

    // Flatten all questions for search
    const allQuestions = faqCategories.flatMap(category => 
        category.questions.map(q => ({ ...q, category: category.title }))
    )

    // Filter questions based on search
    const filteredQuestions = searchTerm 
        ? allQuestions.filter(q => 
            q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.answer.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : null

    return (
        <>
            <Head>
                <title>FAQs - Frequently Asked Questions | Premium Shopping Experience</title>
                <meta 
                    name="description" 
                    content="Find answers to common questions about ordering, shipping, returns, products, and account management. Premium customer support with 24/7 assistance." 
                />
                <meta name="keywords" content="FAQs, help, customer support, ordering, shipping, returns, payment, account, premium shopping" />
                <meta property="og:title" content="FAQs - Premium Shopping Support" />
                <meta property="og:description" content="Get instant answers to your questions about our premium shopping experience." />
                <link rel="canonical" href="/faqs" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
                {/* Hero Section */}
                <section className="relative py-16 bg-gradient-to-r from-emerald-600 to-teal-700 text-white overflow-hidden">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-36 translate-x-36"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-48 -translate-x-48"></div>
                    
                    <div className="relative container mx-auto px-6 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            Frequently Asked <span className="text-yellow-300">Questions</span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
                            Quick answers to your questions about shopping with us
                        </p>
                        
                        {/* Trust Badges */}
                        <div className="flex flex-wrap justify-center gap-4 mt-10">
                            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 flex items-center gap-2 text-sm">
                                <Shield className="w-4 h-4" />
                                100% Secure Shopping
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4" />
                                24/7 Customer Support
                            </div>
                            {/* <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 flex items-center gap-2 text-sm">
                                <CheckCircle className="w-4 h-4" />
                                Trusted by 10K+ Customers
                            </div> */}
                        </div>
                    </div>
                </section>

                {/* Search Section */}
                <section className="py-12 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="max-w-4xl mx-auto text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                How Can We Help You Today?
                            </h2>
                            <p className="text-gray-600 text-lg mb-8">
                                Search through our comprehensive knowledge base or browse by category
                            </p>
                            
                            <div className="relative max-w-2xl mx-auto">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search for answers... (e.g., 'return policy', 'track order', 'payment')"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white shadow-lg"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main FAQ Content */}
                <section className="py-12">
                    <div className="container mx-auto px-6">
                        {searchTerm && filteredQuestions ? (
                            // Search Results
                            <div className="max-w-4xl mx-auto">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Search Results for &quot;{searchTerm}&quot;
                                    </h2>
                                    <span className="text-gray-600">
                                        {filteredQuestions.length} results found
                                    </span>
                                </div>

                                {filteredQuestions.length === 0 ? (
                                    <div className="text-center py-16 bg-white rounded-3xl shadow-lg border border-gray-200">
                                        <div className="text-6xl mb-4">🔍</div>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                            No results found
                                        </h3>
                                        <p className="text-gray-600 mb-6">
                                            Try different keywords or browse our categories below
                                        </p>
                                        <button
                                            onClick={() => setSearchTerm('')}
                                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-300"
                                        >
                                            Clear Search
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {filteredQuestions.map((item) => (
                                            <div 
                                                key={item.id}
                                                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
                                            >
                                                <button
                                                    onClick={() => toggleItem(item.id)}
                                                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                                                >
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-gray-900 text-lg">
                                                            {item.question}
                                                        </h3>
                                                        <p className="text-sm text-emerald-600 mt-1">
                                                            {item.category}
                                                        </p>
                                                    </div>
                                                    {openItems[item.id] ? (
                                                        <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                                    ) : (
                                                        <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                                    )}
                                                </button>
                                                {openItems[item.id] && (
                                                    <div className="px-6 pb-4">
                                                        <div className="border-t border-gray-200 pt-4">
                                                            <p className="text-gray-700 leading-relaxed">
                                                                {item.answer}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Category View
                            <div className="max-w-6xl mx-auto">
                                <div className="grid gap-8">
                                    {faqCategories.map((category) => (
                                        <div key={category.id} className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
                                            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
                                                <div className="flex items-center gap-3 text-white">
                                                    {category.icon}
                                                    <h2 className="text-xl font-bold">
                                                        {category.title}
                                                    </h2>
                                                </div>
                                            </div>
                                            
                                            <div className="divide-y divide-gray-200">
                                                {category.questions.map((item) => (
                                                    <div key={item.id}>
                                                        <button
                                                            onClick={() => toggleItem(item.id)}
                                                            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                                                        >
                                                            <span className="font-semibold text-gray-900 text-lg pr-4">
                                                                {item.question}
                                                            </span>
                                                            {openItems[item.id] ? (
                                                                <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                                            ) : (
                                                                <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                                            )}
                                                        </button>
                                                        {openItems[item.id] && (
                                                            <div className="px-6 pb-4">
                                                                <div className="border-t border-gray-200 pt-4">
                                                                    <p className="text-gray-700 leading-relaxed">
                                                                        {item.answer}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Support CTA Section */}
                <section className="py-16 bg-gradient-to-r from-gray-900 to-black text-white">
                    <div className="container mx-auto px-6 text-center">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-4xl font-bold mb-6">
                                Still Need Help?
                            </h2>
                            <p className="text-xl mb-8 opacity-90">
                                Our customer support team is here to assist you 24/7
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                                {/* <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                                    <MessageCircle className="w-8 h-8 text-emerald-400 mx-auto mb-4" />
                                    <h3 className="font-bold text-lg mb-2">Live Chat</h3>
                                    <p className="text-sm opacity-90 mb-4">Instant help from our experts</p>
                                    <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300">
                                        Start Chat
                                    </button>
                                </div>
                                 */}
                                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                                    <Instagram className="w-8 h-8 text-red-400 mx-auto mb-4" />
                                    <h3 className="font-bold text-lg mb-2">DM Us</h3>
                                    <p className="text-sm opacity-90 mb-4">Mon-Sun: 6AM - 12AM IST</p>
                                    <Link target='blank' href="https://www.instagram.com/shopovix" className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 inline-block">
                                       @shopovix
                                    </Link>
                                </div>
                                
                                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                                    <Mail className="w-8 h-8 text-emerald-400 mx-auto mb-4" />
                                    <h3 className="font-bold text-lg mb-2">Email Us</h3>
                                    <p className="text-sm opacity-90 mb-4">Response within 2 hours</p>
                                    <Link href="mailto:support@shopovix.com" className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 inline-block">
                                        support@shopovix.com
                                    </Link>
                                </div>
                            </div>

                            {/* Trust Metrics */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                                <div>
                                    <div className="text-2xl font-bold text-emerald-400">10K+</div>
                                    <div className="text-sm opacity-90">Happy Customers</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-emerald-400">98.7%</div>
                                    <div className="text-sm opacity-90">Satisfaction Rate</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-emerald-400">24/7</div>
                                    <div className="text-sm opacity-90">Support Available</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-emerald-400">8H</div>
                                    <div className="text-sm opacity-90">Avg Response Time</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SEO Content Section */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                                    Premium Shopping Experience
                                </h2>
                                <p className="text-gray-600 text-lg">
                                    Your satisfaction is our priority. We&apos;re committed to providing exceptional service at every step.
                                </p>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-gray-50 p-6 rounded-2xl">
                                    <h3 className="font-bold text-gray-800 mb-4 text-lg">Why Choose Us?</h3>
                                    <ul className="space-y-3 text-gray-700">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                            <span>100% authentic products with quality guarantee</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                            <span>Secure payment processing with multiple options</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                            <span>Fast and reliable shipping across India</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                            <span>7-day hassle-free return policy</span>
                                        </li>
                                    </ul>
                                </div>
                                
                                <div className="bg-gray-50 p-6 rounded-2xl">
                                    <h3 className="font-bold text-gray-800 mb-4 text-lg">Our Promise</h3>
                                    <ul className="space-y-3 text-gray-700">
                                        <li className="flex items-start gap-3">
                                            <Heart className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                                            <span>Customer-first approach in everything we do</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <Shield className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                            <span>Complete data privacy and security protection</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <Award className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                                            <span>Premium quality products at competitive prices</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <Star className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                                            <span>Exceptional after-sales support and service</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}

export default FAQsPage