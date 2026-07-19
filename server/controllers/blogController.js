const Blog = require("../models/Blog");

// GET /api/blogs (public) — published only
async function getPublishedBlogs(req, res) {
  try {
    const blogs = await Blog.find({ published: true }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// GET /api/blogs/all (admin) — everything
async function getAllBlogs(req, res) {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// GET /api/blogs/:slugOrId (public)
async function getBlogBySlugOrId(req, res) {
  try {
    const { slugOrId } = req.params;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(slugOrId);
    const blog = isObjectId ? await Blog.findById(slugOrId) : await Blog.findOne({ slug: slugOrId });
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// POST /api/blogs (admin)
async function createBlog(req, res) {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ message: "Could not create blog", error: err.message });
  }
}

// PUT /api/blogs/:id (admin)
async function updateBlog(req, res) {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(400).json({ message: "Could not update blog", error: err.message });
  }
}

// DELETE /api/blogs/:id (admin)
async function deleteBlog(req, res) {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

module.exports = { getPublishedBlogs, getAllBlogs, getBlogBySlugOrId, createBlog, updateBlog, deleteBlog };
