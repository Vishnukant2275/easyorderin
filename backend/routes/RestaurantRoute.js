const express = require("express");
const otpModle = require("../models/otp");
const Restaurant = require("../models/restaurant");
const Tables = require("../models/Tables");
const Menu = require("../models/Menu");
const Order = require("../models/Order");
const User = require("../models/User");
const Payment = require("../models/Payment");
const router = express.Router();
const sharp = require("sharp");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const { sendRestaurantOtp } = require("../mail/RestaurantMail");
const restaurant = require("../models/restaurant");


// Place this BEFORE any :id parameter routes
router.get("/status/current", async (req, res) => {
  try {
    if (!req.session.restaurantId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated"
      });
    }

    const restaurant = await Restaurant.findById(req.session.restaurantId);
    
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found"
      });
    }

    res.json({
      success: true,
      status: restaurant.status,
      message: restaurant.status !== "active" 
        ? "This restaurant is currently inactive. Please contact support to activate your account."
        : "Restaurant is active"
    });

  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({
      success: false,
      message: "Server error while checking status"
    });
  }
});

router.get("/check-status", async (req, res) => {
  try {
    // Check if restaurant is authenticated via session
    if (!req.session.restaurantId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    // Get fresh data from database
    const restaurant = await Restaurant.findById(req.session.restaurantId);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    // Return current status
    res.json({
      success: true,
      status: restaurant.status,
      message:
        restaurant.status !== "active"
          ? "This restaurant is currently inactive. Please contact support to activate your account."
          : "Restaurant is active",
      restaurant: {
        name: restaurant.restaurantName,
        email: restaurant.email,
        status: restaurant.status,
      },
    });
  } catch (error) {
    console.error("Status check error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while checking status",
    });
  }
});
//send otp
router.get("/send-otp", async (req, res) => {
  const email = req.query.email;
  const checkexistingrestaurant = await Restaurant.findOne({ email });
  if (checkexistingrestaurant) {
    res.json({
      success: false,
      message: "This email is already registered with us please Log in",
    });
    return;
  }
  sendRestaurantOtp(email);
  res.json({ success: true, message: "OTP sent" });
});
//verify otp
router.get("/verify-otp", async (req, res) => {
  const { email, otp } = req.query;

  try {
    const doc = await otpModle.findOne({ email: email });

    if (!doc || doc.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // Optionally, delete the OTP after verification
    await otpModle.deleteOne({ email: email });

    return res.status(200).json({ success: true, message: "OTP verified" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    res.status(200).json({ message: "Get all restaurants" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

require("dotenv").config();
router.get("/me", async (req, res) => {
  try {
    const restaurantId = req.session?.restaurant?.id;

    // Fetch restaurant by ID
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    }

    res.status(200).json({ success: true, restaurant });
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
router.get("/get-paymentqr", async (req, res) => {
  try {
    const restaurantId = req.session?.restaurantId;

    if (!restaurantId) {
      return res.status(401).json({ error: "Unauthorized. Please log in." });
    }

    const payment = await Payment.findOne({ restaurantId });

    if (!payment) return res.status(404).json({ error: "No QR codes found" });

    const formatted = payment.qrCodes.map((qr) => ({
      _id: qr._id, // ✅ include this line
      paymentMethod: qr.paymentMethod,
      upiId: qr.upiId,
      note: qr.note,
      imageBase64: `data:${
        qr.qrImage.contentType
      };base64,${qr.qrImage.data.toString("base64")}`,
    }));

    res.json({ success: true, qrCodes: formatted });
  } catch (err) {
    console.error("Error fetching QR codes:", err);
    res.status(500).json({ error: "Failed to fetch QR codes" });
  }
});
// User route to get payment QR codes by restaurant ID
router.get("/:restaurantId/payment-qrcodes", async (req, res) => {
  try {
    const { restaurantId } = req.params;

    if (!restaurantId) {
      return res.status(400).json({ error: "Restaurant ID is required" });
    }

    // Validate if restaurantId is a valid ObjectId

    const payment = await Payment.findOne({ restaurantId });

    if (!payment || !payment.qrCodes || payment.qrCodes.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No QR codes found for this restaurant",
      });
    }

    const formatted = payment.qrCodes.map((qr) => ({
      _id: qr._id,
      paymentMethod: qr.paymentMethod,
      upiId: qr.upiId,
      note: qr.note,
      imageBase64: `data:${
        qr.qrImage.contentType
      };base64,${qr.qrImage.data.toString("base64")}`,
      createdAt: qr.createdAt,
    }));

    res.json({
      success: true,
      qrCodes: formatted,
      count: formatted.length,
    });
  } catch (err) {
    console.error("Error fetching QR codes for restaurant:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch QR codes",
    });
  }
});
router.get("/menu", async (req, res) => {
  try {
    const restaurantId = req.session?.restaurant?.id;

    if (!restaurantId) {
      return res.status(401).json({ message: "Restaurant not logged in" });
    }

    const menu = await Menu.find({ restaurant: restaurantId }); // find all menus instead of one
    if (!menu || menu.length === 0) {
      return res.status(404).json({ message: "No menu found" });
    }

    res.json(menu);
  } catch (err) {
    console.error("Error fetching menu:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/tables", async (req, res) => {
  try {
    const restaurantId = req.session?.restaurant?.id;
    if (!restaurantId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized" });
    }

    // Fetch all tables for this restaurant
    const tables = await Tables.find({ restaurantId }).sort({ tableNumber: 1 });

    res.status(200).json(tables);
  } catch (err) {
    console.error("Error fetching tables:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
router.get("/orders", async (req, res) => {
  try {
    const restaurantID = req.session.restaurant?.id;
    if (!restaurantID) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Restaurant not logged in" });
    }

    // Get today's date at start of day (00:00:00)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get tomorrow's date at start of day (00:00:00)
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // ⚠️ match the field name in your DB (restaurantId)
    const orders = await Order.find({
      restaurantId: restaurantID,
      createdAt: {
        $gte: today, // Greater than or equal to today 00:00:00
        $lt: tomorrow, // Less than tomorrow 00:00:00
      },
    })
      .populate("userId", "name phone")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
      dateRange: {
        today: today.toISOString(),
        tomorrow: tomorrow.toISOString(),
      },
      count: orders.length,
    });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res
      .status(500)
      .json({ success: false, error: "Server error fetching orders" });
  }
});
router.get("/orders/all", async (req, res) => {
  try {
    const restaurantID = req.session.restaurant?.id;
    if (!restaurantID) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Restaurant not logged in" });
    }

    // ⚠️ match the field name in your DB (restaurantId)
    const orders = await Order.find({
      restaurantId: restaurantID,
    })
      .populate("userId", "name phone")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res
      .status(500)
      .json({ success: false, error: "Server error fetching orders" });
  }
});
router.post("/order/update", async (req, res) => {
  try {
    const { orderId, status } = req.body;

    // Validate required fields
    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message: "Order ID and status are required",
      });
    }

    // Validate status value
    const validStatuses = ["pending", "preparing", "served", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Must be one of: pending, preparing, served, cancelled",
      });
    }

    // Find and update the order
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        status: status,
        // Update the updatedAt timestamp automatically due to timestamps: true
      },
      { new: true } // Return the updated document
    ).populate("userId", "name phone");

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // If order is being served, update the table status
    if (status === "served") {
      await Tables.findOneAndUpdate(
        {
          restaurantId: updatedOrder.restaurantId,
          "tables.tableNumber": updatedOrder.tableNumber,
        },
        {
          $set: {
            "tables.$.status": "available",
            "tables.$.currentOrder": null,
          },
        }
      );
    }

    // If order is cancelled, also free up the table
    if (status === "cancelled") {
      await Tables.findOneAndUpdate(
        {
          restaurantId: updatedOrder.restaurantId,
          "tables.tableNumber": updatedOrder.tableNumber,
        },
        {
          $set: {
            "tables.$.status": "available",
            "tables.$.currentOrder": null,
          },
        }
      );
    }

    return res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order: {
        ...updatedOrder.toObject(),
        formattedOrderNumber: `ORD-${updatedOrder.orderNumber
          ?.toString()
          .padStart(3, "0")}`,
      },
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});
// ✅ Get menu and table status
router.get("/:restaurantID/table/:tableNumber/getMenu", async (req, res) => {
  try {
    const { restaurantID, tableNumber } = req.params;

    // 1️⃣ Check if restaurant exists
    const restaurant = await Restaurant.findById(restaurantID);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    if (restaurant.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "This restaurant is currently inactive",
      });
    }

    // 2️⃣ Find tables data for restaurant
    const tablesData = await Tables.findOne({ restaurantId: restaurantID });
    if (!tablesData) {
      return res.status(404).json({
        success: false,
        message: "No tables found for this restaurant",
      });
    }

    // 3️⃣ Locate specific table
    const table = tablesData.tables.find(
      (t) => t.tableNumber === parseInt(tableNumber)
    );
    if (!table) {
      return res.status(404).json({
        success: false,
        message: `Table number ${tableNumber} not found`,
      });
    }

    if (!table.isActive) {
      return res.status(403).json({
        success: false,
        message: "This table is currently inactive",
      });
    }

    if (table.status !== "available") {
      return res.status(403).json({
        success: false,
        message: "This table is currently occupied. Please try another table.",
      });
    }

    // 4️⃣ Fetch menu
    const menu = await Menu.findOne({ restaurant: restaurantID });
    if (!menu || menu.items.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Menu not found for this restaurant",
      });
    }

    // ✅ Sanitize and send menu without binary data
    const safeMenu = menu.items
      .filter((item) => item.isAvailable)
      .map((item) => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        description: item.description,
        foodCategory: item.foodCategory,
        isVegetarian: item.isVegetarian,
        keyIngredients: item.keyIngredients,
        isAvailable: item.isAvailable,
        // ✅ Corrected image URL route
        imageUrl: `/api/restaurant/image/${item._id}`,
      }));

    return res.status(200).json({
      success: true,
      message: "Table available. Menu fetched successfully.",
      restaurant: {
        id: restaurant._id,
        name: restaurant.restaurantName,
        type: restaurant.restaurantType,
      },
      table: {
        tableNumber: table.tableNumber,
        status: table.status,
      },
      menu: safeMenu,
    });
  } catch (error) {
    console.error("Error fetching menu:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});
// 🖼️ Serve image for a specific menu item
router.get("/image/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;

    const menu = await Menu.findOne({ "items._id": itemId });
    if (!menu) return res.status(404).send("Menu not found");

    const item = menu.items.id(itemId);
    if (!item || !item.image?.data)
      return res.status(404).send("Image not found");

    res.set("Content-Type", item.image.contentType);
    return res.send(item.image.data);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).send("Error fetching image");
  }
});

router.get("/:restaurantId", async (req, res) => {
  try {
    const { restaurantId } = req.params;

    // Validate restaurantId
    if (!restaurantId) {
      return res.status(400).json({
        success: false,
        message: "Restaurant ID is required",
      });
    }

    // Fetch restaurant by ID
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    // Return restaurant data (you might want to select specific fields)
    res.status(200).json({
      success: true,
      restaurant: {
        id: restaurant._id,
        restaurantName: restaurant.restaurantName,
        restaurantType: restaurant.restaurantType,
        address: restaurant.address,
        phone: restaurant.phone,
        logo: restaurant.logo,
        GST: restaurant.GST,
        // Include any other fields you want to expose
      },
    });
  } catch (error) {
    console.error("Error fetching restaurant:", error);

    // Handle CastError (invalid ObjectId format)
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid restaurant ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const verified = await Restaurant.findOne({ email, password });

    if (verified) {
      // Store both restaurant info and id in session
      req.session.restaurant = {
        id: verified._id,
        email: verified.email,
        name: verified.restaurantName,
        status: verified.status, // Include status in session
      };

      // ✅ Also store restaurantId separately for easy access
      req.session.restaurantId = verified._id;

      // Return success but include status information
      res.json({
        success: true,
        message:
          verified.status === "active"
            ? "Login successful"
            : "Login successful - Account is currently inactive",
        restaurant: req.session.restaurant,
        status: verified.status,
        inactive: verified.status !== "active", // Flag to indicate inactive status
      });
    } else {
      res.json({ success: false, message: "Email or password incorrect" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
// routes/restaurant.js - Add this endpoint

router.post("/logout", (req, res) => {
  // Destroy session
  req.session.destroy((err) => {
    if (err) {
      console.error("Error while logging out:", err);
      return res.status(500).json({ success: false, message: "Logout failed" });
    }

    // Clear session cookie
    res.clearCookie("connect.sid"); // "connect.sid" is default cookie name
    res.json({ success: true, message: "Logged out successfully" });
  });
});

router.post("/upload/menu", upload.array("image"), async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      isVegetarian,
      foodCategory,
      keyIngredients,
      isAvailable,
    } = req.body;

    const images = req.files || [];
    const restaurantId = req.session?.restaurant?.id;
    const restaurant = Restaurant.findById(restaurantId);
    if (restaurant.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "This restaurant is currently inactive",
      });
    }
    if (!restaurantId) {
      return res.status(400).json({ msg: "Restaurant session missing" });
    }

    if (!name || !price || !foodCategory) {
      return res.status(400).json({ msg: "Required fields are missing" });
    }

    // Find or create a Menu for the restaurant
    let menu = await Menu.findOne({ restaurant: restaurantId });
    if (!menu) {
      menu = new Menu({ restaurant: restaurantId, items: [] });
    }

    const count = Array.isArray(name) ? name.length : 1;

    for (let i = 0; i < count; i++) {
      let compressedImage = null;

      // Compress image if present
      if (images[i]) {
        const buffer = await sharp(images[i].buffer)
          .resize({ width: 800 }) // Resize to 800px width (keep aspect ratio)
          .jpeg({ quality: 60 }) // Reduce quality to 60%
          .toBuffer();

        compressedImage = {
          data: buffer,
          contentType: "image/jpeg",
        };
      }

      menu.items.push({
        name: Array.isArray(name) ? name[i] : name,
        description: Array.isArray(description) ? description[i] : description,
        price: Array.isArray(price) ? price[i] : price,
        isVegetarian: Array.isArray(isVegetarian)
          ? isVegetarian[i]
          : isVegetarian,
        foodCategory: Array.isArray(foodCategory)
          ? foodCategory[i]
          : foodCategory,
        keyIngredients: Array.isArray(keyIngredients)
          ? keyIngredients[i]
          : keyIngredients
          ? [keyIngredients]
          : [],
        isAvailable: Array.isArray(isAvailable) ? isAvailable[i] : isAvailable,
        image: compressedImage,
      });
    }

    await menu.save();
    res.json({ msg: "Menu items uploaded successfully" });
  } catch (error) {
    console.error("Menu upload error:", error);
    res.status(500).json({ error: error.message });
  }
});
//payment qr code upload

router.post(
  "/upload-paymentqr",
  upload.array("files", 10),
  async (req, res) => {
    try {
      const { paymentMethod, upiId, note } = req.body;
      const restaurantId = req.session?.restaurantId;

      if (!restaurantId) {
        return res.status(400).json({ error: "restaurantId is required" });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No QR images uploaded" });
      }

      // Process & compress uploaded images
      const qrCodes = await Promise.all(
        req.files.map(async (file, index) => {
          // 🪄 Compress + resize (QRs don’t need to be large)
          const optimizedBuffer = await sharp(file.buffer)
            .resize(400, 400, { fit: "inside", withoutEnlargement: true }) // max 400x400px
            .toFormat("jpeg", { quality: 70 }) // compress to JPEG @ 70% quality
            .toBuffer();

          return {
            paymentMethod: Array.isArray(paymentMethod)
              ? paymentMethod[index]
              : paymentMethod,
            qrImage: {
              data: optimizedBuffer, // compressed binary
              contentType: "image/jpeg",
            },
            upiId: Array.isArray(upiId) ? upiId[index] : upiId,
            note: Array.isArray(note) ? note[index] : note,
          };
        })
      );

      // ✅ Insert or update restaurant record efficiently
      const paymentRecord = await Payment.findOneAndUpdate(
        { restaurantId },
        { $push: { qrCodes: { $each: qrCodes } } },
        { new: true, upsert: true }
      );

      res.status(200).json({
        message: "QR codes uploaded, optimized, and stored successfully",
        paymentRecord,
      });
    } catch (err) {
      console.error("Error while saving QR codes:", err);
      res.status(500).json({ error: "Server error while saving QR codes" });
    }
  }
);

//deleting payment qr code
router.delete("/delete-paymentqr/:qrId", async (req, res) => {
  try {
    const restaurantId = req.session?.restaurantId;
    const { qrId } = req.params;

    if (!restaurantId) {
      return res.status(401).json({ error: "Unauthorized. Please log in." });
    }

    if (!qrId) {
      return res.status(400).json({ error: "QR ID is required" });
    }

    // Pull the QR from the qrCodes array
    const result = await Payment.findOneAndUpdate(
      { restaurantId },
      { $pull: { qrCodes: { _id: qrId } } },
      { new: true }
    );

    if (!result) {
      return res
        .status(404)
        .json({ error: "QR code not found or already deleted" });
    }

    res.json({
      success: true,
      message: "QR code deleted successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error deleting QR code:", err);
    res.status(500).json({ error: "Server error while deleting QR code" });
  }
});
// ✅ Place order for a specific restaurant and table
router.post(
  "/:restaurantID/table/:tableNumber/placeOrder",
  async (req, res) => {
    try {
      const { restaurantID, tableNumber } = req.params;
      const { menuItems, name, phone, specialInstructions, paymentMethod } =
        req.body;

      // 1️⃣ Validate required fields
      if (!name || !phone) {
        return res.status(400).json({
          success: false,
          message: "Name and phone are required fields",
        });
      }

      if (!menuItems || !Array.isArray(menuItems) || menuItems.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Menu items are required and should be a non-empty array",
        });
      }

      // 2️⃣ Validate restaurant
      const restaurant = await Restaurant.findById(restaurantID);
      if (!restaurant) {
        return res.status(404).json({
          success: false,
          message: "Restaurant not found",
        });
      }

      // 3️⃣ Validate tables record
      const tablesData = await Tables.findOne({ restaurantId: restaurantID });
      if (!tablesData) {
        return res.status(404).json({
          success: false,
          message: "No tables found for this restaurant",
        });
      }

      // 4️⃣ Check if the table exists
      const table = tablesData.tables.find(
        (t) => t.tableNumber === parseInt(tableNumber)
      );

      if (!table) {
        return res.status(404).json({
          success: false,
          message: `Table number ${tableNumber} not found`,
        });
      }

      if (!table.isActive) {
        return res.status(403).json({
          success: false,
          message: "This table is currently inactive",
        });
      }

      if (table.status !== "available") {
        return res.status(403).json({
          success: false,
          message: "This table is currently occupied. Cannot place new order.",
        });
      }

      // 5️⃣ Validate and fetch menu data
      const menu = await Menu.findOne({ restaurant: restaurantID });
      if (!menu) {
        return res.status(404).json({
          success: false,
          message: "Menu not found for this restaurant",
        });
      }

      // 6️⃣ Validate each item and calculate total price
      let totalPrice = 0;
      const validatedItems = [];

      for (const item of menuItems) {
        const menuItem = menu.items.id(item.menuId);
        if (!menuItem || !menuItem.isAvailable) {
          return res.status(400).json({
            success: false,
            message: `Menu item with ID ${item.menuId} not found or unavailable.`,
          });
        }

        const quantity = item.quantity || 1;
        totalPrice += menuItem.price * quantity;

        validatedItems.push({
          name: menuItem.name,
          price: menuItem.price,
          quantity,
          notes: item.notes || "",
          menuId: item.menuId,
        });
      }

      // 7️⃣ Find or create user
      let user;
      const existingUser = await User.findOne({ phone });
      if (existingUser) {
        // Override the existing user's name
        existingUser.name = name.trim();
        existingUser.status = "active";
        await existingUser.save();

        user = existingUser;
        console.log(`Updated existing user: ${user.name} (${user.phone})`);
      } else {
        // Create new user
        try {
          user = new User({
            name: name.trim(),
            phone: phone.trim(),
          });
          await user.save();
          console.log(`Created new user: ${user.name} (${user.phone})`);
        } catch (userError) {
          if (userError.code === 11000) {
            return res.status(409).json({
              success: false,
              message: "Phone number already registered with another user",
            });
          }
          throw userError;
        }
      }

      // 8️⃣ Create new order
      const newOrder = await Order.create({
        restaurantId: restaurantID,
        menuItems: validatedItems,
        tableNumber: parseInt(tableNumber),
        userId: user._id,
        customerName: user.name,
        customerPhone: user.phone,
        totalPrice,
        specialInstructions: specialInstructions || "",
        paymentMethod: paymentMethod || "counter",
        status: "pending",
      });

      // 9️⃣ Update user's order history
      await User.findByIdAndUpdate(user._id, {
        $push: { orderHistory: newOrder._id },
      });
      // 1️⃣1️⃣ Create session for the user (auto-login after order placement)
      req.session.user = {
        id: user._id.toString(),
        phone: user.phone,
        name: user.name,
        email: user.email || "",
        createdAt: new Date(),
      };

      // Save session explicitly
      await new Promise((resolve, reject) => {
        req.session.save((err) => {
          if (err) {
            console.error("Error saving session:", err);
            reject(err);
          } else {
            console.log("Session created for user:", req.session.user);
            resolve();
          }
        });
      });

      // ✅ Respond success
      return res.status(201).json({
        success: true,
        message: "Order placed successfully",
        order: {
          _id: newOrder._id,
          restaurantId: newOrder.restaurantId,
          tableNumber: newOrder.tableNumber,
          customerName: newOrder.customerName,
          customerPhone: newOrder.customerPhone,
          menuItems: newOrder.menuItems,
          totalPrice: newOrder.totalPrice,
          specialInstructions: newOrder.specialInstructions,
          paymentMethod: newOrder.paymentMethod,
          status: newOrder.status,
          createdAt: newOrder.createdAt,
        },
        user: {
          _id: user._id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          isNew: !existingUser, // Indicate if user was newly created
        },
        table: {
          tableNumber: table.tableNumber,
          status: table.status,
        },
        sessionCreated: true, // Indicate that session was created
      });
    } catch (error) {
      console.error("Error in place order:", error);

      if (error.name === "ValidationError") {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          error: error.message,
        });
      }

      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: "Duplicate phone number detected",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
);
router.post("/register", upload.single("logoImage"), async (req, res) => {
  try {
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    const {
      restaurantName,
      ownerName,
      email,
      password,
      contactNumber,
      address,
      city,
      state,
      pinCode,
      restaurantType,
      seatingCapacity,
    } = req.body;

    const logoImagePath = req.file ? req.file.filename : null;

    // Check existing
    const existingRestaurant = await Restaurant.findOne({ email });
    if (existingRestaurant) {
      return res.status(400).json({
        success: false,
        message: "Restaurant with this email already exists",
      });
    }

    // Hash password

    // Create new restaurant
    const newRestaurant = new Restaurant({
      restaurantName,
      ownerName,
      email,
      password,
      contactNumber,
      address,
      city,
      state,
      pinCode,
      restaurantType,
      logoImage: logoImagePath,
      seatingCapacity: Number(seatingCapacity),
    });

    await newRestaurant.save();

    res
      .status(201)
      .json({ success: true, message: "Restaurant created successfully" });
  } catch (error) {
    console.error("Registration Error:", error);
    if (error.name === "ValidationError") {
      // Mongoose validation error
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/create-tables", async (req, res) => {
  try {
    const { numberOfTables } = req.body;
    const restaurantId = req.session?.restaurant?.id;

    if (!restaurantId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!numberOfTables || numberOfTables < 1) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid number of tables" });
    }

    // Check if tables document already exists for this restaurant
    let tablesDoc = await Tables.findOne({ restaurantId });

    if (!tablesDoc) {
      // No tables exist yet → create new document
      const tablesArray = [];
      for (let i = 1; i <= numberOfTables; i++) {
        tablesArray.push({ tableNumber: i });
      }

      tablesDoc = new Tables({
        restaurantId,
        tables: tablesArray,
      });

      await tablesDoc.save();

      return res.status(201).json({
        success: true,
        message: "Tables created successfully",
        tables: tablesDoc,
      });
    } else {
      // Tables already exist → append new tables serially
      const existingCount = tablesDoc.tables.length;
      const newTables = [];

      for (let i = 1; i <= numberOfTables; i++) {
        newTables.push({ tableNumber: existingCount + i });
      }

      tablesDoc.tables.push(...newTables);
      await tablesDoc.save();

      return res.status(200).json({
        success: true,
        message: "New tables added successfully",
        tables: tablesDoc,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
});

router.put("/menu/:itemId", async (req, res) => {
  try {
    const restaurantId = req.session?.restaurant?.id;
    const { itemId } = req.params;
    const updateData = req.body;

    const menu = await Menu.findOne({ restaurant: restaurantId });
    if (!menu) return res.status(404).json({ msg: "Menu not found" });

    const item = menu.items.id(itemId);
    if (!item) return res.status(404).json({ msg: "Menu item not found" });

    Object.assign(item, updateData);
    await menu.save();

    res.json({ msg: "Menu item updated successfully", item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.delete("/menu/:itemId", async (req, res) => {
  try {
    const restaurantId = req.session?.restaurant?.id;
    const { itemId } = req.params;

    const menu = await Menu.findOne({ restaurant: restaurantId });
    if (!menu) return res.status(404).json({ msg: "Menu not found" });

    const item = menu.items.id(itemId);
    if (!item) return res.status(404).json({ msg: "Menu item not found" });

    item.deleteOne(); // remove item from subdocument array
    await menu.save();

    res.json({ msg: "Menu item deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.patch("/menu/:itemId/toggle", async (req, res) => {
  try {
    const restaurantId = req.session?.restaurant?.id;
    const { itemId } = req.params;

    const menu = await Menu.findOne({ restaurant: restaurantId });
    if (!menu) return res.status(404).json({ msg: "Menu not found" });

    const item = menu.items.id(itemId);
    if (!item) return res.status(404).json({ msg: "Menu item not found" });

    item.isAvailable = !item.isAvailable; // toggle availability
    await menu.save();

    res.json({
      msg: `Menu item is now ${item.isAvailable ? "available" : "unavailable"}`,
      item,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
// In your orders routes (backend)
router.patch("/:orderId/payment", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { isPaid } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { isPaid: isPaid },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    res.json({
      success: true,
      message: `Payment status updated to ${isPaid ? "paid" : "not paid"}`,
      data: order,
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({
      success: false,
      error: "Server error while updating payment status",
    });
  }
});
module.exports = router;
