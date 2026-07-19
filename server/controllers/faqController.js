const FAQ = require("../models/FAQ");

// GET /api/faqs (public) — active only, ordered
async function getActiveFaqs(req, res) {
  try {
    const faqs = await FAQ.find({ active: true }).sort({ order: 1, createdAt: 1 });
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// GET /api/faqs/all (admin)
async function getAllFaqs(req, res) {
  try {
    const faqs = await FAQ.find().sort({ order: 1, createdAt: 1 });
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// POST /api/faqs (admin)
async function createFaq(req, res) {
  try {
    const faq = await FAQ.create(req.body);
    res.status(201).json(faq);
  } catch (err) {
    res.status(400).json({ message: "Could not create FAQ", error: err.message });
  }
}

// PUT /api/faqs/:id (admin)
async function updateFaq(req, res) {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!faq) return res.status(404).json({ message: "FAQ not found" });
    res.json(faq);
  } catch (err) {
    res.status(400).json({ message: "Could not update FAQ", error: err.message });
  }
}

// DELETE /api/faqs/:id (admin)
async function deleteFaq(req, res) {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) return res.status(404).json({ message: "FAQ not found" });
    res.json({ message: "FAQ deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

module.exports = { getActiveFaqs, getAllFaqs, createFaq, updateFaq, deleteFaq };
