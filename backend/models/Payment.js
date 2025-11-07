const mongoose = require("mongoose");

const qrCodeSchema = new mongoose.Schema(
  {
    paymentMethod: {
      type: String,
      enum: ["PhonePe", "GooglePay", "Paytm", "UPI", "Other"],
      required: true,
    },
    qrImage: {
      data: {
        type: Buffer,
        required: true, // image data
      },
      contentType: {
        type: String, // e.g., image/png
        required: true,
      },
    },
    upiId: {
      type: String,
    },
    note: {
      type: String,
    },
  },
  { _id: true, timestamps: true } // ✅ enable _id and timestamps for each QR
);

const paymentSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    qrCodes: [qrCodeSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
