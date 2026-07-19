const PropertyCategory = require("../models/PropertyCategory");

// GET /api/categories?active=true (public supports ?active=true filter; admin gets all)
async function getCategories(req, res) {
  try {
    const filter = {};
    if (req.query.active === "true") filter.active = true;
    const categories = await PropertyCategory.find(filter).sort({ order: 1, name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// POST /api/categories (admin only)
async function createCategory(req, res) {
  try {
    const category = await PropertyCategory.create(req.body);
    res.status(201).json(category);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "A category with this name already exists" });
    }
    res.status(400).json({ message: "Could not create category", error: err.message });
  }
}

// PUT /api/categories/:id (admin only)
async function updateCategory(req, res) {
  try {
    const category = await PropertyCategory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(400).json({ message: "Could not update category", error: err.message });
  }
}

// DELETE /api/categories/:id (admin only)
async function deleteCategory(req, res) {
  try {
    const category = await PropertyCategory.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
