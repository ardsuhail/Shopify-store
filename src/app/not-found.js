// pages/404.js
"use client"
import Head from 'next/head';
import { ArrowLeft, Home, Search, Mail } from 'lucide-react';
import Link from 'next/link';
export default function Custom404() {
  return (
    <>
      <Head>
        <title>Page Not Found | 404 Error</title>
        <meta name="description" content="The page you are looking for does not exist." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          {/* Animated 404 */}
          <div className="relative mb-8">
            <div className="text-9xl font-bold text-white opacity-10 absolute inset-0 transform -translate-y-4">
              404
            </div>
            <div className="relative">
              <h1 className="text-8xl font-bold text-white mb-2">
                <span className="text-purple-400">4</span>
                <span className="text-pink-400">0</span>
                <span className="text-cyan-400">4</span>
              </h1>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Search className="text-white" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
              <p className="text-gray-300">
                Sorry, we couldn&apos;t find the page you&apos;re looking for. The page might have been moved, deleted, or you entered an incorrect URL.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <button 
                onClick={() => window.history.back()}
                className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 border border-white/30 hover:border-white/50"
              >
                <ArrowLeft size={18} />
                Go Back
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Home size={18} />
                Home Page
              </button>
            </div>

            {/* Support Section */}
            <div className="pt-6 border-t border-white/20">
              <p className="text-gray-400 text-sm mb-4">Still need help?</p>
              <Link href={'/contact'} className="flex items-center justify-center gap-2 mx-auto text-cyan-300 hover:text-cyan-200 transition-colors">
                <Mail size={16} />
                Contact Support
              </Link>
            </div>
          </div>

        
        </div>
      </div>
    </>
  );
}