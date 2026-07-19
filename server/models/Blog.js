const mongoose = require("mongoose");

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, trim: true, unique: true, sparse: true },
    coverImage: { type: String, default: "" },
    excerpt: { type: String, trim: true, default: "" },
    content: { type: String, trim: true, default: "" },
    author: { type: String, trim: true, default: "" },
    tags: { type: [String], default: [] },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

blogSchema.pre("save", function (next) {
  if (!this.slug && this.title) {
    this.slug = `${slugify(this.title)}-${this._id.toString().slice(-5)}`;
  }
  next();
});

module.exports = mongoose.model("Blog", blogSchema);
