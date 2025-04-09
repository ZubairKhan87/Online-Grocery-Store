import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Check, 
  Package, 
  MapPin, 
  CreditCard, 
  Home 
} from 'lucide-react';

const OrderConfirmationPage = () => {
  const location = useLocation();
  const { orderId, totalAmount } = location.state || {};

  // If no order details, redirect or show error
  if (!orderId) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Order Not Found</h2>
          <Link 
            to="/" 
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={48} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-green-700 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Thank you for your purchase from FreshMart</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold text-green-700 mb-3 flex items-center">
              <Package className="mr-2 text-green-600" size={20} />
              Order Details
            </h3>
            <p className="text-gray-700">
              <strong>Order ID:</strong> 
              <span className="ml-2 text-green-600">{orderId}</span>
            </p>
            <p className="text-gray-700">
              <strong>Total Amount:</strong> 
              <span className="ml-2 text-green-600">${totalAmount.toFixed(2)}</span>
            </p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold text-green-700 mb-3 flex items-center">
              <MapPin className="mr-2 text-green-600" size={20} />
              Shipping Information
            </h3>
            <p className="text-gray-700">Standard Delivery</p>
            <p className="text-gray-700">Estimated Delivery: 3-5 Business Days</p>
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg mb-8">
          <h3 className="font-semibold text-green-700 mb-3 flex items-center">
            <CreditCard className="mr-2 text-green-600" size={20} />
            Payment Method
          </h3>
          <p className="text-gray-700">Payment Processed Successfully</p>
        </div>

        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
          <Link 
            to="/orders" 
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300 flex items-center justify-center"
          >
            View Order Details
          </Link>
          <Link 
            to="/" 
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition duration-300 flex items-center justify-center"
          >
            <Home className="mr-2" size={20} /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;