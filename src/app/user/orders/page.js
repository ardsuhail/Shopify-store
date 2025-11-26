"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  CreditCard,
  MapPin,
  Calendar,
  ArrowRight,
  ExternalLink,
  Star,
  Shield,
  BadgeCheck,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  Heart,
  Share2,
  Download,
  Printer,
  MessageCircle,
  RotateCcw,
  ThumbsUp,
  Award,
  Crown,
  Search,
  Filter
} from "lucide-react";

const OrdersPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") {
      setLoading(false);
      return;
    }

    console.log("Fetching orders for user:", session?.user?.email);

    fetch("/api/orders")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("API Response:", data);
        setOrders(data.orders || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
      });
  }, [status, session]);

  // Transform MongoDB order data to match UI expectations
  const transformOrderData = (orders) => {
    if (!orders || !Array.isArray(orders)) return [];
    
    return orders.map(order => ({
      id: order._id || order.id,
      order_number: order.orderId,
      created_at: order.createdAt || order.created_at,
      total_price: order.totalAmount,
      financial_status: order.paymentStatus,
      fulfillment_status: order.orderStatus,
      line_items: (order.products || []).map(product => ({
        id: product.productId || product.id,
        title: product.title,
        quantity: product.quantity,
        price: product.price,
        image: product.image,
        product_id: product.productId,
        variant_title: "",
        discount_allocations: []
      })),
      shipping_address: {
        name: order.fullName || order.customerName || "",
        address1: order.customerAddress || "",
        city: order.customer?.city || "",
        province: order.customer?.state || "",
        zip: order.customer?.pincode || "",
        country: order.customer?.country || "",
        phone: order.customer?.phone || ""
      },
      subtotal_price: order.totalAmount,
      total_discounts: 0,
      total_shipping_price_set: {
        presentment_money: {
          amount: 0
        }
      },
      total_tax: 0
    }));
  };

  // Enhanced image handling with multiple fallbacks
  const getProductImage = (item) => {
    if (!item) return "/api/placeholder/150/150?text=Product+Image";

    const imageSources = [
      item.image,
      item.featured_image,
      item.variant_image,
      item.images?.[0]
    ];

    const validImage = imageSources.find(src =>
      src && typeof src === 'string' && (src.startsWith('http') || src.startsWith('//') || src.startsWith('/'))
    );

    return validImage || `/api/placeholder/150/150?text=${encodeURIComponent(item.title?.split(' ')[0] || 'Product')}`;
  };

  const getStatusIcon = (status) => {
    if (!status) return <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />;
    
    switch (status.toLowerCase()) {
      case 'paid':
      case 'completed':
        return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />;
      case 'refunded':
      case 'cancelled':
        return <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />;
      default:
        return <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />;
    }
  };

  const getStatusColor = (status) => {
    if (!status) return 'bg-blue-50 text-blue-700 border-blue-200';
    
    switch (status.toLowerCase()) {
      case 'paid':
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'refunded':
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const getDeliveryStatus = (order) => {
    const status = order.orderStatus || order.fulfillment_status;
    if (status === 'delivered') return 'Delivered';
    if (status === 'shipped') return 'Shipped';
    if (status === 'processing') return 'Processing';
    return 'Processing';
  };

  const getDeliveryColor = (status) => {
    switch (status) {
      case 'Delivered': return 'text-green-600 bg-green-50';
      case 'Shipped': return 'text-blue-600 bg-blue-50';
      default: return 'text-orange-600 bg-orange-50';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Date not available';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Filter orders based on selection
  const filteredOrders = transformOrderData(orders).filter(order => {
    const matchesSearch = searchTerm ? 
      order.line_items.some(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      ) : true;

    const orderStatus = order.orderStatus || order.fulfillment_status;
    const paymentStatus = order.financial_status;

    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "delivered" && orderStatus === 'delivered') ||
      (selectedFilter === "processing" && (!orderStatus || orderStatus === 'processing' || orderStatus === 'pending')) ||
      (selectedFilter === "cancelled" && paymentStatus === 'refunded');

    return matchesSearch && matchesFilter;
  });

  // Invoice Download Function
  const downloadInvoice = async (order) => {
    try {
      // Create invoice content
      const invoiceContent = `
        INVOICE
        Order #: ${order.order_number || order.id}
        Date: ${formatDateTime(order.created_at)}
        
        ITEMS:
        ${order.line_items.map(item => `
          ${item.title}
          Qty: ${item.quantity} x ₹${item.price} = ₹${(item.quantity * item.price).toLocaleString('en-IN')}
        `).join('')}
        
        SUBTOTAL: ₹${parseFloat(order.subtotal_price || 0).toLocaleString('en-IN')}
        DISCOUNT: -₹${parseFloat(order.total_discounts || 0).toLocaleString('en-IN')}
        SHIPPING: ₹${parseFloat(order.total_shipping_price_set?.presentment_money?.amount || 0).toLocaleString('en-IN')}
        TAX: ₹${parseFloat(order.total_tax || 0).toLocaleString('en-IN')}
        TOTAL: ₹${parseFloat(order.total_price || 0).toLocaleString('en-IN')}
        
        Payment Status: ${order.financial_status}
        Order Status: ${order.fulfillment_status}
        Thank you for your business!
      `;

      // Create and download file
      const blob = new Blob([invoiceContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-order-${order.order_number || order.id}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert('Invoice downloaded successfully!');
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Error downloading invoice. Please try again.');
    }
  };

  // Navigation functions
  const navigateToHelp = (section = 'contact') => {
    const helpRoutes = {
      'return': '/return-refund-policy',
      'shipping': '/shipping-information',
      'payment': '/payment-options',
      'terms': '/terms-conditions',
      'privacy': '/privacy-policy',
      'contact': '/contact'
    };
    router.push(helpRoutes[section] || '/contact');
  };
const buyAgain = (product) => {
  // product may contain productId, product_id, or id depending on source
  const productID = product?.productId || product?.product_id || product?.id;

  console.log("Buying again product:", product);
  console.log("Resolved Product ID:", productID);

  if (productID) {
    router.push(`/products/${productID}`);
  } else {
    alert("Product ID not found");
  }
};
  const navigateToReviews = (productId, productTitle) => {
    router.push(`/create-review?products=${productId}&productTitle=${encodeURIComponent(productTitle)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
            <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Loading Your Orders</h3>
          <p className="text-gray-600 text-sm sm:text-base">We&apos;re preparing your order history...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Please Sign In</h3>
          <p className="text-gray-600 mb-6">You need to be signed in to view your orders.</p>
          <button
            onClick={() => router.push('/auth/signin')}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const transformedOrders = transformOrderData(orders);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Premium Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                <div className="p-1 sm:p-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg sm:rounded-xl">
                  <Package className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="truncate">My Orders</span>
                <span className="text-xs sm:text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full hidden sm:inline">
                  {orders.length} orders
                </span>
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base truncate">
                Track and manage all your purchases • {session?.user?.email}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
              {/* Mobile Search */}
              <div className="relative flex-1 sm:flex-initial">
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 w-full text-sm"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="sm:hidden flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <Filter className="w-4 h-4" />
                Filter
              </button>

              {/* Desktop Filter */}
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="hidden sm:block px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
              >
                <option value="all">All Orders</option>
                <option value="delivered">Delivered</option>
                <option value="processing">Processing</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Mobile Filter Dropdown */}
          {mobileFilterOpen && (
            <div className="mt-3 sm:hidden grid grid-cols-2 gap-2">
              {["all", "delivered", "processing", "cancelled"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    setSelectedFilter(filter);
                    setMobileFilterOpen(false);
                  }}
                  className={`px-3 py-2 rounded-lg text-sm border ${selectedFilter === filter
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-white text-gray-700 border-gray-300'
                    }`}
                >
                  {filter === 'all' ? 'All Orders' :
                    filter === 'delivered' ? 'Delivered' :
                      filter === 'processing' ? 'Processing' : 'Cancelled'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Quick Stats - Responsive Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-1">{orders.length}</p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-1">
                  ₹{orders.reduce((sum, order) => sum + parseFloat(order.totalAmount || 0), 0).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-1">
                  {orders.filter(o => o.orderStatus === 'delivered').length}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Pending</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-1">
                  {orders.filter(o => o.orderStatus === 'processing' || o.orderStatus === 'pending').length}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 lg:p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Package className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-400" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                {searchTerm ? 'No matching orders' : 'No Orders Yet'}
              </h3>
              <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
                {searchTerm
                  ? 'Try adjusting your search terms to find what you\'re looking for.'
                  : 'Start your shopping journey and your orders will appear here.'
                }
              </p>
              <button
                onClick={() => router.push('/products')}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
              >
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300"
              >
                {/* Order Header - Responsive */}
                <div className="p-4 sm:p-6 border-b border-gray-100">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                          <span className="text-xs sm:text-sm text-gray-600">
                            Ordered on {formatDate(order.created_at)}
                          </span>
                        </div>
                        <span className="hidden sm:inline text-gray-300">•</span>
                        <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                          Order # {order.order_number || order.id}
                        </span>
                        <span className="hidden sm:inline text-gray-300">•</span>
                        <span className="text-xs sm:text-sm text-gray-600">
                          Total: ₹{parseFloat(order.total_price || 0).toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.financial_status)}`}>
                          Payment: {order.financial_status?.charAt(0).toUpperCase() + order.financial_status?.slice(1) || 'Pending'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDeliveryColor(getDeliveryStatus(order))}`}>
                          {getDeliveryStatus(order)}
                        </span>
                        {(order.fulfillment_status === 'delivered' || order.orderStatus === 'delivered') && (
                          <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <CheckCircle className="w-3 h-3" />
                            Ready for Review
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1 sm:py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors text-sm sm:text-base self-start"
                    >
                      {expandedOrder === order.id ? (
                        <>
                          <span>View Less</span>
                          <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
                        </>
                      ) : (
                        <>
                          <span>View Details</span>
                          <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Order Items - Responsive */}
                <div className="p-4 sm:p-6">
                  <div className="space-y-3 sm:space-y-4">
                    {order.line_items.map((item, index) => (
                      <div key={item.id || index} className="flex items-start gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                            <img
                              src={getProductImage(item)}
                              alt={item.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                if (e.target.nextSibling) {
                                  e.target.nextSibling.style.display = 'flex';
                                }
                              }}
                            />
                            <div className="hidden w-full h-full items-center justify-center">
                              <ImageIcon className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-gray-300" />
                            </div>
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 hover:text-green-600 transition-colors cursor-pointer text-sm sm:text-base line-clamp-2">
                            {item.title}
                          </h4>

                          {item.variant_title && (
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">Variant: {item.variant_title}</p>
                          )}

                          <div className="flex items-center gap-2 sm:gap-4 mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">
                            <span>Qty: {item.quantity}</span>
                            <span className="hidden sm:inline">•</span>
                            <span>₹{parseFloat(item.price || 0).toLocaleString('en-IN')} each</span>
                          </div>

                          {/* Action Buttons for each item - Responsive */}
                          <div className="flex flex-wrap gap-2 sm:gap-3 mt-2">
                            <button
                              onClick={() => buyAgain(item)}
                              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors"
                            >
                              <RotateCcw className="w-3 h-3" />
                              Buy Again
                            </button>
                            <button
                              onClick={() => navigateToReviews(item.product_id, item.title)}
                              className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-700 transition-colors"
                            >
                              <Star className="w-3 h-3" />
                              Write Review
                            </button>
                            <button
                              onClick={() => navigateToHelp('contact')}
                              className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-700 transition-colors"
                            >
                              <MessageCircle className="w-3 h-3" />
                              Get Help
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right flex-shrink-0">
                          <p className="font-semibold text-gray-900 text-sm sm:text-base">
                            ₹{((item.quantity || 0) * (item.price || 0)).toLocaleString('en-IN')}
                          </p>
                          {item.discount_allocations?.length > 0 && (
                            <p className="text-xs text-green-600 mt-1 hidden sm:block">
                              You saved ₹{item.discount_allocations[0]?.amount || 0}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expanded Details - Responsive */}
                {expandedOrder === order.id && (
                  <div className="border-t border-gray-100 bg-gray-50/50">
                    <div className="p-4 sm:p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                        {/* Order Summary */}
                        <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200">
                          <h5 className="font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                            Order Summary
                          </h5>
                          <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Items Total</span>
                              <span>₹{parseFloat(order.subtotal_price || 0).toLocaleString('en-IN')}</span>
                            </div>

                            {order.total_discounts > 0 && (
                              <div className="flex justify-between">
                                <span className="text-green-600">Discount</span>
                                <span className="text-green-600">-₹{parseFloat(order.total_discounts || 0).toLocaleString('en-IN')}</span>
                              </div>
                            )}

                            <div className="flex justify-between">
                              <span className="text-gray-600">Shipping</span>
                              <span>₹{parseFloat(order.total_shipping_price_set?.presentment_money?.amount || 0).toLocaleString('en-IN')}</span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-gray-600">Tax</span>
                              <span>₹{parseFloat(order.total_tax || 0).toLocaleString('en-IN')}</span>
                            </div>

                            <div className="border-t pt-2 sm:pt-3 flex justify-between font-semibold text-gray-900 text-sm sm:text-base">
                              <span>Grand Total</span>
                              <span>₹{parseFloat(order.total_price || 0).toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        </div>

                        {/* Shipping & Support */}
                        <div className="space-y-4 sm:space-y-6">
                          {/* Shipping Address */}
                          {order.shipping_address && (
                            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200">
                              <h5 className="font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                                Shipping Address
                              </h5>
                              <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                                <p className="font-medium text-gray-900">{order.shipping_address.name}</p>
                                <p>{order.shipping_address.address1}</p>
                                {order.shipping_address.city && <p>{order.shipping_address.city}, {order.shipping_address.province} {order.shipping_address.zip}</p>}
                                {order.shipping_address.country && <p>{order.shipping_address.country}</p>}
                                {order.shipping_address.phone && (
                                  <p className="mt-2 flex items-center gap-1">
                                    <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                                    {order.shipping_address.phone}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Support Actions */}
                          <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200">
                            <h5 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Need Help?</h5>
                            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
                              <button
                                onClick={() => downloadInvoice(order)}
                                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition-colors text-xs sm:text-sm justify-center"
                              >
                                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">Invoice</span>
                                <span className="sm:hidden">Invoice</span>
                              </button>
                              <button
                                onClick={() => navigateToHelp('return')}
                                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors text-xs sm:text-sm justify-center"
                              >
                                <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">Returns</span>
                                <span className="sm:hidden">Returns</span>
                              </button>
                              <button
                                onClick={() => navigateToHelp('contact')}
                                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-xs sm:text-sm justify-center"
                              >
                                <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">Support</span>
                                <span className="sm:hidden">Support</span>
                              </button>
                              <button
                                onClick={() => navigateToHelp('shipping')}
                                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg transition-colors text-xs sm:text-sm justify-center"
                              >
                                <Truck className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">Shipping</span>
                                <span className="sm:hidden">Ship</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Trust Badges - Responsive */}
        {orders.length > 0 && (
          <div className="mt-8 sm:mt-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-green-200">
            <div className="text-center">
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-700">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  <span className="hidden sm:inline">Secure Payments</span>
                  <span className="sm:hidden">Secure</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-700">
                  <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <span className="hidden sm:inline">Free Shipping</span>
                  <span className="sm:hidden">Shipping</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-700">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                  <span className="hidden sm:inline">Quality</span>
                  <span className="sm:hidden">Quality</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-700">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                  <span className="hidden sm:inline">24/7 Support</span>
                  <span className="sm:hidden">Support</span>
                </div>
              </div>
              <p className="text-gray-600 text-xs sm:text-sm">
                Thank you for shopping with us! Your satisfaction is our top priority.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;