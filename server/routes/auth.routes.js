const express = require("express");
const router = express.Router();
const { login, me, getAdmins, createAdmin, deleteAdmin } = require("../controllers/authController");
const requireAdmin = require("../middleware/auth");

router.post("/login", login);
router.get("/me", requireAdmin, me);

// Admin (panel user) management — "Users" tab
router.get("/admins", requireAdmin, getAdmins);
router.post("/admins", requireAdmin, createAdmin);
router.delete("/admins/:id", requireAdmin, deleteAdmin);

module.exports = router;
