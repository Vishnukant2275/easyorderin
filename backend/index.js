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
    origin: function (origin, callback) {
      const allowedOrigins = [
        'https://easyorderin.com',
        'https://www.easyorderin.com',
        process.env.CLIENT_URL
      ].filter(Boolean);
      
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
// Additional CORS headers for all responses (especially images)
app.use((req, res, next) => {
  // Set CORS headers for all responses
  res.header("Access-Control-Allow-Origin", process.env.CLIENT_URL);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
  // Important for images and media
  res.header("Cross-Origin-Resource-Policy", "cross-origin");
  res.header("Cross-Origin-Embedder-Policy", "credentialless");
  
  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Body parser
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Safe Helmet (default blocks cross-site cookies)
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false, // Add this to allow image loading
  })
);

// Cookies
app.use(cookieParser());

// Logging
app.use(morgan("dev"));

// Serve uploads with proper CORS headers
app.use("/uploads", express.static("uploads", {
  setHeaders: (res, path) => {
    res.set("Access-Control-Allow-Origin", process.env.CLIENT_URL);
    res.set("Cross-Origin-Resource-Policy", "cross-origin");
  }
}));

// ===============================
// 4. Database Connection
// ===============================
const connectDB = require("./config/db");
connectDB();

// ===============================
// 5. Sessions (AFTER CORS, BEFORE ROUTES)
// ===============================
const isProduction = process.env.NODE_ENV === "production";

app.use(
  session({
    name: "sessionId",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
      ttl: 24 * 60 * 60,
    }),
    cookie: {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: true, // Force true for production
      sameSite: "none", // Required for cross-site cookies
      domain: process.env.NODE_ENV === "production" ? ".easyorderin.com" : undefined, // Add this
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
app.use("/api/restaurant", restaurantRoutes);
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

// Special CORS handler for image routes
app.get("/api/restaurant/image/:itemId", (req, res, next) => {
  // Set specific headers for image responses
  res.header("Access-Control-Allow-Origin", process.env.CLIENT_URL);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Cross-Origin-Resource-Policy", "cross-origin");
  res.header("Cross-Origin-Embedder-Policy", "credentialless");
  next();
});

// ===============================
// 7. Start Server
// ===============================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend allowed: ${process.env.CLIENT_URL}`);
  console.log(`CORS configured for images`);
});