
const mongoose= require("mongoose");
const Cart = require("../models/cartSchema");
const Product = require("../models/Product");
const { json } = require("express");
exports.search= async (req, res) => {
    try {
      const query = req.query.q;
      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }
  
      const results = await Product.find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      });
  
      res.json(results);
    } catch (error) {
      console.error("Error in search API:", error);
      res.status(500).json({ error: "Server error" }); // ✅ Always return JSON
    }
  };
  