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

// Beautiful HTML template for OTP email
const createOtpEmailTemplate = (otpCode) => {
return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Your Restaurant OTP</title>

<style>
    body {
        margin: 0;
        padding: 0;
        background: #f4f4f7;
        font-family: Arial, sans-serif;
    }

    .container {
        max-width: 600px;
        margin: 20px auto;
        background: #ffffff;
        border-radius: 14px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }

    .header {
        background: linear-gradient(135deg, #6a5af9 0%, #c86dd7 100%);
        padding: 35px 20px;
        text-align: center;
    }

    .header h1 {
        color: white;
        font-size: 26px;
        margin: 0;
        font-weight: bold;
    }

    .content {
        padding: 40px 32px;
        text-align: center;
    }

    .welcome {
        font-size: 18px;
        color: #333;
        line-height: 1.6;
    }

    .otp-box {
        margin: 30px auto;
        background: #ffffff;
        border: 2px dashed #6a5af9;
        border-radius: 12px;
        padding: 18px 20px;
        max-width: 260px;
        cursor: pointer;
    }

    .otp-code {
        font-size: 36px;
        font-weight: bold;
        color: #6a5af9;
        letter-spacing: 6px;
        user-select: all;
    }

    .copy-text {
        font-size: 12px;
        margin-top: 6px;
        color: #777;
        font-style: italic;
    }

    .instruction {
        margin-top: 25px;
        font-size: 14px;
        line-height: 1.5;
        color: #585858;
    }

    .warning {
        background: #fff4e5;
        color: #8a5d00;
        padding: 12px 16px;
        border-radius: 8px;
        margin-top: 20px;
        font-size: 13px;
    }

    .footer {
        text-align: center;
        padding: 25px;
        background: #fafafa;
        color: #777;
        font-size: 12px;
        border-top: 1px solid #eee;
    }

    .brand {
        font-size: 22px;
        font-weight: bold;
        color: #6a5af9;
        margin-bottom: 6px;
    }

    @media(max-width:600px) {
        .content { padding: 25px 15px; }
        .otp-code { font-size: 30px; }
    }
</style>
</head>

<body>

<div class="container">

    <div class="header">
        <h1>🍽️ Restaurant Verification</h1>
    </div>

    <div class="content">

        <p class="welcome">
            Welcome to <strong>EasyOrderIn</strong>!  
            Use the OTP below to complete your restaurant registration:
        </p>

        <!-- OTP Box -->
        <div class="otp-box">
            <div class="otp-code">${otpCode}</div>
            <div class="copy-text">📋 Tap to copy</div>
        </div>

        <p class="instruction">
            This OTP is valid for <strong>10 minutes.</strong><br>
            Enter it on the registration screen to continue.
        </p>

        <div class="warning">
            ⚠️ <strong>Security Notice:</strong>  
            Do not share your OTP with anyone. EasyOrderIn team will NEVER ask for it.
        </div>

        <p class="instruction" style="margin-top:25px;">
            If this was not you, you can safely ignore this email.
        </p>

    </div>

    <div class="footer">
        <div class="brand">EasyOrderIn</div>
        © ${new Date().getFullYear()} EasyOrderIn — All Rights Reserved<br>
        Delivering next-gen dining experiences.
    </div>

</div>

</body>
</html>
`;

};

// Send OTP function
const sendRestaurantOtp = async (to) => {
  const otpCode = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Your Restaurant Registration OTP Code 🍽️",
    text: `Your OTP code for restaurant registration is: ${otpCode}. This code expires in 10 minutes.`,
    html: createOtpEmailTemplate(otpCode)
  };

  // Save OTP in DB
  await otpModel.deleteMany({ email: to }).catch((err) => console.log(err)); // Remove old OTPs for the email
  const otpEntry = new otpModel({ email: to, otp: otpCode });
  await otpEntry.save();

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP email sent to:", to);
    return otpCode; // optionally return the OTP
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
};

module.exports = { sendRestaurantOtp };