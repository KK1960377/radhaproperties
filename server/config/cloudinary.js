const cloudinary = require("cloudinary").v2;

// cloudinary.config() automatically picks up the CLOUDINARY_URL env variable
// (format: cloudinary://<api_key>:<api_secret>@<cloud_name>) if it's set.
// We still call config() explicitly so we can force secure (https) URLs.
cloudinary.config({
  secure: true,
});

module.exports = cloudinary;
