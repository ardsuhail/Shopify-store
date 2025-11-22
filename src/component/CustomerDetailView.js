// components/CustomerDetailView.jsx
"use client"
import { useState, useEffect } from 'react'
import { 
  MapPin,
  Mail,
  Phone,
  Globe,
  CheckCircle,
  Clock,
  Package,
  IndianRupee,
  Calendar
} from 'lucide-react'

const StatusBadge = ({ done }) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
    done 
      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
  }`}>
    {done ? <CheckCircle className="w-4 h-4 mr-1" /> : <Clock className="w-4 h-4 mr-1" />}
    {done ? 'Verified' : 'Pending'}
  </span>
)

const OrderStatusBadge = ({ status }) => {
  const statusConfig = {
    processing: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400', label: 'Processing' },
    shipped: { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400', label: 'Shipped' },
    delivered: { color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', label: 'Delivered' },
    cancelled: { color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', label: 'Cancelled' },
    pending: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400', label: 'Pending' }
  }

  const config = statusConfig[status] || statusConfig.pending

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  )
}

const PaymentStatusBadge = ({ status }) => {
  const statusConfig = {
    paid: { color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', label: 'Paid' },
    pending: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400', label: 'Pending' },
    failed: { color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', label: 'Failed' }
  }

  const config = statusConfig[status] || statusConfig.pending

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  )
}

const CustomerDetailView = ({ customer, onBack }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/allorders')
        const data = await response.json()
        
        if (data.success && data.allorders) {
          // Filter orders for this specific customer
          const customerOrders = data.allorders.filter(order => 
            order.customer === customer._id || 
            order.email === customer.email
          )
          setOrders(customerOrders)
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setLoading(false)
      }
    }

    if (customer) {
      fetchOrders()
    }
  }, [customer])

  if (!customer) return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
        >
          ← Back to Customers
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Customer Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
        {/* Customer Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Customer Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg mr-4">
                {customer.fullName?.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {customer.fullName}
                </h3>
                <StatusBadge done={customer.done} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Mail className="w-5 h-5 mr-3" />
                <span>{customer.email}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Phone className="w-5 h-5 mr-3" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Globe className="w-5 h-5 mr-3" />
                <span>{customer.country}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Full Address Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Address Information
          </h2>
          <div className="flex items-start">
            <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-1" />
            <div>
              <p className="text-gray-900 dark:text-white font-medium">{customer.address}</p>
              <p className="text-gray-600 dark:text-gray-400">
                {customer.city}, {customer.state} {customer.pincode}
              </p>
              <p className="text-gray-600 dark:text-gray-400">{customer.country}</p>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Order History
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Total Orders: {orders.length}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Customer ID: {customer.oid}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Products
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Total Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Payment Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Order Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Package className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {order.razorpayOrderId}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {order.paymentMethod}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {order.products?.length || 0} items
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 max-w-xs truncate">
                          {order.products?.map(p => p.title).join(', ')}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm font-medium text-gray-900 dark:text-white">
                          <IndianRupee className="w-4 h-4 mr-1" />
                          {order.totalAmount?.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <PaymentStatusBadge status={order.paymentStatus} />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <OrderStatusBadge status={order.orderStatus} />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Orders Found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                This customer hasn&apos;t placed any orders yet.
              </p>
            </div>
          )}
        </div>

        {/* Customer Stats */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {orders.length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Orders</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              ₹{orders.reduce((total, order) => total + (order.totalAmount || 0), 0).toFixed(2)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Spent</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {orders.filter(order => order.orderStatus === 'delivered').length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Delivered</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {orders.filter(order => order.paymentStatus === 'paid').length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Paid Orders</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerDetailView