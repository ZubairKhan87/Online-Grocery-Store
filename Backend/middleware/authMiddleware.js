const jwt = require("jsonwebtoken");
const User = require("../models/User");
const protect = (req, res, next)=>{
    const token = req.cookies.token
    if (!token){
        return res.status(401).json({ message: "Not authorized, no token" });
        }
    try{
        const decoded= jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch{
        return res.status(401).json({ message: "Token failed, authorization denied" });

    }
}
const adminMiddleware = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access only" });
    }
    next();
};

module.exports = { protect, adminMiddleware };