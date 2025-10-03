const express = require("express");
const otpModle = require("../models/otp");
const Restaurant = require("../models/restaurant");
const router = express.Router();

const multer = require("multer");
//multer config
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

// // GET all restaurants
router.get("/", async (req, res) => {
  try {
    res.status(200).json({ message: "Get all restaurants" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const verified = await Restaurant.findOne({
    email,
    password,
  });
  if (verified) {
    res.json({ success: true, message: "id verified" });
    return;
  } else {
    res.json({ success: false, message: "Email or password incorrect" });
  }
});
// // GET single restaurant by ID
// router.get('/:id', async (req, res) => {
//   try {
//     res.status(200).json({ message: 'Get restaurant by ID' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// POST create new restaurant
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

// // PUT update restaurant
// router.put('/:id', async (req, res) => {
//   try {
//     res.status(200).json({ message: 'Update restaurant' });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // DELETE restaurant
// router.delete('/:id', async (req, res) => {
//   try {
//     res.status(200).json({ message: 'Delete restaurant' });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

module.exports = router;
