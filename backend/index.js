// ===============================
// 1. Core imports
// ===============================
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bodyParser = require("body-parser");
const http = require("http");

// Load env
dotenv.config();

// Express app
const app = express();

// ===============================
// 2. MUST BE FIRST — TRUST PROXY
// ===============================
app.set("trust proxy", 1); // critical for Render HTTPS cookies

// Create HTTP server
const server = http.createServer(app);

// ===============================
// 3. Global Middlewares
// ===============================

// ---- CORS MUST COME BEFORE SESSION ----
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Body parser
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Safe Helmet (default blocks cross-site cookies)
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// Cookies
app.use(cookieParser());

// Logging
app.use(morgan("dev"));

// Serve uploads
app.use("/uploads", express.static("uploads"));

// ===============================
// 4. Database Connection
// ===============================
const connectDB = require("./config/db");
connectDB();

// ===============================
// 5. Sessions (AFTER CORS, BEFORE ROUTES)
// ===============================
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
    }),
    cookie: {
      secure: true, // required for Render HTTPS
      httpOnly: true,
      sameSite: "none", // required for cross-site cookie
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// ===============================
// 6. Routes
// ===============================
app.set("view engine", "ejs");

const restaurantRoutes = require("./routes/RestaurantRoute");
const userRoutes = require("./routes/UserRoute");
const authRoutes = require("./routes/AuthRouter");
const adminRoutes = require("./routes/AdminRouter");
const razorpayRoutes = require("./routes/RazorpayRoute");

app.use("/restaurant", restaurantRoutes);
app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/razorpay", razorpayRoutes);

// Default API
app.get("/api", (req, res) => {
  res.json({ message: "API running..." });
});

// Debug session route
app.get("/api/session-check", (req, res) => {
  res.json({
    session: req.session,
  });
});

// ===============================
// 7. Start Server
// ===============================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend allowed: ${process.env.CLIENT_URL}`);
});
