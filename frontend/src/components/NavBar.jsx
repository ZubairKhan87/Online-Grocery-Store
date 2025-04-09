import React, { useState, useEffect,useContext } from 'react';
import { ShoppingCart, Search, User, Heart, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube, ChevronDown, Menu, X } from 'lucide-react';
import { useNavigate,Link } from "react-router-dom";
import axios from 'axios';
import { AuthContext } from './AuthContext';  // Import AuthContext

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [countCart, setCountCart]= useState(0)
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  // Get authentication state from AuthContext
  const { user, logout } = useContext(AuthContext);
  console.log("User from context:", user);
  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      navigate(`/search?q=${searchQuery}`);
    }
  };
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchCartData = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/cart/count', // Changed to the correct getCart endpoint
        { withCredentials: true } // Important for sending authentication cookies
      );
      
      // The response will have a cart object, so access the items array
      const cartItemsCount = response.data.cart.items.length;
      console.log("Cart Items Count:", cartItemsCount);
      setCountCart(cartItemsCount);
  
    } catch (error) {
      console.error("❌ Error fetching cart data:", error);
      // Optionally handle different error scenarios
      if (error.response?.status === 401) {
        // Handle unauthorized access (e.g., redirect to login)
        navigate('/login');
      }
    }
  };
    

  useEffect(() => {
    fetchCartData();
}, []); // Runs only once when the component mount
return(
    <nav className={`sticky top-0 mb-8 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-white py-4'}`}>
         <div className="bg-green-800 text-white text-sm py-2 px-4 hidden md:block">
              <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Phone size={14} className="mr-1" />
                    <span>+1 234 567 8900</span>
                  </div>
                  <div className="flex items-center">
                    <Mail size={14} className="mr-1" />
                    <span>support@freshmart.com</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <a href="orders" className="hover:text-green-200 transition duration-300">Track Order</a>
                  <a href="#" className="hover:text-green-200 transition duration-300">Locations</a>
                  <a href="#" className="hover:text-green-200 transition duration-300">FAQ</a>
                </div>
              </div>
              </div>
    <div className="container mx-auto px-4 mt-5">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <div className="flex items-center">
                <a href="/" className="flex items-center">
                  <span className="text-green-600 font-bold text-3xl">Fresh<span className="text-green-800">Mart</span></span>
                </a>
              </div>
    
              {/* Search Bar - Hidden on mobile */}
              <div className="hidden md:flex items-center flex-1 max-w-xl mx-8">
                <div className="relative w-full">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products..." 
                    className="w-full py-2 px-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button onClick={handleSearch}  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500 hover:text-green-700">
                    <Search size={20} />
                  </button>
                </div>
              </div>
    
              {/* Desktop Navigation Links */}
              <div className="hidden md:flex items-center space-x-6">
                <a href="" className="relative flex items-center text-gray-700 hover:text-green-600 transition duration-300">
                  <Heart size={22} className="mr-1" />
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">0</span>
                </a>
                <Link to="/cart"><a href="#" className="relative flex items-center text-gray-700 hover:text-green-600 transition duration-300">
                  <ShoppingCart size={22} className="mr-1" />
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{countCart}</span>
                </a>
                </Link>
                {!user ? (
              <>
                <Link to="/signup" className="flex items-center text-gray-700 hover:text-green-600">
                  <User size={22} className="mr-1" />
                  <span>Signup</span>
                </Link>
                <Link to="/login" className="flex items-center text-gray-700 hover:text-green-600">
                  <User size={22} className="mr-1" />
                  <span>Login</span>
                </Link>
              </>
            ) : (
              <button onClick={logout} className="flex items-center text-gray-700 hover:text-green-600">
                <User size={22} className="mr-1" />
                <span>Logout</span>
              </button>
            )}
          </div>
    
              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 hover:text-green-600 focus:outline-none">
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
    
            {/* Mobile menu */}
            {isOpen && (
              <div className="md:hidden mt-4 pb-4">
                <div className="flex items-center mb-4">
                  <div className="relative w-full">
                    <input 
                      type="text" 
                      placeholder="Search for products..." 
                      className="w-full py-2 px-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500 hover:text-green-700">
                      <Search size={20} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col space-y-3">
                  <a href="#" className="flex items-center py-2 text-gray-700 hover:text-green-600 border-b border-gray-200">
                    <Heart size={20} className="mr-2" />
                    <span>Wishlist</span>
                  </a>
                  <a href="#" className="flex items-center py-2 text-gray-700 hover:text-green-600 border-b border-gray-200">
                    <ShoppingCart size={20} className="mr-2" />
                    <span>Cart</span>
                  </a>
                  <a href="#" className="flex items-center py-2 text-gray-700 hover:text-green-600 border-b border-gray-200">
                    <User size={20} className="mr-2" />
                    <span>Login / Signup</span>
                  </a>
                </div>
              </div>
            )}
          </div>
    
          {/* Category navbar - visible on all screens */}
          <div className="bg-green-600 py-3 mt-1">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center">
                <div className="hidden md:flex space-x-6 text-white">
                  <a href="/" className="hover:text-green-200 transition duration-300">Home</a>
                  <a href="/" className="hover:text-green-200 transition duration-300 flex items-center">
                    Categories <ChevronDown size={16} className="ml-1" />
                  </a>
                  <a href="#" className="hover:text-green-200 transition duration-300">Deals</a>
                  <a href="#" className="hover:text-green-200 transition duration-300">New Arrivals</a>
                  <a href="#" className="hover:text-green-200 transition duration-300">About Us</a>
                  <a href="#" className="hover:text-green-200 transition duration-300">Contact</a>
                </div>
                <div className="md:hidden text-white font-medium">
                  Browse Categories
                </div>
                <div className="hidden md:block">
                  <a href="#" className="text-white font-semibold hover:text-green-200 transition duration-300">
                    Special Offers
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          </nav>
)
}
export default Navbar;