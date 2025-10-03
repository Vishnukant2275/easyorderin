const otp = require("../models/otp");
const otpModel = require("../models/otp");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Create transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Your App Password
  },
});

// Send OTP function
const sendRestaurantOtp = async (to) => {
  const otpCode = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Your Restaurant OTP Code",
    text: `Your OTP code for restaurant registration is: ${otpCode}`,
  };

  // Save OTP in DB
  await otpModel.deleteMany({ email: to }).catch((err) => console.log(err)); // Remove old OTPs for the email
  const otpEntry = new otpModel({ email: to, otp: otpCode });
  await otpEntry.save();

  try {
    await transporter.sendMail(mailOptions); // await here
    console.log("OTP email sent to:", to);
    return otpCode; // optionally return the OTP
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
};

module.exports = { sendRestaurantOtp };
