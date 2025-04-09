import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:5000/api/cart/count', {
          withCredentials: true
        });
        // console.log("withCredentials",withCredentials)
        const items = response.data.cart.items;
        setCartItems(items);

        // Calculate total price
        const total = items.reduce((acc, item) => 
          acc + (item.productId.price * item.quantity), 0);
        setTotalPrice(total);

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const updateQuantity = async (productId, newQuantity) => {
    console.log("new quantity of ",productId, newQuantity)
    try {
      await axios.put(`http://localhost:5000/api/cart/update`, 
        { productId, quantity: newQuantity },
        { withCredentials: true }
      );

      // Update local state
      const updatedItems = cartItems.map(item => 
        item.productId._id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      );
      console.log("updated cart items",updatedItems)
      setCartItems(updatedItems);

      // Recalculate total price
      const total = updatedItems.reduce((acc, item) => 
        acc + (item.productId.price * item.quantity), 0);
      setTotalPrice(total);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (productId) => {
    console.log("Removing product with ID:", productId); // Debug log

    try {
      await axios.delete(`http://localhost:5000/api/cart/remove/${productId}`, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
          }
      });

      // Update local state
      const updatedItems = cartItems.filter(
        item => item.productId._id !== productId
      );

      console.log("updated cart items",updatedItems)
      setCartItems(updatedItems);

      // Recalculate total price
      const total = updatedItems.reduce((acc, item) => 
        acc + (item.productId.price * item.quantity), 0);
      setTotalPrice(total);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-700 flex items-center">
          <ShoppingCart className="mr-3 text-green-600" size={32} />
          Your Cart
        </h1>
        <Link 
          to="/checkout" 
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-300 shadow-md"
        >
          Proceed to Checkout
        </Link>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <ShoppingCart size={64} className="mx-auto text-green-500 mb-4" />
          <p className="text-xl text-gray-600">Your cart is empty</p>
          <Link 
            to="/products" 
            className="mt-4 inline-block bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items Column */}
          <div className="md:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div 
                key={item.productId._id} 
                className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 hover:shadow-lg transition duration-300"
              >
                {/* Product Image */}
                <img 
                  src={item.productId.images[0]?.url} 
                  alt={item.productId.name} 
                  className="w-24 h-24 object-cover rounded-md"
                />

                {/* Product Details */}
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.productId.name}
                  </h3>
                  <div className="text-sm text-gray-600">
                    {item.productId.brand && `Brand: ${item.productId.brand}`}
                    <p>Category: {item.productId.category}</p>
                    <p>
                      {item.productId.price} / {item.productId.unit}
                    </p>
                  </div>
                  <p className="text-green-600 font-bold mt-1">
                    ${(item.productId.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                {/* Quantity Control */}
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="pointer-curser bg-green-100 text-green-600 p-2 rounded-full disabled:opacity-50"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-bold mx-2">{item.quantity} {item.productId.unit}</span>
                  <button 
                    onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                    className="bg-green-100 text-green-600 p-2 rounded-full"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Remove Button */}
                <button 
                  onClick={() => removeItem(item.productId._id)}
                  className="text-red-500 hover:text-red-700 transition duration-300"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary Column */}
          <div className="bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-2xl font-bold mb-4 text-green-700">Order Summary</h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.productId._id} className="flex justify-between">
                  <span>{item.productId.name} x {item.quantity} {item.productId.unit}</span>
                  <span className="font-bold">
                    ${(item.productId.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <hr className="my-2 border-green-200" />
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-green-600">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;