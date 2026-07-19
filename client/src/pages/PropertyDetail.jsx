import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  BadgeCheck,
  ShieldCheck,
  Hash,
  Calendar,
  Phone,
  MessageCircle,
  Eye,
  Sun,
  Moon,
  ChevronDown,
  ChevronUp,
  UserRound,
  CalendarCheck,
  FileDown,
  Building2,
  Mail,
} from "lucide-react";
import api from "../api/axios";
import { useFavorites } from "../utils/favorites";
import { AMENITY_LIST, FEATURE_LIST, FURNISHING_LIST, amenityIcon, featureIcon, furnishingIcon } from "../utils/propertyIcons";

import Gallery from "../components/property/Gallery";
import OverviewGrid from "../components/property/OverviewGrid";
import IconTagGrid from "../components/property/IconTagGrid";
import NearbyPlaces from "../components/property/NearbyPlaces";
import EMICalculator from "../components/property/EMICalculator";
import DocumentsList from "../components/property/DocumentsList";
import VideoSection from "../components/property/VideoSection";
import SimilarProperties from "../components/property/SimilarProperties";
import AgentCard from "../components/property/AgentCard";
import PropertyInquiryForm from "../components/property/PropertyInquiryForm";
import EnquiryModal from "../components/property/EnquiryModal";
import StickyNavTabs from "../components/property/StickyNavTabs";
import StickyMobileBar from "../components/property/StickyMobileBar";

const statusColor = {
  "Ready to Move": "bg-emerald-500",
  "Under Construction": "bg-amber-500",
  "New Launch": "bg-navy",
};

function Skeleton() {
  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-24 animate-pulse">
      <div className="h-8 w-40 bg-navy/10 rounded-full mb-8" />
      <div className="aspect-[16/9] bg-navy/10 rounded-3xl mb-6" />
      <div className="h-6 w-2/3 bg-navy/10 rounded mb-3" />
      <div className="h-4 w-1/3 bg-navy/10 rounded mb-10" />
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-20 bg-navy/10 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [settings, setSettings] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [descExpanded, setDescExpanded] = useState(false);
  const [modalSource, setModalSource] = useState(null); // null | "Enquire Now" | "Book Site Visit" | "Contact Agent" | "Download Brochure" | "Request Callback"
  const [pendingBrochureUrl, setPendingBrochureUrl] = useState(null);
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [dark, setDark] = useState(false);

  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    if (!property) return;
    const seo = property.seo || {};
    const title = seo.metaTitle || `${property.title} | ${property.location}`;
    const description = seo.metaDescription || (property.description || "").slice(0, 160);
    const ogImage = seo.ogImage || property.featuredImage || property.imgs?.[0] || "";

    document.title = title;

    function setMeta(selector, attr, value) {
      if (!value) return;
      let el = document.head.querySelector(selector);
      if (!el) {
        el = document.createElement(selector.startsWith("link") ? "link" : "meta");
        if (selector.includes("property=")) el.setAttribute("property", selector.match(/property="([^"]+)"/)[1]);
        else if (selector.includes("name=")) el.setAttribute("name", selector.match(/name="([^"]+)"/)[1]);
        else if (selector.includes("rel=")) el.setAttribute("rel", selector.match(/rel="([^"]+)"/)[1]);
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    }

    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[name="keywords"]', "content", seo.metaKeywords || "");
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:image"]', "content", ogImage);
    if (seo.canonicalUrl) setMeta('link[rel="canonical"]', "href", seo.canonicalUrl);

    return () => {
      document.title = "Radha Homes Properties";
    };
  }, [property]);

  function findBrochureUrl() {
    const doc = (property?.documents || []).find((d) => /brochure/i.test(d.label));
    return doc?.url || null;
  }

  function handleDownloadBrochure() {
    setPendingBrochureUrl(findBrochureUrl());
    setModalSource("Download Brochure");
  }

  useEffect(() => {
    setLoading(true);
    setError("");
    window.scrollTo(0, 0);
    Promise.all([
      api.get(`/properties/${id}`),
      api.get("/settings").catch(() => ({ data: null })),
      api.get("/owner").catch(() => ({ data: null })),
    ])
      .then(([propRes, settingsRes, ownerRes]) => {
        setProperty(propRes.data);
        setSettings(settingsRes.data);
        setOwner(ownerRes.data);
      })
      .catch(() => setError("This property could not be found."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Skeleton />;
  if (error || !property) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-32 text-center">
        <p className="font-display text-2xl mb-3">Property not found</p>
        <p className="text-navy/60 mb-6">{error || "This listing may have been removed."}</p>
        <Link to="/" className="inline-flex items-center gap-2 text-gold font-semibold hover:underline">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>
    );
  }

  const companyName = settings?.companyName || "Radha Homes Properties";
  const agent = property.agent || null;
  // Fall back to the Owner Profile as the point of contact if no agent is assigned
  const contact = agent || (owner ? { ...owner, whatsapp: owner.whatsapp || owner.phone } : null);
  const phone = contact?.phone || settings?.phone1 || "";
  const whatsapp = contact?.whatsapp || settings?.whatsapp || phone;

  const description = property.description || "";
  const isLongDesc = description.length > 380;
  const shownDesc = !isLongDesc || descExpanded ? description : description.slice(0, 380) + "...";

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "price", label: "Price" },
    { id: "amenities", label: "Amenities" },
    { id: "furnishing", label: "Furnishing" },
    { id: "nearby", label: "Nearby" },
    { id: "location", label: "Location" },
    { id: "documents", label: "Documents" },
    { id: "builder", label: "Builder" },
    { id: "agent", label: "Agent" },
    { id: "owner", label: "Owner" },
    { id: "company", label: "Company" },
    { id: "reviews", label: "Reviews" },
    { id: "similar", label: "Similar Properties" },
  ].filter((s) => {
    if (s.id === "amenities") return property.amenities?.length;
    if (s.id === "furnishing") return property.furnishingItems?.length;
    if (s.id === "nearby") return property.nearbyPlaces?.length;
    if (s.id === "documents") return property.documents?.length;
    if (s.id === "builder") return !!(property.builder || property.builderDescription);
    if (s.id === "agent") return !!contact;
    if (s.id === "owner") return !!owner;
    return true;
  });

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-paper dark:bg-navy-deep dark:text-white/90 transition-colors pb-24 lg:pb-0">
        {/* Top bar */}
        <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-6 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-navy/70 dark:text-white/70 hover:text-gold transition">
            <ArrowLeft size={16} /> Back
          </Link>
          <button
            onClick={() => setDark((d) => !d)}
            className="w-9 h-9 rounded-full border border-navy/15 dark:border-white/20 flex items-center justify-center hover:bg-navy/5 dark:hover:bg-white/10 transition"
            title="Toggle dark mode"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        {/* Gallery + top info + sticky contact card */}
        <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-5">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Gallery imgs={property.imgs} title={property.title} isFavorite={isFavorite(property._id)} onToggleFavorite={() => toggleFavorite(property._id)} />

              <div className="mt-6">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`${statusColor[property.status] || "bg-navy"} text-white text-[11px] font-semibold px-3 py-1 rounded-full`}>
                    {property.status}
                  </span>
                  <span className="bg-navy/5 dark:bg-white/10 text-[11px] font-semibold px-3 py-1 rounded-full">{property.type}</span>
                  {property.bhk && <span className="bg-navy/5 dark:bg-white/10 text-[11px] font-semibold px-3 py-1 rounded-full">{property.bhk}</span>}
                  {property.reraRegistered && (
                    <span className="bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                      <ShieldCheck size={12} /> RERA {property.reraId ? `· ${property.reraId}` : "Registered"}
                    </span>
                  )}
                </div>

                <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl mb-2 leading-tight">{property.title}</h1>
                <p className="text-navy/60 dark:text-white/60 flex items-center gap-1.5 text-sm mb-4">
                  <MapPin size={14} /> {property.location}
                </p>

                <div className="flex flex-wrap items-end gap-x-6 gap-y-2 mb-4">
                  <p className="font-display text-3xl text-gold">{property.price}</p>
                  {property.pricePerSqft && <p className="text-sm text-navy/50 dark:text-white/50">{property.pricePerSqft}</p>}
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-navy/50 dark:text-white/50">
                  {property.propertyId && (
                    <span className="flex items-center gap-1"><Hash size={12} /> {property.propertyId}</span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> Posted {new Date(property.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
              </div>
            </div>

            {/* Sticky contact card (desktop) */}
            <div className="hidden lg:block">
              <div className="sticky top-24 space-y-3">
                {contact && <AgentCard agent={contact} companyName={companyName} />}
                <button
                  onClick={() => setModalSource("Enquire Now")}
                  className="w-full bg-gold text-navy font-semibold py-3.5 rounded-xl hover:shadow-gold transition-all"
                >
                  Enquire Now
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setModalSource("Contact Agent")}
                    className="flex items-center justify-center gap-1.5 border border-navy/15 dark:border-white/15 text-xs font-semibold py-2.5 rounded-lg hover:bg-navy/5 dark:hover:bg-white/5 transition"
                  >
                    <UserRound size={14} /> Contact Agent
                  </button>
                  <a
                    href={`https://wa.me/91${(whatsapp || "").replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 border border-[#25D366]/40 text-[#128C4A] text-xs font-semibold py-2.5 rounded-lg hover:bg-[#25D366]/10 transition"
                  >
                    <MessageCircle size={14} /> WhatsApp
                  </a>
                  <button
                    onClick={() => setModalSource("Book Site Visit")}
                    className="flex items-center justify-center gap-1.5 border border-navy/15 dark:border-white/15 text-xs font-semibold py-2.5 rounded-lg hover:bg-navy/5 dark:hover:bg-white/5 transition"
                  >
                    <CalendarCheck size={14} /> Schedule Visit
                  </button>
                  <button
                    onClick={handleDownloadBrochure}
                    className="flex items-center justify-center gap-1.5 border border-navy/15 dark:border-white/15 text-xs font-semibold py-2.5 rounded-lg hover:bg-navy/5 dark:hover:bg-white/5 transition"
                  >
                    <FileDown size={14} /> Brochure
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <StickyNavTabs sections={sections} />
        </div>

        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 space-y-16">
          {/* Overview */}
          <section id="overview">
            <h2 className="font-display text-xl sm:text-2xl mb-5">Overview</h2>
            <OverviewGrid p={property} />
          </section>

          {/* About */}
          {description && (
            <section>
              <h2 className="font-display text-xl sm:text-2xl mb-4">About This Property</h2>
              <p className="text-navy/70 dark:text-white/70 leading-relaxed whitespace-pre-line">{shownDesc}</p>
              {isLongDesc && (
                <button onClick={() => setDescExpanded((v) => !v)} className="mt-3 inline-flex items-center gap-1 text-gold font-semibold text-sm hover:underline">
                  {descExpanded ? "Read Less" : "Read More"} {descExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>
              )}
            </section>
          )}

          {/* Amenities */}
          {property.amenities?.length > 0 && (
            <section id="amenities">
              <h2 className="font-display text-xl sm:text-2xl mb-5">Amenities</h2>
              <IconTagGrid items={property.amenities} iconFor={amenityIcon} />
            </section>
          )}

          {/* Property Features */}
          {property.features?.length > 0 && (
            <section>
              <h2 className="font-display text-xl sm:text-2xl mb-5">Property Features</h2>
              <IconTagGrid items={property.features} iconFor={featureIcon} columns="grid-cols-2 sm:grid-cols-3" />
            </section>
          )}

          {/* Furnishing */}
          {property.furnishingItems?.length > 0 && (
            <section id="furnishing">
              <h2 className="font-display text-xl sm:text-2xl mb-5">Furnishing</h2>
              <IconTagGrid items={property.furnishingItems} iconFor={furnishingIcon} />
            </section>
          )}

          {/* Nearby Places */}
          {property.nearbyPlaces?.length > 0 && (
            <section id="nearby">
              <h2 className="font-display text-xl sm:text-2xl mb-5">Nearby Places</h2>
              <NearbyPlaces places={property.nearbyPlaces} />
            </section>
          )}

          {/* Location */}
          <section id="location">
            <h2 className="font-display text-xl sm:text-2xl mb-5">Location</h2>
            <div className="rounded-2xl overflow-hidden border border-navy/10 aspect-[16/9]">
              <iframe
                src={property.mapLink || settings?.mapLink || "https://www.google.com/maps?q=Greater%20Noida%20West&output=embed"}
                className="w-full h-full"
                style={{ border: 0 }}
                loading="lazy"
                title={`${property.title} location`}
              />
            </div>
          </section>

          {/* Price Details */}
          <section id="price">
            <h2 className="font-display text-xl sm:text-2xl mb-5">Price Details</h2>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-white/5 border border-navy/10 dark:border-white/10 rounded-2xl p-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-navy/60 dark:text-white/60">Property Price</span>
                  <span className="font-semibold">{property.price}</span>
                </div>
                {property.priceDetails?.bookingAmount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-navy/60 dark:text-white/60">Booking Amount</span>
                    <span className="font-semibold">{property.priceDetails.bookingAmount}</span>
                  </div>
                )}
                {property.priceDetails?.maintenance && (
                  <div className="flex justify-between text-sm">
                    <span className="text-navy/60 dark:text-white/60">Maintenance</span>
                    <span className="font-semibold">{property.priceDetails.maintenance}</span>
                  </div>
                )}
                {property.priceDetails?.registryCharges && (
                  <div className="flex justify-between text-sm">
                    <span className="text-navy/60 dark:text-white/60">Registry Charges</span>
                    <span className="font-semibold">{property.priceDetails.registryCharges}</span>
                  </div>
                )}
                {property.priceDetails?.stampDuty && (
                  <div className="flex justify-between text-sm">
                    <span className="text-navy/60 dark:text-white/60">Stamp Duty</span>
                    <span className="font-semibold">{property.priceDetails.stampDuty}</span>
                  </div>
                )}
              </div>
              <EMICalculator price={property.price} />
            </div>
          </section>

          {/* Documents */}
          {property.documents?.length > 0 && (
            <section id="documents">
              <h2 className="font-display text-xl sm:text-2xl mb-5">Property Documents</h2>
              <DocumentsList documents={property.documents} />
            </section>
          )}

          {/* Video */}
          {property.videoUrl && (
            <section>
              <h2 className="font-display text-xl sm:text-2xl mb-5">Property Video</h2>
              <VideoSection videoUrl={property.videoUrl} title={property.title} />
            </section>
          )}

          {/* Agent */}
          {contact && (
            <section id="agent">
              <h2 className="font-display text-xl sm:text-2xl mb-5">Agent Details</h2>
              <div className="grid lg:grid-cols-2 gap-6">
                <AgentCard agent={contact} companyName={companyName} />
                <div className="bg-white dark:bg-white/5 border border-navy/10 dark:border-white/10 rounded-2xl p-6">
                  <p className="font-display text-lg mb-4">Send a Quick Message</p>
                  <PropertyInquiryForm property={property} compact source="Contact Agent" />
                </div>
              </div>
            </section>
          )}

          {/* Builder Information */}
          {(property.builder || property.builderDescription) && (
            <section id="builder">
              <h2 className="font-display text-xl sm:text-2xl mb-5">Builder Information</h2>
              <div className="bg-white dark:bg-white/5 border border-navy/10 dark:border-white/10 rounded-2xl p-6 flex items-start gap-4">
                {property.builderLogo ? (
                  <img src={property.builderLogo} alt={property.builder} className="w-16 h-16 rounded-xl object-cover shrink-0 border border-navy/10" />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-navy/5 dark:bg-white/10 flex items-center justify-center shrink-0">
                    <Building2 size={24} className="text-navy/30 dark:text-white/30" />
                  </div>
                )}
                <div>
                  <p className="font-display text-lg mb-1">{property.builder || "Builder"}</p>
                  {property.projectName && <p className="text-xs text-gold uppercase tracking-wide mb-2">{property.projectName}</p>}
                  {property.builderDescription && (
                    <p className="text-sm text-navy/60 dark:text-white/60 leading-relaxed">{property.builderDescription}</p>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Owner Information */}
          {owner && (
            <section id="owner">
              <h2 className="font-display text-xl sm:text-2xl mb-5">Owner Information</h2>
              <div className="bg-white dark:bg-white/5 border border-navy/10 dark:border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-navy/10 bg-navy/5 flex items-center justify-center shrink-0">
                    {owner.photo ? <img src={owner.photo} alt={owner.name} className="w-full h-full object-cover" /> : <UserRound className="text-navy/30" size={26} />}
                  </div>
                  <div>
                    <p className="font-display text-lg leading-tight">{owner.name}</p>
                    <p className="text-xs text-gold uppercase tracking-wide">{owner.designation}</p>
                    {owner.experience && <p className="text-[11px] text-navy/40 dark:text-white/40 mt-0.5">{owner.experience} Experience</p>}
                  </div>
                </div>
                {owner.description && <p className="text-sm text-navy/60 dark:text-white/60 leading-relaxed mb-4">{owner.description}</p>}
                <div className="flex flex-wrap gap-2">
                  {owner.phone && (
                    <a href={`tel:+91${owner.phone.replace(/\D/g, "")}`} className="flex items-center gap-1.5 text-xs font-semibold border border-navy/15 dark:border-white/15 px-3 py-2 rounded-lg hover:bg-navy/5 dark:hover:bg-white/5">
                      <Phone size={13} /> {owner.phone}
                    </a>
                  )}
                  {owner.email && (
                    <a href={`mailto:${owner.email}`} className="flex items-center gap-1.5 text-xs font-semibold border border-navy/15 dark:border-white/15 px-3 py-2 rounded-lg hover:bg-navy/5 dark:hover:bg-white/5">
                      <Mail size={13} /> {owner.email}
                    </a>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Company Information */}
          {settings && (
            <section id="company">
              <h2 className="font-display text-xl sm:text-2xl mb-5">Company Information</h2>
              <div className="bg-white dark:bg-white/5 border border-navy/10 dark:border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  {settings.companyLogo ? (
                    <img src={settings.companyLogo} alt={companyName} className="w-14 h-14 rounded-xl object-cover shrink-0 border border-navy/10" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-navy/5 dark:bg-white/10 flex items-center justify-center shrink-0">
                      <Building2 size={22} className="text-navy/30 dark:text-white/30" />
                    </div>
                  )}
                  <p className="font-display text-lg">{companyName}</p>
                </div>
                {settings.aboutCompany && <p className="text-sm text-navy/60 dark:text-white/60 leading-relaxed mb-4">{settings.aboutCompany}</p>}
                <div className="grid sm:grid-cols-2 gap-2 text-xs text-navy/60 dark:text-white/60">
                  {settings.address && <p className="flex items-center gap-1.5"><MapPin size={13} /> {settings.address}</p>}
                  {settings.officeTiming && <p className="flex items-center gap-1.5"><Calendar size={13} /> {settings.officeTiming}</p>}
                  {settings.phone1 && <p className="flex items-center gap-1.5"><Phone size={13} /> {settings.phone1}</p>}
                  {settings.email && <p className="flex items-center gap-1.5"><Mail size={13} /> {settings.email}</p>}
                </div>
              </div>
            </section>
          )}

          {/* Reviews */}
          <section id="reviews">
            <h2 className="font-display text-xl sm:text-2xl mb-5">Reviews</h2>
            <div className="bg-white dark:bg-white/5 border border-navy/10 dark:border-white/10 rounded-2xl p-8 text-center">
              <p className="text-navy/60 dark:text-white/60 text-sm mb-4">No reviews yet for this property.</p>
              <button onClick={() => setModalSource("Enquire Now")} className="text-gold font-semibold text-sm hover:underline">
                Visited this property? Get in touch to share your experience
              </button>
            </div>
          </section>

          {/* Similar Properties */}
          <section id="similar">
            <SimilarProperties currentId={property._id} type={property.type} />
          </section>
        </div>

        {/* Mobile sticky bar */}
        <StickyMobileBar
          phone={phone}
          whatsapp={whatsapp}
          phoneRevealed={phoneRevealed}
          onViewPhone={() => setPhoneRevealed(true)}
          onBookVisit={() => setModalSource("Book Site Visit")}
          onEnquire={() => setModalSource("Enquire Now")}
        />

        {modalSource && (
          <EnquiryModal
            property={property}
            source={modalSource}
            onClose={() => setModalSource(null)}
            onSuccess={() => {
              if (modalSource === "Download Brochure" && pendingBrochureUrl) {
                window.open(pendingBrochureUrl, "_blank", "noopener,noreferrer");
              }
            }}
          />
        )}
      </div>
    </div>
  );
}
