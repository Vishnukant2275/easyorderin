const express = require("express");
const otpModle = require("../models/otp");
const Restaurant = require("../models/restaurant");
const Tables = require("../models/Tables");
const Menu = require("../models/Menu");
const Order = require("../models/Order");
const router = express.Router();

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

const { sendRestaurantOtp } = require("../mail/RestaurantMail");
const restaurant = require("../models/restaurant");

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

    // ⚠️ match the field name in your DB (restaurantId)
    const orders = await Order.find({
      restaurantId: restaurantID,
    }).sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res
      .status(500)
      .json({ success: false, error: "Server error fetching orders" });
  }
});

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

    // 2️⃣ Check if tables record exists for this restaurant
    const tablesData = await Tables.findOne({ restaurantId: restaurantID });
    if (!tablesData) {
      return res.status(404).json({
        success: false,
        message: "No tables found for this restaurant",
      });
    }

    // 3️⃣ Find the specific table
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

    // 4️⃣ Check table availability
    if (table.status !== "available") {
      return res.status(403).json({
        success: false,
        message: "This table is currently occupied. Please try another table.",
      });
    }

    // 5️⃣ Fetch menu for this restaurant
    const menu = await Menu.findOne({ restaurant: restaurantID });
    if (!menu || menu.items.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Menu not found for this restaurant",
      });
    }

    // ✅ Success: return restaurant and menu
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
      menu: menu.items.filter((item) => item.isAvailable), // only available items
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
        // Add other fields you need for the header
        address: restaurant.address,
        phone: restaurant.phone,
        logo: restaurant.logo,
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
      req.session.restaurant = {
        id: verified._id,
        email: verified.email,
        name: verified.restaurantName,
      };

      res.json({
        success: true,
        message: "ID verified",
        restaurant: req.session.restaurant,
      });
    } else {
      res.json({ success: false, message: "Email or password incorrect" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

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

    if (!name || !price || !foodCategory) {
      return res.status(400).json({ msg: "Required fields are missing" });
    }

    let menu = await Menu.findOne({ restaurant: restaurantId });

    if (!menu) {
      // Create empty menu if not exist
      menu = new Menu({ restaurant: restaurantId, items: [] });
    }

    for (let i = 0; i < (Array.isArray(name) ? name.length : 1); i++) {
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
          : keyIngredients,
        isAvailable: Array.isArray(isAvailable) ? isAvailable[i] : isAvailable,
        image: images[i] ? images[i].filename : null,
      });
    }

    await menu.save(); // Save once after all items are added

    res.json({ msg: "Menu items uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
//placing orders
router.post(
  "/:restaurantID/table/:tableNumber/placeOrder",
  async (req, res) => {
    try {
      const { restaurantID, tableNumber } = req.params;
      const { menuItems } = req.body; // array of { menuId, quantity, notes }
      const userId = req.session?.user?.id;
      // 1️⃣ Validate restaurant
      const restaurant = await Restaurant.findById(restaurantID);
      if (!restaurant) {
        return res.status(404).json({
          success: false,
          message: "Restaurant not found",
        });
      }

      // 2️⃣ Validate tables record
      const tablesData = await Tables.findOne({ restaurantId: restaurantID });
      if (!tablesData) {
        return res.status(404).json({
          success: false,
          message: "No tables found for this restaurant",
        });
      }

      // 3️⃣ Check if the table exists
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

      // 4️⃣ Validate and fetch menu data
      const menu = await Menu.findOne({ restaurant: restaurantID });
      if (!menu) {
        return res.status(404).json({
          success: false,
          message: "Menu not found for this restaurant",
        });
      }

      // 5️⃣ Validate each item and calculate total price
      let totalPrice = 0;
      const validatedItems = [];

      for (const item of menuItems) {
        const menuItem = menu.items.id(item.menuId); // find subdocument by _id
        if (!menuItem || !menuItem.isAvailable) {
          return res.status(400).json({
            success: false,
            message: `Menu item with ID ${item.menuId} not found or unavailable.`,
          });
        }

        const quantity = item.quantity || 1;
        totalPrice += menuItem.price * quantity;

        validatedItems.push({
          menuId: item.menuId,
          quantity,
          notes: item.notes || "",
        });
      }

      // 6️⃣ Create new order
      const newOrder = await Order.create({
        restaurantId: restaurantID,
        menuItems: validatedItems,
        tableNumber: tableNumber,
        userId,
        totalPrice,
        status: "pending",
      });

      // 7️⃣ Update table (mark occupied and link currentOrder)

      table.currentOrder = newOrder._id;
      await tablesData.save();

      // ✅ 8️⃣ Respond success
      return res.status(201).json({
        success: true,
        message: "Order placed successfully",
        order: newOrder,
        table: {
          tableNumber: table.tableNumber,
          status: table.status,
        },
      });
    } catch (error) {
      console.error("Error placing order:", error);
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

module.exports = router;
