const cloudinary = require("../config/cloudinary");

// GET /api/upload/signature (admin only)
// Returns a short-lived signature so the browser can upload directly to
// Cloudinary — no image bytes ever pass through our server/serverless
// function, which keeps this Vercel-friendly (well under the 4.5MB
// function payload limit) and avoids tying up server resources.
function getUploadSignature(req, res) {
  try {
    const timestamp = Math.round(Date.now() / 1000);
    const folder = "radha-properties";
    const { api_key: apiKey, cloud_name: cloudName, api_secret: apiSecret } =
      cloudinary.config();

    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      apiSecret
    );

    res.json({ signature, timestamp, folder, apiKey, cloudName });
  } catch (err) {
    res.status(500).json({ message: "Could not create upload signature", error: err.message });
  }
}

module.exports = { getUploadSignature };

