require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const Property = require("./models/Property");
const Settings = require("./models/Settings");
const Admin = require("./models/Admin");
const PropertyCategory = require("./models/PropertyCategory");
const TeamMember = require("./models/TeamMember");
const OwnerProfile = require("./models/OwnerProfile");
const FAQ = require("./models/FAQ");
const Testimonial = require("./models/Testimonial");
const HomeContent = require("./models/HomeContent");

const properties = [
  { title: "Gaur Siddhartham 3BHK", type: "Apartment", price: "₹1.42 Cr", location: "Gaur City 2, Sector 16C", area: "1450 sq.ft", beds: 3, baths: 3, parking: 1, status: "Ready to Move",
    imgs: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=900&auto=format&fit=crop"],
    // Premium detail-page demo data
    bhk: "3 BHK", pricePerSqft: "₹9,800/sq.ft", reraRegistered: true, reraId: "UPRERAPRJ12345",
    balcony: 2, facing: "East", floor: "6th Floor", totalFloors: "12", propertyAge: "3 Years", possession: "Ready to Move",
    carpetArea: "1210 sq.ft", builtupArea: "1450 sq.ft", superArea: "1620 sq.ft", ownership: "Freehold",
    furnishingStatus: "Semi-Furnished", lift: true, powerBackup: true, waterSupply: "24x7 Municipal + Borewell", electricity: "3 Phase, Sub-metered",
    description: "A bright, well-ventilated 3BHK on the 6th floor of Gaur Siddhartham, Sector 16C — one of Gaur City 2's most sought-after addresses. The apartment features a spacious living-dining area, modular kitchen, and a private balcony overlooking the central green. Close to schools, hospitals and the upcoming metro corridor, this home is ideal for families looking for a ready-to-move option with strong resale value.",
    amenities: ["Lift", "Gym", "Swimming Pool", "Club House", "Kids Play Area", "Park", "Security", "CCTV", "Power Backup", "Visitor Parking", "Fire Safety", "Rain Water Harvesting"],
    features: ["Park Facing", "Gated Society", "Premium Location"],
    furnishingItems: ["Modular Kitchen", "Wardrobes", "Geyser", "Lights"],
    nearbyPlaces: [
      { name: "Delhi Public School", category: "School", distance: "0.8 km" },
      { name: "Yatharth Hospital", category: "Hospital", distance: "1.5 km" },
      { name: "Noida Extension Metro (Upcoming)", category: "Metro", distance: "2.2 km" },
      { name: "Gaur City Mall", category: "Mall", distance: "1.1 km" },
    ],
    priceDetails: { bookingAmount: "₹5,00,000", maintenance: "₹3/sq.ft per month", registryCharges: "As per UP Stamp Act", stampDuty: "7% of circle rate" },
    videoUrl: "",
  },
  { title: "Ajnara Homes Villa", type: "Villa", price: "₹3.85 Cr", location: "Gaur City 1, Sector 4", area: "3200 sq.ft", beds: 4, baths: 5, parking: 2, status: "Ready to Move", bhk: "4 BHK",
    imgs: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=900&auto=format&fit=crop"] },
  { title: "High Street Retail Shop", type: "Shop", price: "₹68 Lac", location: "Gaur City 2 Market", area: "320 sq.ft", beds: 0, baths: 1, parking: 0, status: "Under Construction",
    imgs: ["https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=900&auto=format&fit=crop"] },
  { title: "Corporate Suite, Tower B", type: "Office", price: "₹95 Lac", location: "Noida Extension", area: "850 sq.ft", beds: 0, baths: 2, parking: 2, status: "Ready to Move",
    imgs: ["https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=900&auto=format&fit=crop"] },
  { title: "Panchsheel Greens Floor", type: "Apartment", price: "₹1.05 Cr", location: "Greater Noida West", area: "1250 sq.ft", beds: 2, baths: 2, parking: 1, status: "Ready to Move", bhk: "2 BHK",
    imgs: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=900&auto=format&fit=crop"] },
  { title: "Mixed-Use Commercial Plaza", type: "Commercial", price: "₹4.5 Cr", location: "Gaur Chowk", area: "5200 sq.ft", beds: 0, baths: 4, parking: 8, status: "New Launch",
    imgs: ["https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=900&auto=format&fit=crop"] },
];

async function seed() {
  await connectDB();

  // Settings: upsert dealer + contact + company + owner info
  await Settings.findOneAndUpdate(
    { key: "site_settings" },
    {
      key: "site_settings",
      dealerName: "Ravindra Kumar",
      phone1: "8851142540",
      phone2: "9540122984",
      email: "hello@radhaproperties.in",
      address: "Gaur City 2, Greater Noida West, UP",
      companyName: "Radha Homes Properties",
      whatsapp: "8851142540",
      officeTiming: "Mon - Sun: 10:00 AM - 7:30 PM",
      ownerName: "Ravindra Kumar",
      ownerDesignation: "Founder & Chief Consultant",
      ownerPhone: "8851142540",
      ownerEmail: "hello@radhaproperties.in",
    },
    { upsert: true }
  );
  console.log("Settings ready.");

  // Property Categories: only seed if empty
  const categoryCount = await PropertyCategory.countDocuments();
  if (categoryCount === 0) {
    await PropertyCategory.insertMany(
      ["Apartment", "Villa", "Shop", "Office", "Commercial"].map((name, i) => ({
        name,
        order: i,
      }))
    );
    console.log("Seeded property categories.");
  } else {
    console.log(`Categories collection already has ${categoryCount} docs, skipping.`);
  }

  // Team Members: only seed if empty (seeded BEFORE properties so a demo
  // property can be assigned a real agent below)
  let team = await TeamMember.find();
  if (team.length === 0) {
    team = await TeamMember.insertMany([
      {
        name: "Ravindra Kumar",
        designation: "Founder & Chief Consultant",
        phone: "8851142540",
        email: "hello@radhaproperties.in",
        whatsapp: "8851142540",
        experience: "10+ Years",
        bio: "Founded Radha Homes Properties and has personally guided hundreds of families to the right home across Gaur City.",
        order: 0,
        active: true,
      },
      {
        name: "Priya Mehta",
        designation: "Senior Sales Consultant",
        phone: "9876500000",
        email: "priya@radhaproperties.in",
        whatsapp: "9876500000",
        experience: "6+ Years",
        bio: "Specialist in premium apartments and villas across Gaur City 1 & 2.",
        order: 1,
        active: true,
      },
      {
        name: "Amit Rawal",
        designation: "Legal & Documentation Head",
        phone: "9876511111",
        email: "amit@radhaproperties.in",
        whatsapp: "9876511111",
        experience: "8+ Years",
        bio: "Handles title verification, registry and RERA compliance for every listing.",
        order: 2,
        active: true,
      },
    ]);
    console.log("Seeded team members.");
  } else {
    console.log(`Team collection already has ${team.length} docs, skipping.`);
  }

  // Properties: only seed if collection is empty (won't overwrite admin edits)
  const existingCount = await Property.countDocuments();
  if (existingCount === 0) {
    // Assign the demo (first) property to the first team member as its agent
    if (team[1]) properties[0].agent = team[1]._id; // Priya Mehta, Senior Sales Consultant
    // NOTE: insertMany() does not run 'save' middleware, so we use create()
    // in a loop instead — this ensures the propertyId auto-generation hook fires.
    for (const p of properties) {
      await Property.create(p);
    }
    console.log(`Seeded ${properties.length} properties.`);
  } else {
    console.log(`Properties collection already has ${existingCount} docs, skipping.`);
  }

  // Owner Profile: upsert defaults (safe to re-run, won't overwrite admin edits
  // to unrelated fields since we only set it if it doesn't already exist)
  const ownerExists = await OwnerProfile.findOne({ key: "owner_profile" });
  if (!ownerExists) {
    await OwnerProfile.create({
      key: "owner_profile",
      name: "Ravindra Kumar",
      designation: "Founder & Chief Consultant",
      experience: "10+ Years",
      phone: "8851142540",
      email: "hello@radhaproperties.in",
      whatsapp: "8851142540",
      address: "Gaur City 2, Greater Noida West, UP",
      buttonText: "Book a Consultation",
      buttonLink: "#contact",
      isActive: true,
    });
    console.log("Seeded owner profile.");
  } else {
    console.log("Owner profile already exists, skipping.");
  }

  // FAQs
  const faqCount = await FAQ.countDocuments();
  if (faqCount === 0) {
    await FAQ.insertMany(
      [
        { question: "Do you only deal in Gaur City properties?", answer: "Our core focus is Gaur City 1 & 2, but we actively cover all of Greater Noida West including Noida Extension." },
        { question: "Are all listed properties RERA registered?", answer: "Yes — we verify RERA registration and title documents before any property is listed or shown to clients." },
        { question: "Can you help with home loans?", answer: "Yes, we have direct tie-ups with leading banks and NBFCs to get you the best rate and fastest approval." },
        { question: "What are your service charges?", answer: "Brokerage is charged only on successful transactions, discussed transparently upfront — no hidden fees." },
        { question: "Do you assist NRIs in buying property?", answer: "Absolutely. We offer remote consultations, video walkthroughs, and full documentation support for NRI clients." },
      ].map((f, i) => ({ ...f, order: i }))
    );
    console.log("Seeded FAQs.");
  } else {
    console.log(`FAQ collection already has ${faqCount} docs, skipping.`);
  }

  // Testimonials
  const testimonialCount = await Testimonial.countDocuments();
  if (testimonialCount === 0) {
    await Testimonial.insertMany(
      [
        { name: "Ritu Sharma", location: "Gaur City 2 Resident", text: "Radha Homes Properties made buying our first flat completely stress-free — every document was checked twice before we even asked.", rating: 5 },
        { name: "Vikram Singh", location: "Investor, Noida Extension", text: "Honest pricing advice and zero pressure. Sold my property within three weeks at a fair value.", rating: 5 },
        { name: "Anjali & Rohit", location: "Gaur City 1 Residents", text: "From site visits to registry, the team personally handled everything. Truly a trusted partner.", rating: 5 },
        { name: "Deepak Verma", location: "Shop Owner, Gaur City Market", text: "Got a home loan approved in record time thanks to their bank tie-ups. Highly recommend.", rating: 5 },
      ].map((t, i) => ({ ...t, order: i }))
    );
    console.log("Seeded testimonials.");
  } else {
    console.log(`Testimonial collection already has ${testimonialCount} docs, skipping.`);
  }

  // Home page content (counters only by default — hero slider/partners are
  // left empty so the homepage's built-in default hero is used until an
  // admin adds slides)
  const homeContentExists = await HomeContent.findOne({ key: "home_content" });
  if (!homeContentExists) {
    await HomeContent.create({
      key: "home_content",
      counters: [
        { label: "Happy Families", value: 500, suffix: "+" },
        { label: "Properties Listed", value: 250, suffix: "+" },
        { label: "Years of Trust", value: 10, suffix: "+" },
        { label: "Verified Documents", value: 100, suffix: "%" },
      ],
    });
    console.log("Seeded home page content.");
  } else {
    console.log("Home page content already exists, skipping.");
  }

  // Admin user
  const email = (process.env.ADMIN_EMAIL || "admin@radhaproperties.in").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "radha@2026";
  const existingAdmin = await Admin.findOne({ email });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(password, 10);
    await Admin.create({ email, passwordHash, name: "Ravindra Kumar" });
    console.log(`Admin created -> email: ${email} | password: ${password}`);
  } else {
    console.log(`Admin already exists for ${email}, skipping.`);
  }

  console.log("Seeding complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
