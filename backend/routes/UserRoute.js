const express = require("express");
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

// GET /api/users/:userId - Get user by ID
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select("-__v")
      .populate("currentOrder")
      .populate({
        path: "orderHistory",
        populate: {
          path: "menuItems.menuId",
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
    const { 
      restaurantId, 
      tableNumber, 
      menuItems, 
      totalPrice,
      specialInstructions,
      paymentMethod 
    } = req.body;

    // Validate required fields
    if (!restaurantId || !tableNumber || !menuItems || !totalPrice) {
      return res.status(400).json({
        success: false,
        error: "restaurantId, tableNumber, menuItems, and totalPrice are required",
      });
    }

    // Validate menuItems structure
    if (!Array.isArray(menuItems) || menuItems.length === 0) {
      return res.status(400).json({
        success: false,
        error: "menuItems must be a non-empty array",
      });
    }

    // Validate each menu item has required fields
    for (const item of menuItems) {
      if (!item.name || !item.price || !item.quantity) {
        return res.status(400).json({
          success: false,
          error: "Each menu item must have name, price, and quantity",
        });
      }
    }

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Create new order with direct menu item data
    const newOrder = new Order({
      restaurantId,
      userId: user._id,
      tableNumber,
      menuItems: menuItems.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        notes: item.notes || "",
        menuId: item.menuId // Optional: keep reference if available
      })),
      totalPrice,
      specialInstructions: specialInstructions || "",
      paymentMethod: paymentMethod || "counter",
      status: "pending"
    });

    const savedOrder = await newOrder.save();

    // Add to user's order history
    user.orderHistory.push(savedOrder._id);
    user.currentOrder = savedOrder._id;
    await user.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: savedOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        error: "Invalid user ID or restaurant ID format",
      });
    }
    res.status(500).json({
      success: false,
      error: "Server error while creating order",
    });
  }
});

// GET /api/users/:userId/orders - Get user's order history (FIXED VERSION)
router.get("/:userId/orders", async (req, res) => {
  try {
    const { userId } = req.params;
    const { 
      status, 
      page = 1, 
      limit = 20,
      startDate,
      endDate 
    } = req.query;

    // Validate user ID
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "User ID is required"
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    // Build query - simplified since we now have direct data
    let query = { userId: userId };

    // Add status filter if provided
    if (status && status !== 'all') {
      query.status = status;
    }

    // Add date range filter if provided
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get orders - no need to populate menuItems.menuId anymore!
    const orders = await Order.find(query)
      .populate("restaurantId", "restaurantName address phoneNumber")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const totalOrders = await Order.countDocuments(query);

    // Format the orders for frontend - much simpler now!
    const formattedOrders = orders.map(order => ({
      _id: order._id,
      status: order.status,
      totalPrice: order.totalPrice,
      tableNumber: order.tableNumber,
      specialInstructions: order.specialInstructions,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.isPaid ? "paid" : "pending",
      menuItems: order.menuItems.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        notes: item.notes
        // No need for menuId population anymore!
      })),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      restaurant: order.restaurantId ? {
        _id: order.restaurantId._id,
        name: order.restaurantId.restaurantName,
        address: order.restaurantId.address,
        phone: order.restaurantId.phoneNumber
      } : null
    }));

    res.json({
      success: true,
      data: formattedOrders,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalOrders / limitNum),
        totalOrders,
        hasNext: pageNum < Math.ceil(totalOrders / limitNum),
        hasPrev: pageNum > 1
      },
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone
      }
    });

  } catch (error) {
    console.error("Error fetching user orders:", error);
    
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        error: "Invalid user ID format"
      });
    }

    res.status(500).json({
      success: false,
      error: "Server error while fetching user orders"
    });
  }
});

// Alternative route using session (for logged-in users)
router.get("/orders/my-orders", async (req, res) => {
  try {
    // Check if user is authenticated via session
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        error: "User not authenticated"
      });
    }

    const userId = req.session.user.id;
    const { status, page = 1, limit = 20 } = req.query;

    // Build query
    let query = { 
      $or: [
        { userId: userId },
        { customerPhone: req.session.user.phone }
      ]
    };

    if (status && status !== 'all') {
      query.status = status;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const orders = await Order.find(query)
      .populate("restaurantId", "restaurantName address phoneNumber")
      .populate("menuItems.menuId", "name price category isVegetarian")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalOrders = await Order.countDocuments(query);

    const formattedOrders = orders.map(order => ({
      _id: order._id,
      orderNumber: order.orderNumber,
      status: order.status,
      totalPrice: order.totalPrice,
      total: order.total,
      tableNumber: order.tableNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      specialInstructions: order.specialInstructions,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      menuItems: order.menuItems.map(item => ({
        menuId: item.menuId?._id,
        name: item.menuId?.name || "Unknown Item",
        price: item.menuId?.price || 0,
        quantity: item.quantity,
        notes: item.notes
      })),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      estimatedPreparationTime: order.estimatedPreparationTime,
      completedAt: order.completedAt,
      cancelledAt: order.cancelledAt,
      restaurant: order.restaurantId ? {
        name: order.restaurantId.restaurantName,
        address: order.restaurantId.address,
        phone: order.restaurantId.phoneNumber
      } : null
    }));

    res.json({
      success: true,
      data: formattedOrders,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalOrders / limitNum),
        totalOrders,
        hasNext: pageNum < Math.ceil(totalOrders / limitNum),
        hasPrev: pageNum > 1
      }
    });

  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({
      success: false,
      error: "Server error while fetching user orders"
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