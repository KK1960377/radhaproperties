import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Phone, Mail } from "lucide-react";
import api from "../api/axios";

const FALLBACK_OWNER_PHOTO =
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop";

export default function About({ settings }) {
  // undefined = not fetched yet, null = admin explicitly deactivated the section
  const [owner, setOwner] = useState(undefined);

  useEffect(() => {
    api
      .get("/owner")
      .then((res) => setOwner(res.data))
      .catch(() => setOwner(false)); // false = request failed, fall back to legacy fields
  }, []);

  // Admin turned the Owner Profile section off — respect that and hide it.
  if (owner === null) return null;

  const usingOwnerProfile = owner && owner !== false;

  // Prefer the dedicated Owner Profile (Admin > Company Management > Owner
  // Profile), falling back to the legacy Settings-based owner fields while
  // loading or if the request failed, so nothing breaks either way.
  const ownerName = (usingOwnerProfile ? owner.name : settings?.ownerName || settings?.dealerName) || "Ravindra Kumar";
  const ownerPhoto = (usingOwnerProfile ? owner.photo : settings?.ownerPhoto) || FALLBACK_OWNER_PHOTO;
  const ownerDesignation = (usingOwnerProfile ? owner.designation : settings?.ownerDesignation) || "Founder & Chief Consultant";
  const ownerExperience = usingOwnerProfile ? owner.experience : "10+ Years";
  const ownerPhone = (usingOwnerProfile ? owner.phone : settings?.ownerPhone) || settings?.phone1 || "";
  const ownerEmail = (usingOwnerProfile ? owner.email : settings?.ownerEmail) || settings?.email || "";
  const ownerDescription =
    (usingOwnerProfile ? owner.description : settings?.ownerDescription) ||
    "A consultant who treats your address like it's his own — guiding families and investors across Greater Noida West for over a decade.";
  const buttonText = (usingOwnerProfile && owner.buttonText) || "Book a Consultation";
  const buttonLink = (usingOwnerProfile && owner.buttonLink) || "#contact";

  const companyName = settings?.companyName || "Radha Homes Properties";
  const aboutCompany =
    settings?.aboutCompany ||
    `Founded by ${ownerName}, ${companyName} has spent over a decade matching families and investors with the right home across Gaur City. What began as word-of-mouth referrals has grown into one of the most trusted independent consultancies in Greater Noida West — built on transparent pricing, verified paperwork and honest advice.`;
  const areas = ["Gaur City 1", "Gaur City 2", "Noida Extension", "Greater Noida West"];

  return (
    <section id="about" className="max-w-7xl mx-auto px-5 sm:px-8 py-24 grid lg:grid-cols-2 gap-16 items-center">
      <div className="relative">
        <Link to="/owner" className="block rounded-3xl overflow-hidden aspect-[4/5] relative group">
          <img
            src={ownerPhoto}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            alt={`${ownerName} portrait`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <p className="font-display text-lg">{ownerName}</p>
            <p className="text-xs text-white/80 uppercase tracking-wide">{ownerDesignation}</p>
            {(ownerPhone || ownerEmail) && (
              <div className="flex flex-wrap gap-4 mt-2 text-xs">
                {ownerPhone && (
                  <a href={`tel:+91${ownerPhone.replace(/\D/g, "")}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-1.5 hover:text-gold">
                    <Phone size={12} /> {ownerPhone}
                  </a>
                )}
                {ownerEmail && (
                  <a href={`mailto:${ownerEmail}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-1.5 hover:text-gold">
                    <Mail size={12} /> {ownerEmail}
                  </a>
                )}
              </div>
            )}
          </div>
        </Link>
        {ownerExperience && (
          <div className="bg-white/90 backdrop-blur rounded-2xl p-6 absolute -bottom-8 -right-4 sm:-right-8 w-56 shadow-xl">
            <p className="font-display text-3xl text-gold">{ownerExperience}</p>
            <p className="text-xs text-navy/70 mt-1">Guiding families home in Greater Noida West</p>
          </div>
        )}
      </div>

      <div>
        <p className="text-gold uppercase tracking-[0.3em] text-xs mb-3">About {companyName}</p>
        <h2 className="font-display text-3xl sm:text-5xl mb-6 leading-tight">
          A consultant who treats your address like it's his own.
        </h2>
        <p className="text-navy/70 leading-relaxed mb-4">{aboutCompany}</p>
        {ownerDescription && (
          <p className="text-navy/70 leading-relaxed mb-6 italic">"{ownerDescription}" — {ownerName}</p>
        )}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {areas.map((a) => (
            <div key={a} className="flex items-center gap-3">
              <CheckCircle2 className="text-gold" size={20} />
              <span className="text-sm">{a}</span>
            </div>
          ))}
        </div>
        <a href={buttonLink} className="inline-flex items-center gap-2 bg-navy text-paper px-7 py-3.5 rounded-full font-semibold text-sm hover:shadow-gold transition-all">
          {buttonText}
        </a>
      </div>
    </section>
  );
}
