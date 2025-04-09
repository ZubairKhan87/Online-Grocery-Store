import { useState, useContext } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {AuthContext } from "./AuthContext"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const result = await login(email, password);
      if (result.success) {
        // If login successful, redirect to home or previous page
        const redirectTo = new URLSearchParams(window.location.search).get('redirectTo') || '/';
        navigate('/');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("An unexpected error occurred");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
    

    const handleLogin=()=>{
        navigate("/")
    }
    return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg border border-gray-100">
  <div className="flex justify-center mb-6">
    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {/* <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /> */}
      </svg>
    </div>
  </div>
  <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Welcome Back</h2>
  <p className="text-gray-600 text-center mb-6">Sign in to your grocery account</p>
  
  <form onSubmit={handleSubmit} className="space-y-5">
    <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {/* <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /> */}
          </svg>
        </div>
        <input 
          id="email"
          type="email" 
          placeholder="you@example.com" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
    </div>
    
    <div>
      <div className="flex items-center justify-between mb-1">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <a href="#" className="text-sm text-green-600 hover:text-green-800">htmlForgot password?</a>
      </div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {/* <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /> */}
          </svg>
        </div>
        <input 
          id="password"
          type="password" 
          placeholder="••••••••" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
    </div>
    
    <div className="flex items-center">
      <input 
        id="remember_me"
        type="checkbox" 
        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" 
      />
      <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-700">
        Remember me
      </label>
    </div>
    
    <div>
      <button 
        type="submit" 
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300 ease-in-out font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        disabled={loading}

      >
        Sign In
      </button>
    </div>
  </form>
  
  <div className="mt-6 text-center">
    <p className="text-sm text-gray-600">
      Don't have an account? 
      <a href="#" className="font-medium text-green-600 hover:text-green-800">Sign up</a>
    </p>
  </div>
</div>
    );
};

export default Login;
