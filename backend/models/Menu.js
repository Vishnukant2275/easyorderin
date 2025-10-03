const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  items: [
    {
      name: { type: String, required: true },
      description: { type: String },
      price: { type: Number, required: true },
      isVegetarian: { type: Boolean, default: false },
      foodCategory: { 
        type: String, 
        enum: ["appetizer", "mainCourse", "dessert", "beverage"], 
        default: "mainCourse", 
        required: true 
      },
      keyIngredients: { type: [String] },
      image: { type: String },
      isAvailable: { type: Boolean, default: true },
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('Menu', menuSchema);
