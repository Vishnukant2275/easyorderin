const express = require("express");
const Restaurant = require("../models/restaurant");
const Tables = require("../models/Tables");
const Menu = require("../models/Menu");
const Order = require("../models/Order");
const User = require("../models/User");
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

// In-memory OTP store (use Redis in production)
const otpStore = {};

// Clean expired OTPs every hour
setInterval(() => {
  const now = Date.now();
  for (const phone in otpStore) {
    if (otpStore[phone].expiresAt < now) {
      delete otpStore[phone];
    }
  }
}, 60 * 60 * 1000);

// Send OTP endpoint
router.post("/send-otp", async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    // Validate phone number format
    if (!phone.match(/^[6-9]\d{9}$/)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit phone number",
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with expiration and attempts
    otpStore[phone] = {
      otp: otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      attempts: 0,
      createdAt: Date.now()
    };

    // In production, integrate with SMS service here
    console.log(`OTP for ${phone}: ${otp}`);

    res.json({
      success: true,
      message: "OTP sent successfully",
      debugOtp: process.env.NODE_ENV === 'development' ? otp : undefined, // Only show in development
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
});

// Verify OTP endpoint
router.post("/verify-otp", async (req, res) => {
  try {
    const { phone,name, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone number and OTP are required",
      });
    }

    // Validate OTP format
    if (!otp.match(/^\d{6}$/)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 6-digit OTP",
      });
    }

    const storedOtp = otpStore[phone];

    if (!storedOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or expired. Please request a new OTP.",
      });
    }

    if (Date.now() > storedOtp.expiresAt) {
      delete otpStore[phone];
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    if (storedOtp.otp !== otp) {
      storedOtp.attempts += 1;
      
      if (storedOtp.attempts >= 3) {
        delete otpStore[phone];
        return res.status(400).json({
          success: false,
          message: "Too many failed attempts. Please request a new OTP.",
        });
      }

      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
        attemptsLeft: 3 - storedOtp.attempts,
      });
    }

    // OTP is valid - find or create user
    let user = await User.findOne({ phone });

if (!user) {
  // Create new user if not found
  user = new User({
    phone,
    name: name || `Customer${phone.slice(-4)}`,
  });
  await user.save();
} else {
  // Update existing user's name with the name from frontend
  if (name && name.trim() !== '') {
    user.name = name.trim();
    await user.save();
  }
}

    // Create session with user data
    req.session.user = {
      id: user._id.toString(),
      phone: user.phone,
      name: user.name,
      email: user.email,
      createdAt: new Date()
    };

    // Save session explicitly (though express-session auto-saves on response end)
    await new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    console.log("Session created for user:", req.session.user);
    
    // Clear OTP after successful verification
    delete otpStore[phone];

    res.json({
      success: true,
      message: "OTP verified successfully",
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
      },
      sessionId: req.sessionID // Optional: for debugging
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
    });
  }
});



// Get current user profile
router.get("/me", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const user = await User.findById(req.session.user.id);
    if (!user) {
      req.session.destroy();
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        preferences: user.preferences,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
    });
  }
});


// Check if user is authenticated
router.get("/check-auth", (req, res) => {
  if (req.session.user) {
    res.json({
      authenticated: true,
      user: req.session.user
    });
  } else {
    res.json({
      authenticated: false
    });
  }
});

// Logout route
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to logout"
      });
    }
    
    res.clearCookie('sessionId'); // Clear the session cookie
    res.json({
      success: true,
      message: "Logged out successfully"
    });
  });
});

// Resend OTP endpoint
router.post("/resend-otp", async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    // Check if previous OTP exists and is still valid
    const existingOtp = otpStore[phone];
    if (existingOtp && (Date.now() - existingOtp.createdAt) < 30000) {
      return res.status(429).json({
        success: false,
        message: "Please wait 30 seconds before requesting a new OTP",
      });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store new OTP
    otpStore[phone] = {
      otp: otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      attempts: 0,
      createdAt: Date.now()
    };

    console.log(`New OTP for ${phone}: ${otp}`);

    res.json({
      success: true,
      message: "OTP sent successfully",
      debugOtp: process.env.NODE_ENV === 'development' ? otp : undefined,
    });
  } catch (error) {
    console.error("Error resending OTP:", error);
    res.status(500).json({
      success: false,
      message: "Failed to resend OTP",
    });
  }
});


router.get("/check-session", (req, res) => {
  if (req.session && req.session.restaurantId) {
    return res.json({ loggedIn: true });
  } else {
    return res.json({ loggedIn: false });
  }
});


module.exports = router;