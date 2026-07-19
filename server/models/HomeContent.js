const mongoose = require("mongoose");

const heroSlideSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    title: { type: String, trim: true, default: "" },
    subtitle: { type: String, trim: true, default: "" },
    buttonText: { type: String, trim: true, default: "" },
    buttonLink: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const counterSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true, required: true }, // "Happy Families"
    value: { type: Number, required: true },
    suffix: { type: String, trim: true, default: "" }, // "+", "%"...
  },
  { _id: false }
);

const partnerSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    logo: { type: String, required: true },
    link: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const homeContentSchema = new mongoose.Schema(
  {
    key: { type: String, default: "home_content", unique: true },
    heroSlides: { type: [heroSlideSchema], default: [] },
    counters: { type: [counterSchema], default: [] },
    partners: { type: [partnerSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HomeContent", homeContentSchema);
