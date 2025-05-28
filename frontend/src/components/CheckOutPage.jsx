import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  CreditCard, 
  Truck, 
  Check, 
  ChevronRight, 
  ChevronLeft 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'Pakistan'
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Fetch cart items
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:5000/api/cart/count', {
          withCredentials: true
        });

        const items = response.data.cart.items;
        setCartItems(items);

        // Calculate total amount
        const total = items.reduce((acc, item) => 
          acc + (item.productId.price * item.quantity), 0);
        setTotalAmount(total);

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  // Handle address input
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate shipping address
  const validateShippingAddress = () => {
    const errors = {};
    const requiredFields = ['street', 'city', 'state', 'zip'];
    
    requiredFields.forEach(field => {
      if (!shippingAddress[field].trim()) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Proceed to next step
  const handleNextStep = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Validate shipping address before proceeding
      if (validateShippingAddress()) {
        setCurrentStep(3);
      }
    }
  };

  // Go back to previous step
  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Place order
  const handlePlaceOrder = async () => {
    // Ensure payment method is selected
    if (!paymentMethod) {
      setFormErrors(prev => ({
        ...prev,
        paymentMethod: 'Please select a payment method'
      }));
      return;
    }

    try {
      setIsLoading(true);
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.productId._id,
          quantity: item.quantity
        })),
        totalAmount,
        address: shippingAddress,
        paymentMethod
      };

      const response = await axios.post('http://localhost:5000/api/orders', orderData, {
        withCredentials: true
      });

      // Clear cart after successful order
      await axios.delete('http://localhost:5000/api/cart/clear', {
        withCredentials: true
      });

      // Redirect to order confirmation
      navigate('/order-confirmation', { 
        state: { 
          orderId: response.data.order._id,
          totalAmount: response.data.order.totalAmount
        } 
      });
    } catch (error) {
      console.error('Error placing order:', error);
      // Show error notification
    } finally {
      setIsLoading(false);
    }
  };

  // Render steps
  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return renderOrderSummary();
      case 2:
        return renderShippingAddress();
      case 3:
        return renderPaymentMethod();
      default:
        return null;
    }
  };

  // Order Summary Step
  const renderOrderSummary = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-green-700 flex items-center">
        <Truck className="mr-3 text-green-600" size={28} />
        Order Summary
      </h2>
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div 
            key={item.productId._id} 
            className="flex justify-between items-center border-b pb-2"
          >
            <div className="flex items-center">
              <img 
                src={item.productId.images[0]?.url} 
                alt={item.productId.name} 
                className="w-16 h-16 object-cover rounded-md mr-4"
              />
              <div>
                <p className="font-semibold">{item.productId.name}</p>
                <p className="text-gray-600">
                  {item.quantity} {item.productId.unit} x ${item.productId.price.toFixed(2)}
                </p>
              </div>
            </div>
            <p className="font-bold">
              ${(item.productId.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
        <div className="flex justify-between text-xl font-bold mt-4">
          <span>Total</span>
          <span className="text-green-600">${totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );

  // Shipping Address Step
  const renderShippingAddress = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-green-700 flex items-center">
        <MapPin className="mr-3 text-green-600" size={28} />
        Shipping Address
      </h2>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <input
            type="text"
            name="street"
            value={shippingAddress.street}
            onChange={handleAddressChange}
            placeholder="Street Address *"
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
              formErrors.street ? 'border-red-500' : ''
            }`}
            required
          />
          {formErrors.street && (
            <p className="text-red-500 text-sm mt-1">{formErrors.street}</p>
          )}
        </div>
        
        <div className="flex flex-col">
          <input
            type="text"
            name="city"
            value={shippingAddress.city}
            onChange={handleAddressChange}
            placeholder="City *"
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
              formErrors.city ? 'border-red-500' : ''
            }`}
            required
          />
          {formErrors.city && (
            <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
          )}
        </div>
        
        <div className="flex flex-col">
          <input
            type="text"
            name="state"
            value={shippingAddress.state}
            onChange={handleAddressChange}
            placeholder="State/Province *"
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
              formErrors.state ? 'border-red-500' : ''
            }`}
            required
          />
          {formErrors.state && (
            <p className="text-red-500 text-sm mt-1">{formErrors.state}</p>
          )}
        </div>
        
        <div className="flex flex-col">
          <input
            type="text"
            name="zip"
            value={shippingAddress.zip}
            onChange={handleAddressChange}
            placeholder="Zip/Postal Code *"
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
              formErrors.zip ? 'border-red-500' : ''
            }`}
            required
          />
          {formErrors.zip && (
            <p className="text-red-500 text-sm mt-1">{formErrors.zip}</p>
          )}
        </div>
        
        <div className="md:col-span-2">
          <select
            name="country"
            value={shippingAddress.country}
            onChange={handleAddressChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="Pakistan">Pakistan</option>
            <option value="England">England</option>
            {/* Add more countries as needed */}
          </select>
        </div>
      </form>
    </div>
  );

  // Payment Method Step
  const renderPaymentMethod = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-green-700 flex items-center">
        <CreditCard className="mr-3 text-green-600" size={28} />
        Payment Method
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {['Cash on Delivery', 'Credit Card', 'Bank Transfer'].map((method) => (
          <label 
            key={method} 
            className={`
              border p-4 rounded-lg cursor-pointer transition duration-300
              ${paymentMethod === method 
                ? 'border-green-500 bg-green-50 ring-2 ring-green-500' 
                : 'border-gray-300 hover:border-green-500'}
            `}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method}
              checked={paymentMethod === method}
              onChange={() => {
                setPaymentMethod(method);
                // Clear payment method error when selection is made
                if (formErrors.paymentMethod) {
                  setFormErrors(prev => ({
                    ...prev,
                    paymentMethod: ''
                  }));
                }
              }}
              className="hidden"
            />
            <div className="flex items-center justify-between">
              <span className="font-semibold">{method}</span>
              {paymentMethod === method && <Check className="text-green-500" />}
            </div>
          </label>
        ))}
      </div>
      {formErrors.paymentMethod && (
        <p className="text-red-500 text-sm mt-3">{formErrors.paymentMethod}</p>
      )}
    </div>
  );

  // Navigation buttons
  const renderNavigation = () => (
    <div className="flex justify-between mt-6">
      {currentStep > 1 && (
        <button
          onClick={handlePreviousStep}
          className="flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-300"
        >
          <ChevronLeft className="mr-2" /> Previous
        </button>
      )}
      
      {currentStep < 3 ? (
        <button
          onClick={handleNextStep}
          className="ml-auto flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
        >
          Next <ChevronRight className="ml-2" />
        </button>
      ) : (
        <button
          onClick={handlePlaceOrder}
          disabled={isLoading || !paymentMethod}
          className={`
            ml-auto flex items-center px-4 py-2 rounded-lg transition duration-300
            ${isLoading || !paymentMethod 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-green-500 text-white hover:bg-green-600'}
          `}
        >
          {isLoading ? 'Processing...' : 'Place Order'}
        </button>
      )}
    </div>
  );

  // Progress indicator
  const renderProgressIndicator = () => (
    <div className="flex justify-between items-center mb-6 bg-gray-100 p-4 rounded-lg">
      {[
        { step: 1, icon: <Truck />, label: 'Order Summary' },
        { step: 2, icon: <MapPin />, label: 'Shipping Address' },
        { step: 3, icon: <CreditCard />, label: 'Payment' }
      ].map((item) => (
        <div 
          key={item.step}
          className={`
            flex flex-col items-center w-full
            ${currentStep === item.step 
              ? 'text-green-600 font-bold' 
              : 'text-gray-400'}
          `}
        >
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center mb-2
            ${currentStep === item.step 
              ? 'bg-green-100' 
              : 'bg-gray-200'}
          `}>
            {item.icon}
          </div>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );

  // Main render
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-green-700 mb-6">Checkout</h1>
        
        {renderProgressIndicator()}
        
        {renderStep()}
        
        {renderNavigation()}
      </div>
    </div>
  );
};

export default CheckoutPage;