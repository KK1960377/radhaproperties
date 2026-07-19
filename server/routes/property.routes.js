const express = require("express");
const router = express.Router();
const requireAdmin = require("../middleware/auth");
const {
  getProperties,
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  duplicateProperty,
} = require("../controllers/propertyController");

// Public
router.get("/", getProperties);
router.get("/all", requireAdmin, getAllProperties); // must come before "/:id"
router.get("/:id", getPropertyById);

// Admin only
router.post("/", requireAdmin, createProperty);
router.post("/:id/duplicate", requireAdmin, duplicateProperty);
router.put("/:id", requireAdmin, updateProperty);
router.delete("/:id", requireAdmin, deleteProperty);

module.exports = router;
