import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Package, 
  MapPin, 
  CalendarDays, 
  DollarSign, 
  Truck, 
  CreditCard,
  AlertTriangle
} from 'lucide-react';

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:5000/api/get-orders/${orderId}`, {
          withCredentials: true
        });

        setOrder(response.data.order);
        setIsLoading(false);
        
        // Debug: Log the order and check its structure
        console.log("Fetched order:", response.data.order);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError('Unable to fetch order details. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  // Handle order cancellation
  const handleCancelOrder = async () => {
    try {
      setCancelLoading(true);
      const response = await axios.patch(
        `http://localhost:5000/api/cancel-order/${orderId}`,
        {},
        { withCredentials: true }
      );

      // Update the order in state
      setOrder(response.data.order);
      setShowConfirmModal(false);
      
      // Show success message (you can use a toast notification library here)
      alert('Order cancelled successfully');
      
      setCancelLoading(false);
    } catch (error) {
      console.error('Error cancelling order:', error);
      setError(error.response?.data?.message || 'Failed to cancel order. Please try again.');
      setCancelLoading(false);
      setShowConfirmModal(false);
    }
  };

  // Confirmation Modal
  const CancelConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <div className="flex items-center mb-4 text-red-600">
          <AlertTriangle size={24} className="mr-2" />
          <h3 className="text-xl font-bold">Cancel Order</h3>
        </div>
        <p className="mb-6">Are you sure you want to cancel this order? This action cannot be undone.</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowConfirmModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            disabled={cancelLoading}
          >
            No, Keep Order
          </button>
          <button
            onClick={handleCancelOrder}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
            disabled={cancelLoading}
          >
            {cancelLoading ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Cancelling...
              </>
            ) : (
              'Yes, Cancel Order'
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // Render loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-green-700 font-semibold">Loading Order Details...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <Package className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link 
            to="/orders" 
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  // Render status badge
  const renderStatusBadge = (status) => {
    const statusColors = {
      'processing': 'bg-yellow-100 text-yellow-800',
      'shipped': 'bg-blue-100 text-blue-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[status] || 'bg-gray-100'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
      {showConfirmModal && <CancelConfirmationModal />}
      
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-700 flex items-center">
            <Package className="mr-3 text-green-600" size={32} />
            Order Details
          </h1>
          {/* Use the status field returned from API here */}
          {renderStatusBadge(order.status || order.orderStatus)}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-semibold text-green-700 mb-2 flex items-center">
                <CalendarDays className="mr-2 text-green-600" size={20} />
                Order Information
              </h3>
              <p className="text-gray-600">
                <strong>Order ID:</strong> {order._id}
              </p>
              <p className="text-gray-600">
                <strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}
              </p>
              <p className="text-gray-600">
                <strong>Status:</strong> {order.status || order.orderStatus}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-green-700 mb-2 flex items-center">
                <MapPin className="mr-2 text-green-600" size={20} />
                Shipping Address
              </h3>
              <p className="text-gray-600">
                {order.address.street}, {order.address.city}
              </p>
              <p className="text-gray-600">
                {order.address.state}, {order.address.zip}
              </p>
              <p className="text-gray-600">
                {order.address.country}
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold text-green-700 mb-4 flex items-center">
              <Truck className="mr-2 text-green-600" size={20} />
              Order Items
            </h3>
            {order.items.map((item) => (
              <div 
                key={item.productId._id} 
                className="flex justify-between items-center border-b pb-4 mb-4"
              >
                <div className="flex items-center">
                  <img 
                    src={item.productId.images[0]?.url} 
                    alt={item.productId.name} 
                    className="w-20 h-20 object-cover rounded-md mr-4"
                  />
                  <div>
                    <p className="font-semibold">{item.productId.name}</p>
                    <p className="text-gray-600">
                      {item.quantity} {item.productId.unit} x ${item.productId.price.toFixed(2)}
                    </p>
                  </div>
                </div>
                <p className="font-bold">
                  ${(item.quantity * item.productId.price).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-6">
            <div>
              <h3 className="font-semibold text-green-700 flex items-center">
                <CreditCard className="mr-2 text-green-600" size={20} />
                Payment Details
              </h3>
              <p className="text-gray-600">Payment Status: {order.paymentStatus}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-green-700">
                Total: ${order.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Link 
            to="/orders" 
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition duration-300"
          >
            Back to Orders
          </Link>
          
          {/* Check both possible status field names */}
          {(order.status === 'processing' || order.orderStatus === 'processing') && (
            <button 
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition duration-300"
              onClick={() => setShowConfirmModal(true)}
              disabled={cancelLoading}
            >
              {cancelLoading ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;