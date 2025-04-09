const express = require('express');
const router = express.Router();

const { createOrder,clearCart } = require('../controllars/createOrderController');
const { protect } = require('../middleware/authMiddleware'); 
const { getUserOrders,getOrderDetails } = require('../controllars/orderController');

// Route to fetch all products (or only featured if specified)
// Clear entire cart after order
router.delete('/cart/clear', clearCart);
// Create new order
router.post('/orders', createOrder);
// Get all user orders
router.get('/get-orders', protect,getUserOrders);
  
  // Get single order details
  router.get('/get-orders/:orderId', protect, getOrderDetails);
  module.exports = router;
