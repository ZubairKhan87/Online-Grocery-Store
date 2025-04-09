const express = require("express");
const router = express.Router();
const Product = require("../models/Product"); // Your MongoDB Product model
const {search} = require("../controllars/searchController")
const { protect } = require('../middleware/authMiddleware'); 
router.get('/search', protect, search);
module.exports = router;
