const multer = require("multer");

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME.includes(file.mimetype)) {
      return cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed."));
    }
    cb(null, true);
  },
});

// Wraps multer so file-type/size errors come back as clean JSON instead of
// crashing past our normal error handling.
function handleOwnerPhotoUpload(req, res, next) {
  upload.single("photo")(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "Image must be smaller than 5MB." });
      }
      return res.status(400).json({ message: err.message || "Upload failed." });
    }
    next();
  });
}

module.exports = handleOwnerPhotoUpload;
