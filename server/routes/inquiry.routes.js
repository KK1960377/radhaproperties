const express = require("express");
const router = express.Router();
const requireAdmin = require("../middleware/auth");
const {
  createInquiry,
  getInquiries,
  updateInquiry,
  deleteInquiry,
} = require("../controllers/inquiryController");

// Public — client Contact form submits here
router.post("/", createInquiry);

// Admin only
router.get("/", requireAdmin, getInquiries);
router.put("/:id", requireAdmin, updateInquiry);
router.delete("/:id", requireAdmin, deleteInquiry);

module.exports = router;
