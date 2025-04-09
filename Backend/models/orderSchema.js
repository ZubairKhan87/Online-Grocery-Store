const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
  
  totalAmount: { type: Number, required: true, min: 0 },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  orderStatus: { type: String, enum: ['processing', 'shipped', 'delivered', 'cancelled'], default: 'processing' },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: { type: String, default: 'Pakistan' },
  },
  createdAt: { type: Date, default: Date.now },
  
});


module.exports = mongoose.model('Order', orderSchema);
