/************************************************************
 * index.js - Main Server Entry Point (with Socket.IO)
 ************************************************************/

// 1. Import core packages
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
// 2. Load environment variables
dotenv.config();
const Razorpay = require("razorpay");

const bodyParser = require("body-parser");

// 3. Create express app & HTTP server
const app = express();
const server = http.createServer(app);
app.use(bodyParser.json());


// 4. Connect to Database
const connectDB = require("./config/db");
connectDB();

// 5. Session configuration (FIXED - only one session middleware)
const session = require("express-session");
const MongoStore = require("connect-mongo");

// Session middleware (only define once)
app.use(
  session({
    name: 'sessionId',
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions',
      ttl: 24 * 60 * 60, // 1 day
      autoRemove: 'native'
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    }
  })
);

// 6. Global Middlewares
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ 
  credentials: true, 
  origin: process.env.CLIENT_URL
}));
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());
app.set("view engine", "ejs");

// 7. Socket.IO setup with session support
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL ,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

// Socket.IO middleware to access session
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
io.use(wrap(session({
  secret: process.env.SESSION_SECRET || "your-secret-key",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
  })
})));

// 8. Handle socket connections with session support
io.on("connection", (socket) => {
  const req = socket.request;
  
  console.log("🟢 User connected:", socket.id);
  
  // Check if user is authenticated via session
  if (req.session.userAuth) {
    console.log("👤 User authenticated:", req.session.userAuth.phone);
    socket.join(`user_${req.session.userAuth.id}`);
  }
  
  if (req.session.restaurantAuth) {
    console.log("🏪 Restaurant authenticated:", req.session.restaurantAuth.email);
    socket.join(`restaurant_${req.session.restaurantAuth.id}`);
  }

  // Listen for events from client
  socket.on("sendMessage", (data) => {
    console.log("📩 Message received:", data);
    
    // Add sender info from session
    if (req.session.userAuth) {
      data.sender = {
        type: 'user',
        id: req.session.userAuth.id,
        name: req.session.userAuth.name
      };
    } else if (req.session.restaurantAuth) {
      data.sender = {
        type: 'restaurant', 
        id: req.session.restaurantAuth.id,
        name: req.session.restaurantAuth.name
      };
    }
    
    // Broadcast to all clients
    io.emit("receiveMessage", data);
  });

  // Join room based on user/restaurant ID
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  // Leave room
  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
    console.log(`User ${socket.id} left room: ${roomId}`);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// 9. Export io for use in other files
app.set('io', io);

// 10. Import Routes
const restaurantRoutes = require("./routes/RestaurantRoute");
const userRoutes = require("./routes/UserRoute");
const authRoutes = require("./routes/AuthRouter");
const adminRoutes = require("./routes/AdminRouter");
// 11. Use Routes
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/razorpay", require("./routes/RazorpayRoute"));
// 12. Default Route
app.get("/api", (req, res) => {
  res.json({ title: "Welcome", message: "API is running..." });
});

// 13. Session check routes (for testing)
app.get("/api/session-check", (req, res) => {
  res.json({
    session: req.session,
    userAuth: req.session.userAuth,
    restaurantAuth: req.session.restaurantAuth
  });
});

// 14. Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(
    `✅ Server running in ${process.env.NODE_ENV || 'development'} mode on port http://localhost:${PORT}/api`
  );
  console.log(`🔗 CORS enabled for: ${process.env.CLIENT_URL}`);
});

// Export for testing
module.exports = { app, server, io };