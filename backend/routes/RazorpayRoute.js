const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();

const router = express.Router();

// 🧠 Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID ,
  key_secret: process.env.RAZORPAY_SECRET ,
});

// ================================================
// 🔹 1️⃣ CREATE ORDER (called before checkout popup)
// ================================================
router.post("/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;

    if (!amount) {
      return res.status(400).json({ success: false, message: "Amount required" });
    }

    const options = {
      amount: Math.round(amount * 100), // convert to paise
      currency,
      receipt: receipt || "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
});

// ===================================================
// 🔹 2️⃣ VERIFY PAYMENT SIGNATURE (after payment success)
// ===================================================
router.post("/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Generate signature using HMAC SHA256
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature === razorpay_signature) {
      // Signature is valid → Payment is verified
      return res.status(200).json({ success: true, message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature, verification failed" });
    }
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
});

module.exports = router;
