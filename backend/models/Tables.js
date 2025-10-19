const mongoose = require("mongoose");

const tablesSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    tables: [
      {
        tableNumber: { type: Number, required: true },
        status: {
          type: String,
          enum: ["available", "occupied"],
          default: "available",
        },
        currentOrder: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Order",
          default: null,
        },
        isActive: { type: Boolean, default: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tables", tablesSchema);
