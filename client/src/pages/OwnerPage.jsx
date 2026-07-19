import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Phone, Mail, MessageCircle, MapPin, UserRound } from "lucide-react";
import api from "../api/axios";

export default function OwnerPage() {
  const [owner, setOwner] = useState(undefined);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get("/owner").then((res) => setOwner(res.data)).catch(() => setOwner(null));
  }, []);

  return (
    <div className="min-h-screen bg-paper">
      <header className="px-5 sm:px-8 py-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-navy/70 hover:text-gold transition">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </header>
      <main className="max-w-4xl mx-auto px-5 sm:px-8 pb-24">
        {owner === undefined ? (
          <p className="text-navy/50 text-sm">Loading...</p>
        ) : !owner ? (
          <p className="text-navy/50 text-sm">Owner profile is not available right now.</p>
        ) : (
          <div className="grid sm:grid-cols-5 gap-10 items-start">
            <div className="sm:col-span-2">
              <div className="rounded-3xl overflow-hidden aspect-square border border-navy/10 bg-white">
                {owner.photo ? (
                  <img src={owner.photo} alt={owner.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-navy/5">
                    <UserRound className="text-navy/30" size={72} />
                  </div>
                )}
              </div>
            </div>
            <div className="sm:col-span-3">
              <p className="text-gold uppercase tracking-[0.3em] text-xs mb-3">Meet The Owner</p>
              <h1 className="font-display text-3xl sm:text-4xl mb-2">{owner.name}</h1>
              <p className="text-navy/60 font-medium mb-1">{owner.designation}</p>
              {owner.experience && <p className="text-navy/40 text-sm mb-6">{owner.experience} Experience</p>}
              {owner.description && <p className="text-navy/70 leading-relaxed mb-8">{owner.description}</p>}

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {owner.phone && (
                  <a href={`tel:+91${owner.phone.replace(/\D/g, "")}`} className="flex items-center gap-3 bg-white border border-navy/10 rounded-xl px-4 py-3.5 text-sm hover:border-gold transition">
                    <Phone size={18} className="text-gold" /> {owner.phone}
                  </a>
                )}
                {(owner.whatsapp || owner.phone) && (
                  <a href={`https://wa.me/91${(owner.whatsapp || owner.phone).replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-white border border-navy/10 rounded-xl px-4 py-3.5 text-sm hover:border-gold transition">
                    <MessageCircle size={18} className="text-gold" /> WhatsApp
                  </a>
                )}
                {owner.email && (
                  <a href={`mailto:${owner.email}`} className="flex items-center gap-3 bg-white border border-navy/10 rounded-xl px-4 py-3.5 text-sm hover:border-gold transition sm:col-span-2">
                    <Mail size={18} className="text-gold" /> {owner.email}
                  </a>
                )}
                {owner.address && (
                  <p className="flex items-center gap-3 text-sm text-navy/60 sm:col-span-2">
                    <MapPin size={18} className="text-gold shrink-0" /> {owner.address}
                  </p>
                )}
              </div>

              {owner.buttonText && (
                <a href={owner.buttonLink || "#"} className="inline-flex items-center gap-2 bg-navy text-paper px-7 py-3.5 rounded-full font-semibold text-sm hover:shadow-gold transition-all">
                  {owner.buttonText}
                </a>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
