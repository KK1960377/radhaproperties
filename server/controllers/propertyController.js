const Property = require("../models/Property");

// GET /api/properties?type=Apartment (public — published only)
async function getProperties(req, res) {
  try {
    const filter = { published: true };
    if (req.query.type && req.query.type !== "all") {
      filter.type = req.query.type;
    }
    const properties = await Property.find(filter).populate("agent").sort({ createdAt: -1 });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// GET /api/properties/all (admin only — includes unpublished/draft listings)
async function getAllProperties(req, res) {
  try {
    const properties = await Property.find().populate("agent").sort({ createdAt: -1 });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// GET /api/properties/:id
async function getPropertyById(req, res) {
  try {
    const property = await Property.findById(req.params.id).populate("agent");
    if (!property || !property.published) return res.status(404).json({ message: "Property not found" });
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// POST /api/properties (admin only)
async function createProperty(req, res) {
  try {
    const property = await Property.create(req.body);
    res.status(201).json(property);
  } catch (err) {
    res.status(400).json({ message: "Could not create property", error: err.message });
  }
}

// PUT /api/properties/:id (admin only)
async function updateProperty(req, res) {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.json(property);
  } catch (err) {
    res.status(400).json({ message: "Could not update property", error: err.message });
  }
}

// DELETE /api/properties/:id (admin only)
async function deleteProperty(req, res) {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.json({ message: "Property deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// POST /api/properties/:id/duplicate (admin only)
async function duplicateProperty(req, res) {
  try {
    const original = await Property.findById(req.params.id).lean();
    if (!original) return res.status(404).json({ message: "Property not found" });

    const copy = { ...original };
    delete copy._id;
    delete copy.propertyId; // let the pre-save hook generate a fresh one
    delete copy.createdAt;
    delete copy.updatedAt;
    copy.title = `${copy.title} (Copy)`;
    copy.published = false; // duplicates start unpublished so admins can review first

    const duplicate = await Property.create(copy);
    res.status(201).json(duplicate);
  } catch (err) {
    res.status(400).json({ message: "Could not duplicate property", error: err.message });
  }
}

module.exports = {
  getProperties,
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  duplicateProperty,
};
