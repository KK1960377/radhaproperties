const mongoose = require("mongoose");

// Singleton collection (one document) describing the dynamic "About Owner"
// section. Kept separate from Settings so it can grow its own admin UI
// (Company Management > Owner Profile) without touching Settings.
const ownerProfileSchema = new mongoose.Schema(
  {
    key: { type: String, default: "owner_profile", unique: true },

    name: { type: String, trim: true, default: "Ravindra Kumar" },
    designation: { type: String, trim: true, default: "Founder & Chief Consultant" },
    photo: { type: String, default: "" },
    // Internal helper (not part of the documented schema) used to delete the
    // previous Cloudinary image automatically when a new one is uploaded.
    photoPublicId: { type: String, default: "", select: true },
    description: {
      type: String,
      trim: true,
      default:
        "A consultant who treats your address like it's his own — guiding families and investors across Greater Noida West for over a decade.",
    },
    experience: { type: String, trim: true, default: "10+ Years" },
    phone: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, default: "" },
    whatsapp: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
    buttonText: { type: String, trim: true, default: "Book a Consultation" },
    buttonLink: { type: String, trim: true, default: "#contact" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OwnerProfile", ownerProfileSchema);
