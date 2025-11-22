// 1. Import core packages
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const http = require("http");

// 2. Load environment variables
dotenv.config();
const Razorpay = require("razorpay");

const bodyParser = require("body-parser");

// 3. Create express app & HTTP server
const app = express();

app.use(bodyParser.json());

// 4. Connect to Database
const connectDB = require("./config/db");
connectDB();

// 5. Session configuration (FIXED - only one session middleware)
const session = require("express-session");
const MongoStore = require("connect-mongo");

// Session middleware (only define once)
app.set("trust proxy", 1);
app.use(
  session({
    name: "sessionId",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
      ttl: 24 * 60 * 60, // 1 day
      autoRemove: "native",
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

// 6. Global Middlewares
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());
app.set("view engine", "ejs");

// 10. Import Routes
const restaurantRoutes = require("./routes/RestaurantRoute");
const userRoutes = require("./routes/UserRoute");
const authRoutes = require("./routes/AuthRouter");
const adminRoutes = require("./routes/AdminRouter");
// 11. Use Routes
app.use("/restaurant", restaurantRoutes);
app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/razorpay", require("./routes/RazorpayRoute"));
// 12. Default Route
app.get("/api", (req, res) => {
  res.json({ title: "Welcome", message: "API is running..." });
});

// 13. Session check routes (for testing)
app.get("/api/session-check", (req, res) => {
  res.json({
    session: req.session,
    userAuth: req.session.userAuth,
    restaurantAuth: req.session.restaurantAuth,
  });
});

// Export for testing
module.exports = { app };
