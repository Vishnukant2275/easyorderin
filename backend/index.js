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
const http = require("http"); // 👈 Add this line for socket.io
const { Server } = require("socket.io"); // 👈 Add this line for socket.io

// 2. Load environment variables
dotenv.config();

// 3. Create express app & HTTP server
const app = express();
const server = http.createServer(app); // 👈 use server instead of app.listen

app.use("/uploads", express.static("uploads"));
// 4. Setup Session
const session = require("express-session");
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// 5. Connect to Database
const connectDB = require("./config/db");
connectDB();

// 6. Global Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());
app.set("view engine", "ejs");

// 7. Import Routes
const restaurantRoutes = require("./routes/RestaurantRoute");
const userRoutes = require("./routes/UserRoute");
const authRoutes= require("./routes/AuthRouter")
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/user",userRoutes);
app.use("/api/auth",authRoutes);

// 8. Default Route
app.get("/api", (req, res) => {
  res.json({ title: "Welcome", message: "API is running..." });
});

// 9. Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // React app ka URL
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// 10. Handle socket connections
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // Listen for events from client
  socket.on("sendMessage", (data) => {
    console.log("📩 Message received:", data);

    // Broadcast to all clients
    io.emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// 11. Export io if needed in other files (optional)
module.exports = { io };

// 12. Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(
    `✅ Server running in ${process.env.NODE_ENV} mode on port http://localhost:${PORT}/api`
  );
});
