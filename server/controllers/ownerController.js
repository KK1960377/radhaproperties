const OwnerProfile = require("../models/OwnerProfile");
const cloudinary = require("../config/cloudinary");

const KEY = "owner_profile";

async function ensureProfile() {
  let profile = await OwnerProfile.findOne({ key: KEY });
  if (!profile) profile = await OwnerProfile.create({ key: KEY });
  return profile;
}

// GET /api/admin/owner (admin) — full profile for the edit form
async function getOwnerProfile(req, res) {
  try {
    const profile = await ensureProfile();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// GET /api/owner (public) — only returned while the section is active
async function getPublicOwnerProfile(req, res) {
  try {
    const profile = await OwnerProfile.findOne({ key: KEY });
    if (!profile || !profile.isActive) return res.json(null);
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// PUT /api/admin/owner (admin)
async function updateOwnerProfile(req, res) {
  try {
    const {
      name,
      designation,
      description,
      experience,
      phone,
      email,
      whatsapp,
      address,
      buttonText,
      buttonLink,
      isActive,
    } = req.body;

    if (!name || !name.trim()) return res.status(400).json({ message: "Owner name is required." });
    if (!designation || !designation.trim()) return res.status(400).json({ message: "Designation is required." });
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }

    const profile = await OwnerProfile.findOneAndUpdate(
      { key: KEY },
      {
        key: KEY,
        name: name.trim(),
        designation: designation.trim(),
        description,
        experience,
        phone,
        email,
        whatsapp,
        address,
        buttonText,
        buttonLink,
        isActive: isActive !== undefined ? isActive : true,
      },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(profile);
  } catch (err) {
    res.status(400).json({ message: "Could not update owner profile", error: err.message });
  }
}

// POST /api/admin/owner/upload-photo (admin) — replaces & auto-deletes the old image
async function uploadOwnerPhoto(req, res) {
  try {
    if (!req.file) return res.status(400).json({ message: "No image file provided." });
    const profile = await ensureProfile();

    if (profile.photoPublicId) {
      try {
        await cloudinary.uploader.destroy(profile.photoPublicId);
      } catch (e) {
        console.error("Cloudinary cleanup failed:", e.message);
      }
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: "radha-properties/owner" }, (err, out) =>
        err ? reject(err) : resolve(out)
      );
      stream.end(req.file.buffer);
    });

    profile.photo = result.secure_url;
    profile.photoPublicId = result.public_id;
    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(400).json({ message: err.message || "Could not upload photo" });
  }
}

// DELETE /api/admin/owner/photo (admin)
async function deleteOwnerPhoto(req, res) {
  try {
    const profile = await ensureProfile();
    if (!profile.photo) return res.status(400).json({ message: "There is no photo to delete." });
    if (profile.photoPublicId) {
      try {
        await cloudinary.uploader.destroy(profile.photoPublicId);
      } catch (e) {
        console.error("Cloudinary cleanup failed:", e.message);
      }
    }
    profile.photo = "";
    profile.photoPublicId = "";
    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

module.exports = {
  getOwnerProfile,
  getPublicOwnerProfile,
  updateOwnerProfile,
  uploadOwnerPhoto,
  deleteOwnerPhoto,
};
