const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Vegetables', 'Fruits', 'Dairy', 'Bakery', 'Beverages', 'Meat', 'Snacks', 'Frozen', 'Grains', 'Spices', 'Other'],
    },
    price: { type: Number, required: true, min: 0 },
    stock: { type: String, required: true, min: 0 },
    unit: { type: String, required: true, enum: ['kg', 'g', 'litre', 'ml', 'pcs', 'pack'] },
    brand: { type: String, trim: true },
    images: [{ url: { type: String, required: true } }],
    discount: { type: Number, default: 0, min: 0, max: 100 },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Middleware to delete orders when a product is deleted
productSchema.pre('findOneAndDelete', async function (next) {
  try {
    const Order = require('./orderSchema'); // Import inside function to prevent circular dependency
    await Order.deleteMany({ 'products.product': this._id });
    next();
  } catch (error) {
    next(error);
  }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
