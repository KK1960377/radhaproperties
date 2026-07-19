const express = require("express");
const router = express.Router();
const requireAdmin = require("../middleware/auth");
const { getSettings, updateSettings, deleteOwnerPhoto } = require("../controllers/settingsController");

// Public
router.get("/", getSettings);

// Admin only
router.put("/", requireAdmin, updateSettings);
router.delete("/owner-photo", requireAdmin, deleteOwnerPhoto);

module.exports = router;
