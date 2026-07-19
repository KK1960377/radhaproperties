const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// POST /api/auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email aur password dono zaroori hain." });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({ message: "Galat email ya password." });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Galat email ya password." });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      admin: { id: admin._id, email: admin.email, name: admin.name },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// GET /api/auth/me
async function me(req, res) {
  const admin = await Admin.findById(req.admin.id).select("-passwordHash");
  if (!admin) return res.status(404).json({ message: "Admin not found" });
  res.json(admin);
}

// ---------------------------------------------------------------------
// Admin (panel user) management — powers the "Users" tab in the sidebar.
// ---------------------------------------------------------------------

// GET /api/auth/admins (admin only)
async function getAdmins(req, res) {
  try {
    const admins = await Admin.find().select("-passwordHash").sort({ createdAt: 1 });
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// POST /api/auth/admins (admin only)
async function createAdmin(req, res) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }
    const existing = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ message: "An admin with this email already exists." });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ email: email.toLowerCase().trim(), passwordHash, name: name || "Admin" });
    res.status(201).json({ id: admin._id, email: admin.email, name: admin.name });
  } catch (err) {
    res.status(400).json({ message: "Could not create admin user", error: err.message });
  }
}

// DELETE /api/auth/admins/:id (admin only) — an admin cannot delete their own account
async function deleteAdmin(req, res) {
  try {
    if (req.params.id === req.admin.id) {
      return res.status(400).json({ message: "You cannot delete your own account." });
    }
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json({ message: "Admin user deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

module.exports = { login, me, getAdmins, createAdmin, deleteAdmin };
