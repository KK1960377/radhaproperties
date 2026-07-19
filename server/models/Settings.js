const mongoose = require("mongoose");

// Single-document collection holding site-wide settings.
// NOTE: the original fields (dealerName, phone1, phone2, email, address) are
// kept as-is so existing components (Navbar/Contact/Footer/etc.) keep working
// unmodified. New "Company Settings" + "Owner" fields are added alongside
// them and are consumed by the new Company Settings admin section.
const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "site_settings", unique: true },

    // ---- Legacy / existing fields (do not remove — used across the site) ----
    dealerName: { type: String, default: "Ravindra Kumar" },
    phone1: { type: String, default: "8851142540" },
    phone2: { type: String, default: "9540122984" },
    email: { type: String, default: "hello@radhaproperties.in" },
    address: { type: String, default: "Gaur City 2, Greater Noida West, UP" },

    // ---- Company Settings (new) ----
    companyName: { type: String, default: "Radha Homes Properties" },
    companyLogo: { type: String, default: "" }, // Cloudinary URL
    favicon: { type: String, default: "" }, // Cloudinary URL
    aboutCompany: {
      type: String,
      default:
        "Radha Homes Properties has spent over a decade matching families and investors with the right home across Gaur City — built on transparent pricing, verified paperwork and honest advice.",
    },
    whatsapp: { type: String, default: "8851142540" },
    facebook: { type: String, default: "" },
    instagram: { type: String, default: "" },
    youtube: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    twitter: { type: String, default: "" },
    officeTiming: { type: String, default: "Mon - Sun: 10:00 AM - 7:30 PM" },
    mapLink: {
      type: String,
      default: "https://www.google.com/maps?q=Gaur%20City%202%20Greater%20Noida%20West&output=embed",
    },

    // ---- Dynamic Owner section (new) ----
    ownerName: { type: String, default: "Ravindra Kumar" },
    ownerPhoto: { type: String, default: "" }, // Cloudinary URL
    ownerDesignation: { type: String, default: "Founder & Chief Consultant" },
    ownerPhone: { type: String, default: "8851142540" },
    ownerEmail: { type: String, default: "hello@radhaproperties.in" },
    ownerDescription: {
      type: String,
      default:
        "A consultant who treats your address like it's his own — guiding families and investors across Greater Noida West for over a decade.",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
