import React, { useState, useEffect } from 'react';
import { 
  Package, 
  CalendarDays, 
  DollarSign, 
  Check, 
  Clock, 
  ChevronRight 
} from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Render order status badge
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

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:5000/api/get-orders', {
          withCredentials: true
        });

        console.log("Ye raha order find krny ka response",response.data.orders)
        setOrders(response.data.orders);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Unable to fetch orders. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Render order status badge
  
  

  // Render loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-green-700 font-semibold">Loading Orders...</p>
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
          <button 
            onClick={() => window.location.reload()}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Render empty state
  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <Package className="mx-auto mb-4 text-green-500" size={48} />
          <h2 className="text-2xl font-bold text-green-700 mb-4">No Orders Yet</h2>
          <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping!</p>
          <Link 
            to="/" 
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-green-700 mb-6 flex items-center">
        <Package className="mr-3 text-green-600" size={32} />
        My Orders
      </h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div 
            key={order._id} 
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-gray-600 flex items-center">
                  <CalendarDays className="mr-2 text-green-600" size={16} />
                  Order Date: {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-600 flex items-center">
                  <DollarSign className="mr-2 text-green-600" size={16} />
                  Total: ${order.totalAmount.toFixed(2)}
                </p>
              </div>
              {renderStatusBadge(order.status)}
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              {order.items.slice(0, 3).map((item) => (
                <div 
                  key={item.productId._id} 
                  className="flex items-center bg-gray-100 p-3 rounded-lg"
                >
                  <img 
                    src={item.productId.images[0]?.url} 
                    alt={item.productId.name} 
                    className="w-16 h-16 object-cover rounded-md mr-4"
                  />
                  <div>
                    <p className="font-semibold text-sm">{item.productId.name}</p>
                    <p className="text-gray-600 text-xs">
                      {item.quantity} {item.productId.unit}
                    </p>
                  </div>
                </div>
              ))}
              {order.items.length > 3 && (
                <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                  <p className="text-gray-600">
                    +{order.items.length - 3} more items
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <p className="text-gray-600 flex items-center">
                <Clock className="mr-2 text-green-600" size={16} />
                Order #{order._id.slice(-6)}
              </p>
              <Link
                to={`/order/${order._id}`}
                className="flex items-center text-green-600 hover:text-green-800 transition duration-300"
              >
                View Details <ChevronRight className="ml-2" size={20} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
};

export default OrdersPage;