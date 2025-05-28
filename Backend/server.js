const express = require("express");
const dotenv = require("dotenv");
// Load environment variables at the very beginning
dotenv.config();

const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const AdminBro = require('admin-bro');
const AdminBroExpress = require('@admin-bro/express');
const AdminBroMongoose = require('@admin-bro/mongoose');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs'); // For password encryption
const path = require("path");

// Import MongoDB connection
const connectDB = require("./config/db");

// Import routes
const authRoutes = require("./routes/authRoutes");
const productSearch = require("./routes/productSearch");
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Import middleware
const { errorHandler } = require("./middleware/errorMiddleware");

// Import models
const User = require('./models/User'); 
const Product = require('./models/Product');  
const Order = require('./models/orderSchema');
const Category = require("./models/categorySchema");

// Debug MongoDB URI - make sure this is loaded
console.log("MONGO_URI exists:", !!process.env.MONGO_URI);  // Safer debug (without exposing actual URI)

// Connect to database
connectDB();
console.log("Code aik dum must chal rha abhi tak");

// Initialize express
const app = express();

// CORS configuration
app.use(cors({
    origin: 'http://localhost:5173', // frontend origin
    credentials: true // Allow credentials
}));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Routes
app.use("/api", productSearch);
app.use("/api/auth", authRoutes);
app.use('/api', productRoutes);
app.use("/api", cartRoutes);
app.use("/api", orderRoutes);

// Error Middleware
app.use(errorHandler);

// AdminBro setup
AdminBro.registerAdapter(AdminBroMongoose);
const adminBro = new AdminBro({
  databases: [mongoose],
  rootPath: '/admin',
  branding: {
    companyName: 'FreshMart Admin',
    logo: 'https://www.lsretail.com/hs-fs/hubfs/7_tips_to_deliver_better_online_grocery_shopping.jpg?width=1239&height=620&name=7_tips_to_deliver_better_online_grocery_shopping.jpg',
    theme: {
      colors: {
        primary100: '#28a745', // Green color for FreshMart
        primary80: '#20c997',
        primary60: 'black',
      },
    },
  },
});

// Authentication setup
const hashedPassword = bcrypt.hashSync('securepassword123', 10);

const ADMIN = {
  email: 'admin@freshmart.com',
  password: hashedPassword,
};

// Enhanced security settings for cookies
const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    if (email === ADMIN.email && bcrypt.compareSync(password, ADMIN.password)) {
      return ADMIN;
    }
    return null;
  },
  cookiePassword: process.env.COOKIE_SECRET || 'a-very-secure-cookie-secret',
  cookieName: 'freshmart_admin_session',
}, null, {
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 3600000, // 1 hour
  }
});

app.use(adminBro.options.rootPath, router);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`FreshMart Admin running on port ${PORT}`));