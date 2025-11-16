"use client"
import React from 'react'
import { useState, useEffect } from 'react'
import { LoaderCircle, Edit, Trash2, Eye, EyeOff, Search, Filter, Plus, Image as ImageIcon, ArrowLeft, Download, RefreshCw } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

const BannerListPage = () => {
  const [bannerData, setBannerData] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPosition, setFilterPosition] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [actionLoading, setActionLoading] = useState(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const bannerid = searchParams.get("id")

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = () => {
    setLoading(true)
    fetch(`/api/banner`)
      .then(res => res.json())
      .then(data => {
        console.log('Fetched banners:', data)
        setBannerData(data.banner || data.banners || [])
      })
      .catch(err => {
        console.error('Error fetching banners:', err)
        alert('Failed to load banners')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // Filter banners based on search and filters
  const filteredBanners = bannerData.filter(banner => {
    const matchesSearch = banner.altText?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      banner.linkUrl?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesPosition = filterPosition === 'all' || banner.position === filterPosition
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'active' && banner.isActive) ||
      (filterStatus === 'inactive' && !banner.isActive)

    return matchesSearch && matchesPosition && matchesStatus
  })

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;

    setActionLoading(id)
    try {
      const res = await fetch(`/api/banner/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        alert("Banner deleted successfully ✅");
        setBannerData((prev) => prev.filter((banner) => banner._id !== id));
      } else {
        alert(data.message || "Failed to delete banner ❌");
      }
    } catch (error) {
      alert("Error deleting banner: " + error.message);
    } finally {
      setActionLoading(null)
    }
  };

  const toggleBannerStatus = async (bannerId, currentStatus) => {
    setActionLoading(bannerId)
    try {
      const response = await fetch(`/api/banner/${bannerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isActive: !currentStatus
        })
      })
      const result = await response.json()

      if (result.success) {
        // Update local state instead of refetching
        setBannerData(prev => prev.map(banner => 
          banner._id === bannerId 
            ? { ...banner, isActive: !currentStatus }
            : banner
        ))
      } else {
        alert(result.message || 'Failed to update banner status')
      }
    } catch (error) {
      console.error('Error updating banner:', error)
      alert('Error updating banner status')
    } finally {
      setActionLoading(null)
    }
  }

  const handleEdit = (id) => {
    router.push(`/admin/banner/add?id=${id}`)
  }

  const handleRefresh = () => {
    fetchBanners()
  }

  const getStatusBadge = (isActive) => (
    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
      isActive
        ? 'bg-green-100 text-green-800 border-green-200'
        : 'bg-red-100 text-red-800 border-red-200'
    }`}>
      {isActive ? '🟢 Active' : '🔴 Inactive'}
    </span>
  )

  const getPositionBadge = (position) => {
    const positionStyles = {
      top: 'bg-blue-100 text-blue-800 border border-blue-200',
      bottom: 'bg-purple-100 text-purple-800 border border-purple-200',
      side: 'bg-orange-100 text-orange-800 border border-orange-200'
    }

    const posText = typeof position === "string" && position.length > 0
      ? position.charAt(0).toUpperCase() + position.slice(1)
      : "Unknown"

    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${positionStyles[position] || 'bg-gray-100 text-gray-800 border border-gray-200'}`}>
        {posText}
      </span>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    } catch (error) {
      return 'Invalid Date'
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setFilterPosition('all')
    setFilterStatus('all')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                Banner Management
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl">
                Manage your website banners, visibility, and positioning with ease
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-end">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-3 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 font-medium rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <a
                href="/admin/banner/add"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                Add New Banner
              </a>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <ImageIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Banners</p>
                <p className="text-2xl font-bold text-gray-900">{bannerData.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active Banners</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bannerData.filter(b => b.isActive).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <EyeOff className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive Banners</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bannerData.filter(b => !b.isActive).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Filter className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Positions Used</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(bannerData.map(b => b.position)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Filter & Search</h3>
              <p className="text-sm text-gray-600">Find banners by text, position, or status</p>
            </div>
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-300"
            >
              Clear Filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Search Banners
              </label>
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by alt text or link URL..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-300 bg-white/50"
                />
              </div>
            </div>

            {/* Position Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Position
              </label>
              <select
                value={filterPosition}
                onChange={(e) => setFilterPosition(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-300 bg-white/50"
              >
                <option value="all">All Positions</option>
                <option value="top">Top Banner</option>
                <option value="bottom">Bottom Banner</option>
                <option value="side">Side Banner</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-300 bg-white/50"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        {filteredBanners.length > 0 && (
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredBanners.length}</span> of{' '}
              <span className="font-semibold text-gray-900">{bannerData.length}</span> banners
            </p>
            <div className="text-sm text-gray-500">
              {searchTerm && `Search: "${searchTerm}"`}
              {(filterPosition !== 'all' || filterStatus !== 'all') && ' • Filters applied'}
            </div>
          </div>
        )}

        {/* Banners Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20 bg-white/50 rounded-2xl shadow-lg border border-gray-200/50">
            <div className="text-center">
              <LoaderCircle className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Loading banners...</p>
              <p className="text-sm text-gray-500 mt-2">Please wait while we fetch your banners</p>
            </div>
          </div>
        ) : filteredBanners.length === 0 ? (
          <div className="text-center py-20 bg-white/50 rounded-2xl shadow-lg border border-gray-200/50">
            <ImageIcon className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              {bannerData.length === 0 ? 'No Banners Found' : 'No Matching Banners'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto text-lg">
              {bannerData.length === 0
                ? 'Get started by creating your first banner to enhance your website.'
                : 'No banners match your current search and filters.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {bannerData.length === 0 ? (
                <a
                  href="/admin/banner/add"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Banner
                </a>
              ) : (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Filter className="w-5 h-5" />
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredBanners.map((banner) => (
              <div key={banner._id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden hover:shadow-2xl transition-all duration-500 group">
                
                {/* Banner Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={banner.images || banner.image}
                    alt={banner.altText || 'Banner image'}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    {getStatusBadge(banner.isActive)}
                    {getPositionBadge(banner.position)}
                  </div>
                </div>

                {/* Banner Details */}
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 text-lg leading-tight">
                    {banner.altText || 'No alt text provided'}
                  </h3>

                  {banner.linkUrl && (
                    <p className="text-sm text-gray-600 mb-4 truncate bg-gray-50 p-2 rounded-xl">
                      <span className="font-medium">🔗 Link:</span> {banner.linkUrl}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                    <div className="text-center">
                      <div className="font-medium text-gray-400 text-xs">Created</div>
                      <div>{formatDate(banner.createdAt)}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-gray-400 text-xs">Updated</div>
                      <div>{formatDate(banner.updatedAt)}</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleBannerStatus(banner._id, banner.isActive)}
                      disabled={actionLoading === banner._id}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                        banner.isActive
                          ? 'bg-orange-100 text-orange-700 hover:bg-orange-200 hover:shadow-lg'
                          : 'bg-green-100 text-green-700 hover:bg-green-200 hover:shadow-lg'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {actionLoading === banner._id ? (
                        <LoaderCircle className="w-4 h-4 animate-spin" />
                      ) : banner.isActive ? (
                        <><EyeOff className="w-4 h-4" /> Deactivate</>
                      ) : (
                        <><Eye className="w-4 h-4" /> Activate</>
                      )}
                    </button>

                    <button
                      onClick={() => handleEdit(banner._id)}
                      disabled={actionLoading === banner._id}
                      className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-100 text-blue-700 hover:bg-blue-200 hover:shadow-lg rounded-xl font-semibold transition-all duration-300 disabled:opacity-50"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(banner._id)}
                      disabled={actionLoading === banner._id}
                      className="flex items-center justify-center gap-2 py-3 px-4 bg-red-100 text-red-700 hover:bg-red-200 hover:shadow-lg rounded-xl font-semibold transition-all duration-300 disabled:opacity-50"
                    >
                      {actionLoading === banner._id ? (
                        <LoaderCircle className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default BannerListPage