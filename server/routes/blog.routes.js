const express = require("express");
const router = express.Router();
const requireAdmin = require("../middleware/auth");
const {
  getPublishedBlogs,
  getAllBlogs,
  getBlogBySlugOrId,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");

router.get("/", getPublishedBlogs);
router.get("/all", requireAdmin, getAllBlogs);
router.get("/:slugOrId", getBlogBySlugOrId);
router.post("/", requireAdmin, createBlog);
router.put("/:id", requireAdmin, updateBlog);
router.delete("/:id", requireAdmin, deleteBlog);

module.exports = router;
