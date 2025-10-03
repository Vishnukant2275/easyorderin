const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  restaurantName: { type: String, required: true },
  ownerName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contactNumber: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pinCode: { type: String, required: true },
  restaurantType: {
    type: String,
    enum: ['dineIn', 'takeAway', 'delivery'],
    default: 'dineIn',
    required: true
  },
  logoImage: { type: String },
  seatingCapacity: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
