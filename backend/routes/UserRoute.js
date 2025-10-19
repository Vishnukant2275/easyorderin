const express = require("express");
const otpModel = require("../models/otp");
const Restaurant = require("../models/restaurant");
const Tables = require("../models/Tables");
const Menu = require("../models/Menu");
const Order = require("../models/Order");
const User = require("../models/User");
const router = express.Router();

// GET /api/users - Get all users (Admin only)
router.get("/", async (req, res) => {
  try {
    const users = await User.find()
      .select("-__v")
      .populate("currentOrder")
      .populate("orderHistory");

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Server error while fetching users",
    });
  }
});
// Send OTP route
router.get("/send-otp", async (req, res) => {
  try {
    const { phone } = req.query;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // In production, you would send this OTP via SMS service
    console.log(`OTP for ${phone}: ${otp}`);

    // Store OTP in database or session (you'll need to implement this)
    // await OTPModel.create({ phone, otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) });

    res.json({
      success: true,
      message: "OTP sent successfully",
      // Don't send OTP in production response
      debugOtp: otp, // Remove this in production
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
});

// Verify OTP route
router.post("/verify-otp", async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone and OTP are required",
      });
    }

    // Verify OTP from database (you'll need to implement this)
    // const otpRecord = await OTPModel.findOne({
    //   phone,
    //   otp,
    //   expiresAt: { $gt: new Date() }
    // });

    // For demo purposes, accept any 6-digit OTP
    if (otp.length === 6 && /^\d+$/.test(otp)) {
      let user = await User.findOne({ phone });
      if (!user) {
        user = new User({
          phone,
          name: `Customer${phone.slice(-4)}`,
        });
        await user.save();
      }
      req.session.user = {
        id: user._id,
        phone: user.phone,
        name: user.name,
      };
      res.json({
        success: true,
        message: "OTP verified successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
    });
  }
});
// GET /api/users/:userId - Get user by ID
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select("-__v")
      .populate("currentOrder")
      .populate({
        path: "orderHistory",
        populate: {
          path: "items.menuItem",
          model: "Menu",
        },
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        error: "Invalid user ID format",
      });
    }
    res.status(500).json({
      success: false,
      error: "Server error while fetching user",
    });
  }
});

// POST /api/users - Create new user
router.post("/", async (req, res) => {
  try {
    const { name, phone } = req.body;

    // Validation
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        error: "Name and phone are required fields",
      });
    }

    // Check if user already exists with this phone
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "User already exists with this phone number",
        userId: existingUser._id,
      });
    }

    // Create new user
    const user = new User({
      name,
      phone,
    });

    const savedUser = await user.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        _id: savedUser._id,
        name: savedUser.name,
        phone: savedUser.phone,
        email: savedUser.email,
      },
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: "Phone number already registered",
      });
    }
    res.status(500).json({
      success: false,
      error: "Server error while creating user",
    });
  }
});

// PUT /api/users/:userId - Update user profile
router.put("/:userId", async (req, res) => {
  try {
    const { name, email } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (email !== undefined) updateData.email = email;

    const user = await User.findByIdAndUpdate(req.params.userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-__v");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        error: "Invalid user ID format",
      });
    }
    res.status(500).json({
      success: false,
      error: "Server error while updating user",
    });
  }
});

// DELETE /api/users/:userId - Delete user
router.delete("/:userId", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
      data: {
        _id: user._id,
        name: user.name,
      },
    });
  } catch (error) {
    console.error(error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        error: "Invalid user ID format",
      });
    }
    res.status(500).json({
      success: false,
      error: "Server error while deleting user",
    });
  }
});

// GET /api/users/phone/:phone - Get user by phone number
router.get("/phone/:phone", async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.params.phone })
      .select("-__v")
      .populate("currentOrder")
      .populate("orderHistory");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found with this phone number",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Server error while fetching user by phone",
    });
  }
});

// POST /api/users/:userId/orders - Add order to user's history
router.post("/:userId/orders", async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        error: "Order ID is required",
      });
    }

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Add to order history and set as current order
    user.orderHistory.push(orderId);
    user.currentOrder = orderId;

    await user.save();

    // Populate the updated user data
    const updatedUser = await User.findById(req.params.userId)
      .populate("currentOrder")
      .populate("orderHistory");

    res.json({
      success: true,
      message: "Order added to user history",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        error: "Invalid user ID or order ID format",
      });
    }
    res.status(500).json({
      success: false,
      error: "Server error while adding order to user",
    });
  }
});

// GET /api/users/:userId/orders - Get user's order history
router.get("/:userId/orders", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate({
        path: "orderHistory",
        populate: {
          path: "items.menuItem",
          model: "Menu",
        },
      })
      .select("orderHistory");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      count: user.orderHistory.length,
      data: user.orderHistory,
    });
  } catch (error) {
    console.error(error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        error: "Invalid user ID format",
      });
    }
    res.status(500).json({
      success: false,
      error: "Server error while fetching user orders",
    });
  }
});

// PATCH /api/users/:userId/current-order - Update current order
router.patch("/:userId/current-order", async (req, res) => {
  try {
    const { orderId } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { currentOrder: orderId || null },
      { new: true, runValidators: true }
    ).populate("currentOrder");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Current order updated successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        error: "Invalid user ID or order ID format",
      });
    }
    res.status(500).json({
      success: false,
      error: "Server error while updating current order",
    });
  }
});

module.exports = router;
