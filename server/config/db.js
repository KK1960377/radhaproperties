const mongoose = require("mongoose");

async function connectDB() {
  // On serverless platforms (Vercel) the module can stay warm between
  // invocations — avoid reconnecting if we already have a live connection.
  if (mongoose.connection.readyState === 1) return;

  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI is not set in .env");

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected:", mongoose.connection.host);
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    // Don't process.exit() here — on serverless that would kill the whole
    // function process, potentially affecting other in-flight requests.
    throw err;
  }
}

module.exports = connectDB;
