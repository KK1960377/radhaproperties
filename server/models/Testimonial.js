const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, trim: true, default: "" }, // e.g. "Gaur City 2 Resident"
    photo: { type: String, default: "" },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    text: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
