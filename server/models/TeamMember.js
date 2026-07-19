const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema(
  {
    photo: { type: String, default: "" }, // Cloudinary URL
    name: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    phone: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, default: "" },
    whatsapp: { type: String, trim: true, default: "" },
    experience: { type: String, trim: true, default: "" }, // e.g. "5+ Years"
    bio: { type: String, trim: true, default: "" },
    facebook: { type: String, trim: true, default: "" },
    instagram: { type: String, trim: true, default: "" },
    linkedin: { type: String, trim: true, default: "" },
    order: { type: Number, default: 0 }, // display order, lower = first
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TeamMember", teamMemberSchema);
