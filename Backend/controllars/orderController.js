// controllers/orderController.js
const Order = require('../models/orderSchema');
const Cart = require('../models/cartSchema');

// Get all orders for the logged-in user
exports.getUserOrders = async (req, res) => {
  try {

    console.log("Han ji ham aaa gaye hain user k order ko find krny k leay")
    // Find orders for the logged-in user, populating product details
    console.log("User ID:", req.user.id)

    const orders = await Order.find({ userId: req.user.id })
      .populate({
        path: 'items.productId',
        select: 'name price unit images' // Select only necessary product fields
      })
      .sort({ createdAt: -1 }); // Sort by most recent first
    console.log("Orders found:", orders)
    res.status(200).json({
      success: true,
      count: orders.length,
      orders: orders.map(order => ({
        _id: order._id,
        totalAmount: order.totalAmount,
        status: order.orderStatus,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
        items: order.items.map(item => ({
          productId: {
            _id: item.productId._id,
            name: item.productId.name,
            price: item.productId.price,
            unit: item.productId.unit,
            images: item.productId.images
          },
          quantity: item.quantity
        })),
        address: order.address
      }))
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to fetch orders',
      error: error.message
    });
  }
};

// Get single order details
exports.getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.orderId, 
      userId: req.user.id 
    }).populate({
      path: 'items.productId',
      select: 'name price unit images description'
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      order: {
        _id: order._id,
        totalAmount: order.totalAmount,
        status: order.orderStatus,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
        items: order.items.map(item => ({
          productId: {
            _id: item.productId._id,
            name: item.productId.name,
            price: item.productId.price,
            unit: item.productId.unit,
            images: item.productId.images,
            description: item.productId.description
          },
          quantity: item.quantity
        })),
        address: order.address
      }
    });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to fetch order details',
      error: error.message
    });
  }
};



// Cancel an order
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id; 
    // Find the order
    const order = await Order.findById(orderId);
    
    // Check if order exists
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    // Verify that the order belongs to the current user
    if (order.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized to cancel this order' });
    }
    
    // Check if the order is still in 'processing' status
    if (order.orderStatus !== 'processing') {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot cancel order that has been shipped or delivered'
      });
    }
    
    // Update the order status to 'cancelled'
    order.orderStatus = 'cancelled';
    await order.save();
    
    return res.status(200).json({
      success: true,
      message: 'Order has been cancelled successfully',
      order
    });
    
  } catch (error) {
    console.error('Error cancelling order:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to cancel order. Please try again.',
      error: error.message
    });
  }
};