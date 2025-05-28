import React, { useState, useEffect,useContext } from 'react';
import { ShoppingCart, Search, User, Heart, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube, ChevronDown, Menu, X } from 'lucide-react';
import { useNavigate,Link } from "react-router-dom";
import Navbar from './NavBar';
import HeroSlider from "./HeroSlider"
// Main App Component
const FreshMartLanding = () => {
 
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <HeroSlider />
      <Categories />
      <FeaturedProducts />
      <TrendingProducts />
      <SpecialOffers />
      <Testimonials />
      <Newsletter />
      {/* <Footer /> */}
    </div>
  );
};



// Categories Component
const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products?featured=true") // Adjust based on your API
      .then(response => response.json())
      .then(data => {
        // Group products by category
        const categoryMap = {};
        
        data.forEach(product => {
          if (!categoryMap[product.category]) {
            categoryMap[product.category] = {
              name: product.category,
              image: product.images.length > 0 ? product.images[0].url : "default-image-url.jpg", 
              count: 1,
            };
          } else {
            categoryMap[product.category].count += 1;
          }
        });

        setCategories(Object.values(categoryMap)); // Convert to array
      })
      .catch(error => console.error("Error fetching products:", error));
  }, []);

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Shop By Category</h2>
          
          <p className="text-gray-600">Browse our wide selection of fresh products</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(category => (
            <div 
              key={category.name} 
              className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-transform duration-300 transform hover:-translate-y-2"
            >
              <div className="relative h-36 overflow-hidden">
                <img 
                  src={category.image}
                  alt={category.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold text-lg mb-1 text-gray-800">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count} products</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};



// Product Card Component
// src/components/ProductCard.js
import { AuthContext } from './AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify'; 

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();
  
  // Use the context
  const { isAuthenticated = false } = useContext(AuthContext) || {};
  
  const handleAddToCart = async () => {
    // If user is not authenticated, redirect to login page
    if (!isAuthenticated) {
      // Save the current page URL to redirect back after login
      navigate(`/login?redirectTo=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    
    // User is authenticated, proceed with adding to cart
    setIsAdding(true);
    try {
      // Add the item to cart using our API
      const response = await axios.post(
        'http://localhost:5000/api/cart', 
        { 
          productId: product._id, 
          quantity: 1 
        },
        { withCredentials: true } // Important for sending cookies
      );
      
      // Optional: Show success message
      toast?.success('Item added to cart successfully');
      
      console.log('Product added to cart:', response.data);
      
      // Optional: Update cart count in UI if you have a cart counter
      
    } catch (error) {
      console.error('Error adding product to cart:', error);
      toast?.error(error.response?.data?.message || 'Error adding to cart');
    } finally {
      setIsAdding(false);
    }
  };
  
  return (
    <div 
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {product.discount && (
        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-full z-10">
          {product.discount}% OFF
        </div>
      )}
      
      <div className="relative h-48 overflow-hidden">
        <img 
          src={product.images && product.images.length > 0 ? product.images[0].url : 'default-image-url.jpg'} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 transform-gpu hover:scale-110" 
        />
        
        <div className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex space-x-2">
            <button 
              className="cursor-pointer bg-white p-2 rounded-full hover:bg-green-500 hover:text-white transition duration-300"
              onClick={handleAddToCart}
              disabled={isAdding}
            >
              <ShoppingCart size={18} />
            </button>
            <button className="bg-white p-2 rounded-full hover:bg-green-500 hover:text-white transition duration-300">
              <Heart size={18} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-green-600 font-medium">{product.category}</span>
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < product.rating ? "text-yellow-400" : "text-gray-300"}>★</span>
            ))}
          </div>
        </div>
        
        <h3 className="font-semibold text-gray-800 mb-1 hover:text-green-600 transition duration-300">
          {product.title}
        </h3>
        
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="font-bold text-lg text-gray-800">${product.price.toFixed(2)}</span>
            {product.price && (
              <span className="text-sm text-gray-400 line-through ml-2">${(product.price+10).toFixed(2)}</span>
            )}
          </div>
          
          <button 
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`cursor-pointer ${isAdding ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white rounded-full py-1 px-3 text-sm transition duration-300`}
          >
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};


// Featured Products Component
const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
   // Use the context
  const { isAuthenticated = false } = useContext(AuthContext) || {};
  
  const handleAddToCart = async () => {
    // If user is not authenticated, redirect to login page
    if (!isAuthenticated) {
      // Save the current page URL to redirect back after login
      navigate(`/login?redirectTo=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    
    // User is authenticated, proceed with adding to cart
    setIsAdding(true);
    try {
      // Add the item to cart using our API
      const response = await axios.post(
        'http://localhost:5000/api/cart', 
        { 
          productId: products._id, 
          quantity: 1 
        },
        { withCredentials: true } // Important for sending cookies
      );
      
      // Optional: Show success message
      toast.success('Item added to cart successfully');
      
      console.log('Product added to cart:', response.data);
      
      // Optional: Update cart count in UI if you have a cart counter
      
    } catch (error) {
      console.error('Error adding product to cart:', error);
      toast.error(error.response?.data?.message || 'Error adding to cart');

    } finally {
      setIsAdding(false);
    }
  };
  useEffect(() => {
    fetch("http://localhost:5000/api/products?featured=true") // Adjust URL based on your server
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error("Error fetching products:", error));
  }, []);
  console.log(products)


  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-1">Featured Products</h2>
            <p className="text-gray-600">Explore our handpicked selection of the finest products</p>
          </div>
          <a href="login" className="hidden md:block text-green-600 hover:text-green-800 font-semibold transition duration-300">
            View All →
          </a>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        
        {products.slice(0, 8).map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <a href="login" className="inline-block bg-white border border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-semibold py-2 px-6 rounded-full transition duration-300">
            View All Products
          </a>
        </div>
      </div>
    </section>
  );
};

// Trending Products Component
const TrendingProducts = () => {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    fetch("http://localhost:5000/api/products?featured=true") // Adjust URL based on your server
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error("Error fetching products:", error));
  }, []);

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-1">Trending Products</h2>
            <p className="text-gray-600">Discover what's popular this week</p>
          </div>
          <a href="login" className="hidden md:block text-green-600 hover:text-green-800 font-semibold transition duration-300">
            View All →
          </a>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[...products] // Clone the array to avoid modifying the original
          .sort(() => Math.random() - 0.5) // Shuffle the array
          .slice(0, 6) // Get only 6 items
          .map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        }

        </div>
      </div>
    </section>
  );
};

// Special Offers Component
const SpecialOffers = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative overflow-hidden rounded-lg shadow-lg group">
            <img 
              src="https://cdn.shopify.com/s/files/1/0445/1365/6985/files/how-to-choose-fresh-veggies.jpg?v=1638206855" 
              alt="Fresh Vegetables" 
              className="w-full h-full object-cover transition-transform duration-700 transform-gpu group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-green-800/70 to-green-800/40 flex flex-col justify-center px-8 py-6">
              <span className="bg-green-600 text-white text-xs uppercase font-semibold py-1 px-3 rounded-full mb-4 inline-block">Limited Time</span>
              <h3 className="text-white text-2xl md:text-3xl font-bold mb-2">Fresh Vegetables</h3>
              <p className="text-white mb-4">Get up to 30% off on all vegetables</p>
              <button className="bg-white text-green-700 hover:bg-green-50 transition duration-300 font-semibold py-2 px-6 rounded-full inline-block w-max">
                Shop Now
              </button>
            </div>
          </div>
          
          <div className="relative overflow-hidden rounded-lg shadow-lg group">
            <img 
              src="https://previews.123rf.com/images/monticello/monticello1502/monticello150200118/36917614-basket-of-fresh-organic-fruits-in-the-garden.jpg" 
              alt="Organic Fruits" 
              className="w-full h-full object-cover transition-transform duration-700 transform-gpu group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-green-800/70 to-green-800/40 flex flex-col justify-center px-8 py-6">
              <span className="bg-green-600 text-white text-xs uppercase font-semibold py-1 px-3 rounded-full mb-4 inline-block">Special Offer</span>
              <h3 className="text-white text-2xl md:text-3xl font-bold mb-2">Organic Fruits</h3>
              <p className="text-white mb-4">Buy 2 get 1 free on all organic fruits</p>
              <button className="bg-white text-green-700 hover:bg-green-50 transition duration-300 font-semibold py-2 px-6 rounded-full inline-block w-max">
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Testimonials Component
const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Regular Customer",
      image: "/api/placeholder/80/80",
      text: "FreshMart has transformed how I shop for groceries. The quality of their products is exceptional, and the delivery is always prompt. I can't imagine going back to traditional grocery shopping!",
      rating: 5
    },
    {
      id: 2,
      name: "Michael Thompson",
      role: "Foodie Enthusiast",
      image: "/api/placeholder/80/80",
      text: "As someone who loves cooking with fresh ingredients, I'm extremely impressed with the quality and variety available at FreshMart. Their organic selection is unmatched!",
      rating: 5
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Health Coach",
      image: "/api/placeholder/80/80",
      text: "I recommend FreshMart to all my clients. The produce is always fresh, and they offer so many healthy options. It's made maintaining a nutritious diet so much easier.",
      rating: 4
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">What Our Customers Say</h2>
          <p className="text-gray-600">Don't just take our word for it</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < testimonial.rating ? "text-yellow-400" : "text-gray-300"}>★</span>
                ))}
              </div>
              
              <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
              
              <div className="flex items-center">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Newsletter Component
const Newsletter = () => {
  return (
    <section className="py-12 bg-green-700 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-8 text-center md:text-left">
            <h2 className="text-3xl font-bold mb-2">Subscribe to Our Newsletter</h2>
            <p className="text-green-100">Get updates on new products and exclusive offers</p>
          </div>
          
          <div className="w-full md:w-1/2 max-w-md">
            <form className="flex flex-col sm:flex-row">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-3 w-full rounded-l-lg sm:rounded-r-none focus:outline-none text-gray-800"
              />
              <button 
                type="submit" 
                className="mt-2 sm:mt-0 bg-green-900 hover:bg-green-800 transition duration-300 text-white font-semibold py-3 px-6 rounded-r-lg sm:rounded-l-none"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
export default FreshMartLanding;  // Add this line
