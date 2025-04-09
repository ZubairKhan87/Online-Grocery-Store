const Product = require('../models/Product'); // Import the schema

// Fetch all products or featured ones
exports.getProducts = async (req, res) => {
    try {
        const { featured } = req.query;
        const filter = featured === "true" ? { isFeatured: true } : {}; // Filter for featured products
        const products = await Product.find(filter);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
