const express = require("express");
const router = express.Router();
const requireAdmin = require("../middleware/auth");
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

// Public (also used by admin with no ?active filter to see all)
router.get("/", getCategories);

// Admin only
router.post("/", requireAdmin, createCategory);
router.put("/:id", requireAdmin, updateCategory);
router.delete("/:id", requireAdmin, deleteCategory);

module.exports = router;
