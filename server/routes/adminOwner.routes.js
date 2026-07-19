const express = require("express");
const router = express.Router();
const requireAdmin = require("../middleware/auth");
const handleOwnerPhotoUpload = require("../middleware/ownerUpload");
const {
  getOwnerProfile,
  updateOwnerProfile,
  uploadOwnerPhoto,
  deleteOwnerPhoto,
} = require("../controllers/ownerController");

router.get("/", requireAdmin, getOwnerProfile);
router.put("/", requireAdmin, updateOwnerProfile);
router.post("/upload-photo", requireAdmin, handleOwnerPhotoUpload, uploadOwnerPhoto);
router.delete("/photo", requireAdmin, deleteOwnerPhoto);

module.exports = router;
