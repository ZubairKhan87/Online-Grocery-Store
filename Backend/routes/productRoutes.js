const express = require('express');
const router = express.Router();
const { getProducts } = require('../controllars/productController');
// Route to fetch all products (or only featured if specified)
router.get('/products', getProducts);
module.exports = router;
