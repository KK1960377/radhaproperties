const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, default: "" },
    interest: { type: String, trim: true, default: "" },
    message: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["New", "Contacted", "Closed"],
      default: "New",
    },

    // ---- Optional property-enquiry context (set automatically when the
    // enquiry is submitted from a Property Detail page's "Enquire Now" form) ----
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", default: null },
    propertyTitle: { type: String, trim: true, default: "" },
    propertyPrice: { type: String, trim: true, default: "" },
    propertyType: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, default: "" },
    budget: { type: String, trim: true, default: "" },

    // ---- Lead source — which button/flow generated this lead (new) ----
    source: {
      type: String,
      enum: [
        "Contact Form",
        "Enquire Now",
        "Book Site Visit",
        "Contact Agent",
        "Download Brochure",
        "Request Callback",
      ],
      default: "Contact Form",
    },
    preferredDate: { type: String, trim: true, default: "" }, // free-form, e.g. "22 Jul, 11:00 AM"
  },
  { timestamps: true }
);

inquirySchema.index({ createdAt: -1 });
inquirySchema.index({ status: 1 });
inquirySchema.index({ source: 1 });

module.exports = mongoose.model("Inquiry", inquirySchema);
