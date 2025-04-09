const express = require('express');
const router = express.Router();
const { addToCart } = require("../controllars/cartController")
const { getCart,updateCartItem,removeCartItem } = require("../controllars/cartController")

const { protect } = require('../middleware/authMiddleware'); // Assuming you have auth middleware
// All cart routes require authentication
router.use(protect);
// Route to fetch all products (or only featured if specified)
console.log("agea yahan cart routes mn request")
router.post('/cart',addToCart);
router.get('/cart/count',getCart);
router.put('/cart/update',updateCartItem);
router.delete('/cart/remove/:productId',removeCartItem);


module.exports = router;
