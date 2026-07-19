const express = require("express");
const router = express.Router();
const requireAdmin = require("../middleware/auth");
const { getHomeContent, updateHomeContent } = require("../controllers/homeContentController");

router.get("/", getHomeContent);
router.put("/", requireAdmin, updateHomeContent);

module.exports = router;
