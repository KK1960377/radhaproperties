const express = require("express");
const router = express.Router();
const requireAdmin = require("../middleware/auth");
const { getActiveFaqs, getAllFaqs, createFaq, updateFaq, deleteFaq } = require("../controllers/faqController");

router.get("/", getActiveFaqs);
router.get("/all", requireAdmin, getAllFaqs);
router.post("/", requireAdmin, createFaq);
router.put("/:id", requireAdmin, updateFaq);
router.delete("/:id", requireAdmin, deleteFaq);

module.exports = router;
