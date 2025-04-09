const mongoose= require("mongoose");
const Order = require("../models/orderSchema");
const Cart = require("../models/cartSchema");
exports.createOrder = async (req, res) => {
    console.log("Request received:", req.body);
    try {
      console.log("Hanji order hony wala hai ab")
      const { items, totalAmount, address, paymentMethod } = req.body;
      const userId = req.user.id;
  
      const order = new Order({
        userId,
        items,
        totalAmount,
        address,
        paymentStatus: 'pending',
        orderStatus: 'processing'
      });
  
      await order.save();
  
      res.status(201).json({
        success: true,
        order
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating order'
      });
    }
  };
  
  exports.clearCart = async (req, res) => {
    try {
      await Cart.findOneAndUpdate(
        { userId: req.user.id },
        { items: [] }
      );
  
      res.status(200).json({
        success: true,
        message: 'Cart cleared successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error clearing cart'
      });
    }
  };