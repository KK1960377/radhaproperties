const mongoose = require("mongoose");

const propertyCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PropertyCategory", propertyCategorySchema);
