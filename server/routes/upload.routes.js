const express = require("express");
const router = express.Router();
const requireAdmin = require("../middleware/auth");
const { getUploadSignature } = require("../controllers/uploadController");

// Admin only — issues a signed Cloudinary upload signature.
// The actual image bytes are uploaded directly from the browser to
// Cloudinary using this signature (see client/src/pages/AdminDashboard.jsx).
router.get("/signature", requireAdmin, getUploadSignature);

module.exports = router;
