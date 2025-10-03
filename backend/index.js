/************************************************************
 * index.js - Main Server Entry Point
 ************************************************************/

// 1. Import core packages
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

// 2. Load environment variables (.env file)
dotenv.config();

// 3. Create express app
const app = express();

// 4. Connect to Database (Keep DB logic in /config/db.js)
const connectDB = require("./config/db");
connectDB();

// 5. Global Middlewares (apply to all requests)
app.use(express.json());                // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(cors());                        // Enable CORS
app.use(helmet());                      // Add security headers
app.use(morgan("dev"));                 // Logger (dev mode)
app.use(cookieParser());                // Parse cookies
app.set("view engine", "ejs");   // Set EJS as the template engine


// 6. Import Routes (keep routes in /routes folder)
// const userRoutes = require("./routes/userRoutes");
// // const authRoutes = require("./routes/authRoutes");
 const restaurantRoutes = require("./routes/RestaurantRoute");
// const userRoutes = require("./routes/userRoutes");
// add more as your app grows...

// 7. Use Routes (prefix all APIs with /api for clarity)
// app.use("/api/users", userRoutes);
// app.use("/api/auth", authRoutes);
app.use("/api/restaurant",restaurantRoutes);
// app.use("/api/users",userRoutes); 

// 8. Default Route (for health check or root)
app.get("/api", (req, res) => {
  res.json({ title: "Welcome", message: "API is running..." });
});

// 9. Error Handling Middleware (keep in /middlewares folder)
// const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
// app.use(notFound);
// app.use(errorHandler);

// 10. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port http://localhost:${PORT}/api`);
});
