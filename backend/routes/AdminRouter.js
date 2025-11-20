const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");
const Restaurant = require("../models/restaurant");
const User = require("../models/User");
const Order = require("../models/Order");
// User Routes

// GET /api/admin/users - Get all users (Protected)
// GET ALL USERS WITH ORDER STATS
router.get("/users",  async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const orderIds = user.orderHistory || []; // Fixed: changed from 'orders' to 'orderHistory'

        if (orderIds.length === 0) {
         return {
  ...user.toObject(),
  totalOrders: orderStats[0]?.totalOrders || 0,
  totalSpent: orderStats[0]?.totalSpent || 0,
  lastOrder: orderStats[0]?.lastOrder || null,
  favoriteRestaurant:
    favoriteRestaurant[0]?.restaurant?.name || "No favorite",
  status: user.status || "active",   
  joinDate: user.createdAt,
};

        }

        const orderStats = await Order.aggregate([
          { $match: { _id: { $in: orderIds } } },
          {
            $group: {
              _id: null,
              totalOrders: { $sum: 1 },
              totalSpent: { $sum: "$totalPrice" }, // Fixed: changed from 'totalAmount' to 'totalPrice'
              lastOrder: { $max: "$createdAt" }, // Fixed: changed from 'orderDate' to 'createdAt'
            },
          },
        ]);

        const favoriteRestaurant = await Order.aggregate([
          { $match: { _id: { $in: orderIds } } },
          { $group: { _id: "$restaurantId", count: { $sum: 1 } } }, // Fixed: changed from 'restaurant' to 'restaurantId'
          { $sort: { count: -1 } },
          { $limit: 1 },
          {
            $lookup: {
              from: "restaurants",
              localField: "_id",
              foreignField: "_id",
              as: "restaurant",
            },
          },
          { $unwind: "$restaurant" },
        ]);

        return {
          ...user.toObject(),
          totalOrders: orderStats[0]?.totalOrders || 0,
          totalSpent: orderStats[0]?.totalSpent || 0,
          lastOrder: orderStats[0]?.lastOrder || null,
          favoriteRestaurant:
            favoriteRestaurant[0]?.restaurant?.name || "No favorite",
          status: user.status, // Add default status
          joinDate: user.createdAt, // Map createdAt to joinDate
        };
      })
    );

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: usersWithStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching users",
    });
  }
});

// GET /api/admin/users/:id - Get user by ID (Protected)
router.get("/users/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get user statistics
    const orderStats = await Order.aggregate([
      { $match: { customer: user._id } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$totalAmount" },
          lastOrder: { $max: "$orderDate" },
        },
      },
    ]);

    const userWithStats = {
      ...user.toObject(),
      totalOrders: orderStats[0]?.totalOrders || 0,
      totalSpent: orderStats[0]?.totalSpent || 0,
      lastOrder: orderStats[0]?.lastOrder || null,
    };

    res.status(200).json({
      success: true,
      data: userWithStats,
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user",
    });
  }
});

// PUT /api/admin/users/:id/toggle-status - Toggle user status (Protected)
router.put("/users/:id/toggle-status", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.status = user.status === "active" ? "inactive" : "active";
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${
        user.status === "active" ? "activated" : "deactivated"
      } successfully`,
      data: user,
    });
  } catch (error) {
    console.error("Toggle user status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating user status",
    });
  }
});

// GET /api/admin/users/:id/orders - Get user orders (Protected)
router.get("/users/:id/orders", auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ customer: req.params.id })
      .populate("restaurant", "name")
      .sort({ orderDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments({ customer: req.params.id });

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user orders",
    });
  }
});

// GET /api/admin/restaurants - Get all restaurants (Protected)
router.get("/restaurants", auth, async (req, res) => {
  try {
    const restaurants = await Restaurant.find()
      .populate("restaurantName", "ownerName email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: restaurants,
    });
  } catch (error) {
    console.error("Get restaurants error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching restaurants",
    });
  }
});

// GET /api/admin/restaurants/:id - Get restaurant by ID (Protected)
router.get("/restaurants/:id", auth, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate(
      "owner",
      "name email phone"
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    console.error("Get restaurant by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching restaurant",
    });
  }
});

// PUT /api/admin/restaurants/:id/toggle-status - Toggle restaurant status (Protected)
router.put("/restaurants/:id/toggle-status",  async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    restaurant.status = restaurant.status === "active" ? "inactive" : "active";
    await restaurant.save();

    res.status(200).json({
      success: true,
      message: `Restaurant ${
        restaurant.status === "active" ? "activated" : "deactivated"
      } successfully`,
      data: restaurant,
    });
  } catch (error) {
    console.error("Toggle restaurant status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating restaurant status",
    });
  }
});

// PUT /api/admin/restaurants/:id/commission - Update restaurant commission (Protected)
router.put("/restaurants/:id/commission", auth, async (req, res) => {
  try {
    const { commission } = req.body;

    if (commission < 0 || commission > 30) {
      return res.status(400).json({
        success: false,
        message: "Commission must be between 0 and 30%",
      });
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { commissionRate: commission },
      { new: true, runValidators: true }
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Commission updated successfully",
      data: restaurant,
    });
  } catch (error) {
    console.error("Update commission error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating commission",
    });
  }
});

// PUT /api/admin/restaurants/:id/payment-method - Update payment method (Protected)
router.put("/restaurants/:id/payment-method", auth, async (req, res) => {
  try {
    const { paymentMethod } = req.body;

    const validMethods = ["razorpay", "stripe", "paypal", "bank"];
    if (!validMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { paymentMethod },
      { new: true }
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment method updated successfully",
      data: restaurant,
    });
  } catch (error) {
    console.error("Update payment method error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating payment method",
    });
  }
});

// POST /api/admin/restaurants - Create new restaurant (Protected)
router.post("/restaurants", auth, async (req, res) => {
  try {
    const {
      name,
      owner,
      email,
      phone,
      address,
      gstin,
      cuisine,
      commissionRate,
      paymentMethod,
    } = req.body;

    // Check if restaurant already exists
    const existingRestaurant = await Restaurant.findOne({
      $or: [{ email }, { gstin }],
    });

    if (existingRestaurant) {
      return res.status(400).json({
        success: false,
        message: "Restaurant with this email or GSTIN already exists",
      });
    }

    // Create new restaurant
    const restaurant = new Restaurant({
      name,
      owner,
      email,
      phone,
      address,
      gstin,
      cuisine: cuisine || [],
      commissionRate: commissionRate || 15,
      paymentMethod: paymentMethod || "razorpay",
      status: "active",
    });

    await restaurant.save();

    // Populate owner data for response
    await restaurant.populate("owner", "name email phone");

    res.status(201).json({
      success: true,
      message: "Restaurant created successfully",
      data: restaurant,
    });
  } catch (error) {
    console.error("Create restaurant error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while creating restaurant",
    });
  }
});

// GET /api/admin - Get all admins (Protected)
router.get("/", auth, async (req, res) => {
  try {
    // Check if user has permission to view admins
    if (!req.admin.hasPermission("user_management")) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions.",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const admins = await Admin.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Admin.countDocuments();

    res.status(200).json({
      success: true,
      data: admins,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get admins error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching admins",
    });
  }
});

// GET /api/admin/profile - Get current admin profile (Protected)
router.get("/profile", auth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
    });
  }
});

// GET /api/admin/stats - Get admin dashboard statistics (Protected)
router.get("/stats", async (req, res) => {
  try {
    const stats = await Admin.getDashboardStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching statistics",
    });
  }
});

// GET /api/admin/:id - Get admin by ID (Protected)
router.get("/:id", auth, async (req, res) => {
  try {
    if (!req.admin.hasPermission("user_management")) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions.",
      });
    }

    const admin = await Admin.findById(req.params.id).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    console.error("Get admin by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching admin",
    });
  }
});

// POST /api/admin/register - Register new admin (Protected - Super Admin only)
router.post("/register", auth, async (req, res) => {
  try {
    // Only super admin can register new admins
    if (req.admin.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only super admin can register new admins.",
      });
    }

    const { name, email, password, phone, role, department, permissions } =
      req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin with this email already exists",
      });
    }

    // Create new admin
    const admin = new Admin({
      name,
      email,
      password,
      phone,
      role: role || "admin",
      department: department || "operations",
      permissions: permissions || {},
      createdBy: req.admin.id,
    });

    await admin.save();

    // Remove password from response
    const adminResponse = admin.toObject();
    delete adminResponse.password;

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      data: adminResponse,
    });
  } catch (error) {
    console.error("Register admin error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while registering admin",
    });
  }
});

// POST /api/admin/login - Admin login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find admin and include password for verification
    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated. Please contact super admin.",
      });
    }

    // Check if account is locked
    if (admin.isLocked()) {
      return res.status(401).json({
        success: false,
        message:
          "Account is temporarily locked due to too many login attempts. Try again later.",
      });
    }

    // Verify password

    // Reset login attempts on successful login
    admin.loginAttempts = 0;
    admin.lockUntil = undefined;
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: admin.role,
      },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    // Remove password from response
    const adminResponse = admin.toObject();
    delete adminResponse.password;

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: adminResponse,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
});

// PUT /api/admin/profile - Update admin profile (Protected)
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, phone, profileImage, department } = req.body;

    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    await admin.updateProfile({ name, phone, profileImage, department });

    const updatedAdmin = await Admin.findById(req.admin.id).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedAdmin,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating profile",
    });
  }
});

// PUT /api/admin/change-password - Change password (Protected)
router.put("/change-password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    const admin = await Admin.findById(req.admin.id).select("+password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    await admin.changePassword(currentPassword, newPassword);

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);

    if (error.message === "Your current password is incorrect.") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while changing password",
    });
  }
});

// PUT /api/admin/:id - Update admin (Protected - Super Admin only)
router.put("/:id", auth, async (req, res) => {
  try {
    if (req.admin.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only super admin can update admins.",
      });
    }

    const { name, phone, role, department, permissions, isActive } = req.body;

    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Update fields
    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (role) updates.role = role;
    if (department) updates.department = department;
    if (permissions) updates.permissions = permissions;
    if (typeof isActive === "boolean") updates.isActive = isActive;

    updates.updatedBy = req.admin.id;

    const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      message: "Admin updated successfully",
      data: updatedAdmin,
    });
  } catch (error) {
    console.error("Update admin error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while updating admin",
    });
  }
});

// DELETE /api/admin/:id - Delete admin (Protected - Super Admin only)
router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.admin.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only super admin can delete admins.",
      });
    }

    // Prevent self-deletion
    if (req.params.id === req.admin.id) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete your own account",
      });
    }

    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    await Admin.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (error) {
    console.error("Delete admin error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting admin",
    });
  }
});

// POST /api/admin/init-super-admin - Initialize super admin (One-time setup)
router.post("/init-super-admin", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if super admin already exists
    const superAdminExists = await Admin.findOne({ role: "super_admin" });
    if (superAdminExists) {
      return res.status(400).json({
        success: false,
        message: "Super admin already exists",
      });
    }

    // Create super admin
    const superAdmin = await Admin.createSuperAdmin({
      name,
      email,
      password,
      phone,
    });

    // Remove password from response
    const adminResponse = superAdmin.toObject();
    delete adminResponse.password;

    res.status(201).json({
      success: true,
      message: "Super admin created successfully",
      data: adminResponse,
    });
  } catch (error) {
    console.error("Init super admin error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating super admin",
    });
  }
});
router.post("/logout", auth, async (req, res) => {
  try {
    // For JWT, logout is typically handled on the client side by deleting the token.
    // Optionally, you can implement token blacklisting on the server side. Here, we'll just respond with a success message.
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({  
      success: false,
      message: "Server error during logout",
    });
  } 
});


module.exports = router;
