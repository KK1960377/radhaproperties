const express = require("express");
const router = express.Router();
const { getPublicOwnerProfile } = require("../controllers/ownerController");

// Public — used by the client About/Owner section
router.get("/", getPublicOwnerProfile);

module.exports = router;
