import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the context with default values
export const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false
});

export const AuthProvider = ({ children }) => {
  
  // Check localStorage for user info on initial load
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      
      // Save user data from response
      const userData = response.data;
      setUser(userData);
      
      // Store in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(userData));
      
      return { success: true, data: userData };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || "Login failed" 
      };
    }
  };

  // Logout function
  const logout = () => {
    // Clear user from state
    setUser(null);
    
    // Remove from localStorage
    localStorage.removeItem('user');
    
    // Optional: Call logout endpoint if you have one
    try {
      axios.post("http://localhost:5000/api/auth/logout", {}, 
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Logout error:", error);
    }
    
    return { success: true };
  };

  // Create the value object
  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};