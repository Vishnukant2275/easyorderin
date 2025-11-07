const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    menuItems: [
      {
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
          min: 1,
        },
        notes: {
          type: String,
          default: "",
        },
        menuId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Menu",
        },
      },
    ],
    tableNumber: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "preparing", "served", "cancelled"],
      default: "pending",
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    // 👇 Expiry field
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      index: { expires: '0s' }, // TTL index, delete when expiresAt is reached
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
