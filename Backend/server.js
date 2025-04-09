const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const AdminBro = require('admin-bro');
const AdminBroExpress = require('@admin-bro/express');
const AdminBroMongoose = require('@admin-bro/mongoose');
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const { errorHandler } = require("./middleware/errorMiddleware");
const bcrypt = require('bcryptjs'); // For password encryption
const productSearch = require("./routes/productSearch");

// Import  Mongoose models
const User = require('./models/User'); 
const Product = require('./models/Product');  
const Order = require('./models/orderSchema');
const Category = require("./models/categorySchema")
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes')
const orderRoutes = require('./routes/orderRoutes')
require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");
console.log("MONGO_URI:", process.env.MONGO_URI);  // Debugging step
console.log(" KOi msla ni hai, code aik dum must chal rha abhi tak")
dotenv.config();
connectDB(); // Move  line here

const app = express();
// ✅ Correct CORS configuration
// Use  configuration
app.use(cors({
    origin: 'http://localhost:5173', //  frontend origin
    credentials: true // Allow credentials
  }));
// app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Routes
app.use("/api", productSearch);
app.use("/api/auth", authRoutes);
app.use('/api', productRoutes);
app.use("/api",cartRoutes);
app.use("/api",orderRoutes);
// Error Middleware
app.use(errorHandler);

AdminBro.registerAdapter(AdminBroMongoose);
// // Initialize AdminBro
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