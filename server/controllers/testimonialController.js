const Testimonial = require("../models/Testimonial");

// GET /api/testimonials (public)
async function getActiveTestimonials(req, res) {
  try {
    const items = await Testimonial.find({ active: true }).sort({ order: 1, createdAt: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// GET /api/testimonials/all (admin)
async function getAllTestimonials(req, res) {
  try {
    const items = await Testimonial.find().sort({ order: 1, createdAt: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// POST /api/testimonials (admin)
async function createTestimonial(req, res) {
  try {
    const item = await Testimonial.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: "Could not create testimonial", error: err.message });
  }
}

// PUT /api/testimonials/:id (admin)
async function updateTestimonial(req, res) {
  try {
    const item = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: "Testimonial not found" });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: "Could not update testimonial", error: err.message });
  }
}

// DELETE /api/testimonials/:id (admin)
async function deleteTestimonial(req, res) {
  try {
    const item = await Testimonial.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Testimonial not found" });
    res.json({ message: "Testimonial deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

module.exports = { getActiveTestimonials, getAllTestimonials, createTestimonial, updateTestimonial, deleteTestimonial };
