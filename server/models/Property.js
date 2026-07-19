const mongoose = require("mongoose");

const nearbyPlaceSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    category: { type: String, trim: true, default: "Other" }, // School, Hospital, Metro, Bus Stand, Mall, Market, Temple, Airport...
    distance: { type: String, trim: true, default: "" }, // e.g. "1.2 km"
  },
  { _id: false }
);

const documentSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true, required: true }, // Brochure, Floor Plan, Price List, Master Plan, Site Plan...
    url: { type: String, trim: true, required: true },
  },
  { _id: false }
);

const furnishingQtySchema = new mongoose.Schema(
  {
    item: { type: String, trim: true, required: true }, // Beds, Wardrobes, AC...
    quantity: { type: Number, default: 1, min: 0 },
  },
  { _id: false }
);

const propertySchema = new mongoose.Schema(
  {
    // ---- Existing core fields (untouched — keeps current UI/API working) ----
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    price: { type: String, required: true, trim: true }, // e.g. "₹1.42 Cr"
    location: { type: String, required: true, trim: true },
    area: { type: String, required: true, trim: true }, // e.g. "1450 sq.ft"
    beds: { type: Number, default: 0, min: 0 },
    baths: { type: Number, default: 0, min: 0 },
    parking: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ["Ready to Move", "Under Construction", "New Launch"],
      default: "Ready to Move",
    },
    imgs: {
      type: [String], // online image URLs, picked/pasted by admin
      default: [],
    },
    featured: { type: Boolean, default: true },

    // ---- Publishing / promotion flags (new) ----
    published: { type: Boolean, default: true },
    premium: { type: Boolean, default: false },
    hot: { type: Boolean, default: false },

    // ---- Identification (new) ----
    category: { type: String, trim: true, default: "Residential" }, // Residential / Commercial / Land
    purpose: { type: String, trim: true, default: "Sale" }, // Sale / Rent
    builder: { type: String, trim: true, default: "" },
    projectName: { type: String, trim: true, default: "" },
    societyName: { type: String, trim: true, default: "" },
    buildingName: { type: String, trim: true, default: "" },
    tower: { type: String, trim: true, default: "" },
    wing: { type: String, trim: true, default: "" },
    block: { type: String, trim: true, default: "" },

    // ---- Building details (new) ----
    totalTowers: { type: String, trim: true, default: "" },
    totalFlatsInBuilding: { type: String, trim: true, default: "" },
    flatsPerFloor: { type: String, trim: true, default: "" },
    flatNumber: { type: String, trim: true, default: "" },
    unitNumber: { type: String, trim: true, default: "" },
    liftCount: { type: Number, default: 0, min: 0 },
    serviceLift: { type: Boolean, default: false },
    fireExit: { type: Boolean, default: false },
    visitorParking: { type: Number, default: 0, min: 0 },
    basementParking: { type: Number, default: 0, min: 0 },
    coveredParking: { type: Number, default: 0, min: 0 },
    openParking: { type: Number, default: 0, min: 0 },

    // ---- Room details (new, presence flags) ----
    livingRoom: { type: Boolean, default: true },
    diningRoom: { type: Boolean, default: false },
    drawingRoom: { type: Boolean, default: false },
    kitchen: { type: Boolean, default: true },
    modularKitchen: { type: Boolean, default: false },
    storeRoom: { type: Boolean, default: false },
    studyRoom: { type: Boolean, default: false },
    servantRoom: { type: Boolean, default: false },
    poojaRoom: { type: Boolean, default: false },
    utility: { type: Boolean, default: false },
    dryBalcony: { type: Boolean, default: false },
    terrace: { type: Boolean, default: false },

    // ---- Area extras (new) ----
    floorHeight: { type: String, trim: true, default: "" },
    ceilingHeight: { type: String, trim: true, default: "" },

    // ---- Premium Property Detail page fields (new) ----

    // Top section
    propertyId: { type: String, trim: true, unique: true, sparse: true }, // human-readable ID, auto-generated
    pricePerSqft: { type: String, trim: true, default: "" }, // e.g. "₹8,500/sq.ft"
    bhk: { type: String, trim: true, default: "" }, // e.g. "3 BHK"
    reraRegistered: { type: Boolean, default: false },
    reraId: { type: String, trim: true, default: "" },

    // Overview specs
    balcony: { type: Number, default: 0, min: 0 },
    facing: { type: String, trim: true, default: "" },
    floor: { type: String, trim: true, default: "" },
    totalFloors: { type: String, trim: true, default: "" },
    propertyAge: { type: String, trim: true, default: "" },
    possession: { type: String, trim: true, default: "" },
    carpetArea: { type: String, trim: true, default: "" },
    builtupArea: { type: String, trim: true, default: "" },
    superArea: { type: String, trim: true, default: "" },
    plotArea: { type: String, trim: true, default: "" },
    ownership: { type: String, trim: true, default: "" },
    furnishingStatus: { type: String, trim: true, default: "" }, // Furnished / Semi-Furnished / Unfurnished
    lift: { type: Boolean, default: false },
    powerBackup: { type: Boolean, default: false },
    waterSupply: { type: String, trim: true, default: "" },
    electricity: { type: String, trim: true, default: "" },

    // About
    description: { type: String, trim: true, default: "" },

    // Amenities / Features / Furnishing (checklist-style tags)
    amenities: { type: [String], default: [] },
    features: { type: [String], default: [] }, // highlight tags: Corner Plot, Park Facing...
    furnishingItems: { type: [String], default: [] }, // AC, Fans, Modular Kitchen...

    // Location
    mapLink: { type: String, trim: true, default: "" }, // per-property Google Maps embed URL
    country: { type: String, trim: true, default: "India" },
    state: { type: String, trim: true, default: "Uttar Pradesh" },
    city: { type: String, trim: true, default: "" },
    sector: { type: String, trim: true, default: "" },
    locality: { type: String, trim: true, default: "" },
    landmark: { type: String, trim: true, default: "" },
    pincode: { type: String, trim: true, default: "" },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    nearbyPlaces: { type: [nearbyPlaceSchema], default: [] },

    // Price details
    priceDetails: {
      bookingAmount: { type: String, trim: true, default: "" },
      maintenance: { type: String, trim: true, default: "" },
      registryCharges: { type: String, trim: true, default: "" },
      stampDuty: { type: String, trim: true, default: "" },
      gst: { type: String, trim: true, default: "" },
      plcCharges: { type: String, trim: true, default: "" },
      monthlyRent: { type: String, trim: true, default: "" },
      securityDeposit: { type: String, trim: true, default: "" },
      emi: { type: String, trim: true, default: "" },
      negotiable: { type: Boolean, default: false },
    },

    // Media
    featuredImage: { type: String, trim: true, default: "" }, // falls back to imgs[0] on the client if empty
    documents: { type: [documentSchema], default: [] },
    videoUrl: { type: String, trim: true, default: "" }, // primary YouTube link
    videos: { type: [String], default: [] }, // additional video links
    images360: { type: [String], default: [] },
    virtualTourUrl: { type: String, trim: true, default: "" },

    // Furnishing item quantities (Beds: 2, Wardrobes: 3, AC: 2...)
    furnishingType: {
      type: String,
      enum: ["Unfurnished", "Semi Furnished", "Fully Furnished"],
      default: "Unfurnished",
    },
    furnishingQty: { type: [furnishingQtySchema], default: [] },

    // Builder information (shown on the client as its own section)
    builderLogo: { type: String, trim: true, default: "" },
    builderDescription: { type: String, trim: true, default: "" },

    // Agent (falls back to Owner Profile on the client if not set)
    agent: { type: mongoose.Schema.Types.ObjectId, ref: "TeamMember", default: null },

    // SEO
    seo: {
      metaTitle: { type: String, trim: true, default: "" },
      metaDescription: { type: String, trim: true, default: "" },
      metaKeywords: { type: String, trim: true, default: "" },
      ogImage: { type: String, trim: true, default: "" },
      canonicalUrl: { type: String, trim: true, default: "" },
    },
  },
  { timestamps: true }
);

// Auto-generate a short, human-readable property ID the first time a
// property is saved (e.g. RHP-A1B2C3) — shown on the detail page.
propertySchema.pre("save", function (next) {
  if (!this.propertyId) {
    const suffix = this._id.toString().slice(-6).toUpperCase();
    this.propertyId = `RHP-${suffix}`;
  }
  next();
});

module.exports = mongoose.model("Property", propertySchema);
