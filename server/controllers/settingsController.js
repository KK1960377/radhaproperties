const Settings = require("../models/Settings");

// GET /api/settings  (public)
async function getSettings(req, res) {
  try {
    let settings = await Settings.findOne({ key: "site_settings" });
    if (!settings) {
      settings = await Settings.create({ key: "site_settings" });
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// PUT /api/settings  (admin only)
async function updateSettings(req, res) {
  try {
    const {
      // legacy fields
      dealerName,
      phone1,
      phone2,
      email,
      address,
      // company settings
      companyName,
      companyLogo,
      favicon,
      aboutCompany,
      whatsapp,
      facebook,
      instagram,
      youtube,
      linkedin,
      twitter,
      officeTiming,
      mapLink,
      // owner section
      ownerName,
      ownerPhoto,
      ownerDesignation,
      ownerPhone,
      ownerEmail,
      ownerDescription,
    } = req.body;

    const settings = await Settings.findOneAndUpdate(
      { key: "site_settings" },
      {
        dealerName,
        phone1,
        phone2,
        email,
        address,
        companyName,
        companyLogo,
        favicon,
        aboutCompany,
        whatsapp,
        facebook,
        instagram,
        youtube,
        linkedin,
        twitter,
        officeTiming,
        mapLink,
        ownerName,
        ownerPhoto,
        ownerDesignation,
        ownerPhone,
        ownerEmail,
        ownerDescription,
      },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(settings);
  } catch (err) {
    res.status(400).json({ message: "Could not update settings", error: err.message });
  }
}

// DELETE /api/settings/owner-photo (admin only) — clears the owner photo
async function deleteOwnerPhoto(req, res) {
  try {
    const settings = await Settings.findOneAndUpdate(
      { key: "site_settings" },
      { ownerPhoto: "" },
      { new: true, upsert: true }
    );
    res.json(settings);
  } catch (err) {
    res.status(400).json({ message: "Could not remove owner photo", error: err.message });
  }
}

module.exports = { getSettings, updateSettings, deleteOwnerPhoto };
