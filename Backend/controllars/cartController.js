
const mongoose= require("mongoose");
const Cart = require("../models/cartSchema");
const Product = require("../models/Product");
const { json } = require("express");
// add item to cart


exports.addToCart = async (req, res) => {
    console.log("Request received:", req.body);

    try {
        console.log("Request received:", req.body);

        const { productId, quantity = 1 } = req.body;
        const userId = req.user?.id;  // Ensure `req.user` exists

        console.log("Extracted userId:", userId);
        console.log("Extracted productId:", productId);

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product Not Found" });
        }

        console.log("Product found:", product);

        // Find user's cart or create a new one
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            console.log("No cart found for user, creating a new cart...");
            cart = new Cart({
                userId,
                items: [{ productId, quantity }],
            });
        } else {
            console.log("Cart found for user:", cart);

            // Check if the product is already in the cart
            const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

            if (itemIndex > -1) {
                console.log("Product already in cart, updating quantity...");
                cart.items[itemIndex].quantity += quantity;
            } else {
                console.log("Product not in cart, adding...");
                cart.items.push({ productId, quantity });
            }
        }

        cart.updatedAt = Date.now();

        await cart.save();
        console.log("Cart saved successfully:", cart);

        // Populate cart data
        const populatedCart = await Cart.findById(cart._id)
            .populate("items.productId", "title price images");

        console.log("Returning updated cart:", populatedCart);

        res.status(200).json({
            success: true,
            cart: populatedCart,
        });
    } catch (error) {
        console.error("Error in adding to cart:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// get card's of any user

exports.getCart = async (req,res) => {
  try {
      const userId = req.user.id;
      const cart = await Cart.findOne({userId}).populate({
          path: 'items.productId',
          select: 'name description category price stock unit brand images discount'
      });

      if (!cart){
          return res.status(200).json({
              success: true,
              cart: {items:[]}
          });
      }
      
      res.status(200).json({
          success: true,
          cart
      });
  } catch(error) {
      console.error("can't get cart items", error);
      res.status(500).json({
          success: false,
          message: 'Server error',
          error: error.message
      });
  }
};

 // update the cart item

 exports.updateCartItem = async (req, res) => {
    try {
      console.log("cart update hony ke request agie hai")
      const { productId, quantity } = req.body;
      const userId = req.user.id;
      
      // Validate inputs
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid product ID' });
      }
      
      if (!quantity || quantity < 1) {
        return res.status(400).json({ message: 'Quantity must be at least 1' });
      }
      
      // Find cart
      const cart = await Cart.findOne({ userId });
      
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
      
      // Find item in cart
      const itemIndex = cart.items.findIndex(item => 
        item.productId.toString() === productId
      );
      
      if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item not found in cart' });
      }
      
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
      cart.updatedAt = Date.now();
      console.log("cart updated bhi hogea hai")
      await cart.save();
      
      // Return updated cart
      const updatedCart = await Cart.findById(cart._id)
        .populate('items.productId', 'title price images');
      
      console.log("ye raha updated cart",updatedCart)
      res.status(200).json({
        success: true,
        cart: updatedCart
      });
      
    } catch (error) {
      console.error('Update cart error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  };



// delete any item from the cart

exports.removeCartItem = async(req,res)=>{
  console.log("cart item remove hony ke request agie hai")
    try{
      const productId = req.params.productId; // Correct parameter extraction
      const userId= req.user.id
        console.log("Product aur user to mill gea hai ",userId,productId)

        // Validate product ID
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }
        
        console.log("Product aur user to mill gea hai ",userId,productId)
        const cart = await Cart.findOneAndUpdate(
            {userId},
            {
                $pull : {items:{productId}},
                updatedAt: Date.now()
            },
            
            { 
              new: true,
              // runValidators: true
          }
          ).populate('items.productId', 'name price images');

        console.log("cart item remove hogea hai",cart)
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
          }
          
          res.status(200).json({
            success: true,
            cart
          });
          
        } catch (error) {
          console.error('Remove cart item error:', error);
          res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};


// Clear cart
exports.clearCart = async (req, res) => {
    try {
      const userId = req.user.id;
      
      const cart = await Cart.findOneAndUpdate(
        { userId },
        { 
          items: [],
          updatedAt: Date.now()
        },
        { new: true }
      );
      
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
      
      res.status(200).json({
        success: true,
        message: 'Cart cleared successfully',
        cart
      });
      
    } catch (error) {
      console.error('Clear cart error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  };