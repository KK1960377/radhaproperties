const HomeContent = require("../models/HomeContent");

const KEY = "home_content";

async function ensureContent() {
  let content = await HomeContent.findOne({ key: KEY });
  if (!content) content = await HomeContent.create({ key: KEY });
  return content;
}

// GET /api/home-content (public)
async function getHomeContent(req, res) {
  try {
    const content = await ensureContent();
    res.json(content);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// PUT /api/home-content (admin)
async function updateHomeContent(req, res) {
  try {
    const { heroSlides, counters, partners } = req.body;
    const content = await HomeContent.findOneAndUpdate(
      { key: KEY },
      { key: KEY, heroSlides, counters, partners },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(content);
  } catch (err) {
    res.status(400).json({ message: "Could not update home page content", error: err.message });
  }
}

module.exports = { getHomeContent, updateHomeContent };
