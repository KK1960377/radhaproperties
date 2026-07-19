require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const Admin = require("./models/Admin");

const authRoutes = require("./routes/auth.routes");
const propertyRoutes = require("./routes/property.routes");
const settingsRoutes = require("./routes/settings.routes");
const uploadRoutes = require("./routes/upload.routes");
const teamRoutes = require("./routes/team.routes");
const categoryRoutes = require("./routes/category.routes");
const inquiryRoutes = require("./routes/inquiry.routes");
const ownerRoutes = require("./routes/owner.routes");
const adminOwnerRoutes = require("./routes/adminOwner.routes");
const faqRoutes = require("./routes/faq.routes");
const testimonialRoutes = require("./routes/testimonial.routes");
const homeContentRoutes = require("./routes/homeContent.routes");
const blogRoutes = require("./routes/blog.routes");

const app = express();

// ---------- Middleware ----------
const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : "*",
  })
);
app.use(express.json());

// ---------- Routes ----------
app.get("/", (req, res) =>
  res.json({
    message: "Radha Homes Properties backend is running.",
    endpoints: [
      "/api/health",
      "/api/auth",
      "/api/properties",
      "/api/settings",
      "/api/upload",
      "/api/team",
      "/api/categories",
      "/api/inquiries",
      "/api/owner",
      "/api/admin/owner",
      "/api/faqs",
      "/api/testimonials",
      "/api/home-content",
      "/api/blogs",
    ],
  })
);
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.get("/api", (req, res) => {
  res.send("API Root Working 🚀");
});
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/admin/owner", adminOwnerRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/home-content", homeContentRoutes);
app.use("/api/blogs", blogRoutes);


// ---------- 404 ----------
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// ---------- Error handler ----------
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong", error: err.message });
});

const PORT = process.env.PORT || 5000;

// Initialize admin user if not exists
async function initializeAdmin() {
  try {
    const email = (process.env.ADMIN_EMAIL || "admin@radhaproperties.in").toLowerCase();
    const password = process.env.ADMIN_PASSWORD || "radha@2026";
    const existingAdmin = await Admin.findOne({ email });
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash(password, 10);
      await Admin.create({ email, passwordHash, name: "Ravindra Kumar" });
      console.log(`✅ Admin user created successfully`);
    } else {
      console.log(`✅ Admin user ready`);
    }
  } catch (err) {
    console.error("⚠️ Error initializing admin:", err.message);
  }
}

// Kick off the DB connection. Mongoose queues queries by default until the
// connection is ready, so we don't need to block startup on this.
connectDB()
  .then(() => initializeAdmin())
  .catch((err) => console.error("Startup DB connection error:", err.message));

// Only bind to a port when this file is run directly (local dev / a
// traditional Node host). On Vercel the exported `app` below is used
// directly as the serverless function handler — no app.listen() needed.
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

module.exports = app;
