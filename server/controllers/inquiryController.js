const Inquiry = require("../models/Inquiry");

const VALID_SOURCES = [
  "Contact Form",
  "Enquire Now",
  "Book Site Visit",
  "Contact Agent",
  "Download Brochure",
  "Request Callback",
];

// POST /api/inquiries (public) — the client Contact form, the Property
// Detail page's Enquire Now / Book Site Visit / Contact Agent / Download
// Brochure / Request Callback flows all submit here, tagged with `source`.
async function createInquiry(req, res) {
  try {
    const {
      name, phone, email, interest, message,
      property, propertyTitle, propertyPrice, propertyType,
      city, budget, source, preferredDate,
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: "Name and phone are required." });
    }

    const inquiry = await Inquiry.create({
      name,
      phone,
      email,
      interest,
      message,
      property: property || null,
      propertyTitle,
      propertyPrice,
      propertyType,
      city,
      budget,
      source: VALID_SOURCES.includes(source) ? source : "Contact Form",
      preferredDate,
    });
    res.status(201).json(inquiry);
  } catch (err) {
    res.status(400).json({ message: "Could not submit enquiry", error: err.message });
  }
}

// GET /api/inquiries?search=&status=&source= (admin only)
async function getInquiries(req, res) {
  try {
    const { search, status, source } = req.query;
    const filter = {};

    if (status && ["New", "Contacted", "Closed"].includes(status)) {
      filter.status = status;
    }
    if (source && VALID_SOURCES.includes(source)) {
      filter.source = source;
    }
    if (search && search.trim()) {
      const re = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [{ name: re }, { phone: re }, { propertyTitle: re }, { email: re }];
    }

    const inquiries = await Inquiry.find(filter).sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// PUT /api/inquiries/:id (admin only) — update status
async function updateInquiry(req, res) {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });
    res.json(inquiry);
  } catch (err) {
    res.status(400).json({ message: "Could not update inquiry", error: err.message });
  }
}

// DELETE /api/inquiries/:id (admin only)
async function deleteInquiry(req, res) {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });
    res.json({ message: "Inquiry deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

module.exports = { createInquiry, getInquiries, updateInquiry, deleteInquiry };
