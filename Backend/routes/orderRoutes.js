const express = require('express');
const router = express.Router();

const { createOrder,clearCart } = require('../controllars/createOrderController');
const { protect } = require('../middleware/authMiddleware'); 
const { getUserOrders,getOrderDetails,cancelOrder } = require('../controllars/orderController');

// Route to fetch all products (or only featured if specified)
// Clear entire cart after order
// Create new order
router.post('/orders', createOrder);
// Get all user orders
router.get('/get-orders', protect,getUserOrders);
router.patch('/cancel-order/:orderId', protect, cancelOrder);

router.delete('/cart/clear', clearCart);

// Get single order details
router.get('/get-orders/:orderId', protect, getOrderDetails);
// Cancel order
module.exports = router;
