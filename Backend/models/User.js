const mongoose =require('mongoose')
const bcrypt = require("bcryptjs")

const userSchema= new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true}
})
// Middleware to delete orders of this user
userSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    try {
    const Order = require('./orderSchema'); // Import inside function to prevent circular dependency

      await Order.deleteMany({ user: this._id }); // Delete all orders by this user
      next();
    } catch (error) {
      next(error);
    }
  });

  userSchema.pre("save",async function(next){
    if (!this.isModified("password")) return next();
    this.password= await bcrypt.hash(this.password,10);
    next();
})

userSchema.methods.matchPassword = async function (eneteredPassword){
    return await bcrypt.compare(eneteredPassword,this.password)
}
module.exports = mongoose.model("User", userSchema)