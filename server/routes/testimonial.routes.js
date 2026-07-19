const express = require("express");
const router = express.Router();
const requireAdmin = require("../middleware/auth");
const {
  getActiveTestimonials,
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonialController");

router.get("/", getActiveTestimonials);
router.get("/all", requireAdmin, getAllTestimonials);
router.post("/", requireAdmin, createTestimonial);
router.put("/:id", requireAdmin, updateTestimonial);
router.delete("/:id", requireAdmin, deleteTestimonial);

module.exports = router;
