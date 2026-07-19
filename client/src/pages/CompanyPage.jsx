import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Phone, Mail, MessageCircle, MapPin, Clock, Facebook, Instagram, Youtube, Linkedin, Twitter } from "lucide-react";
import api from "../api/axios";

export default function CompanyPage() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get("/settings").then((res) => setSettings(res.data)).catch(() => {});
  }, []);

  if (!settings) {
    return (
      <div className="min-h-screen bg-paper px-5 sm:px-8 py-24">
        <p className="text-navy/50 text-sm">Loading...</p>
      </div>
    );
  }

  const socials = [
    { icon: Facebook, href: settings.facebook },
    { icon: Instagram, href: settings.instagram },
    { icon: Youtube, href: settings.youtube },
    { icon: Linkedin, href: settings.linkedin },
    { icon: Twitter, href: settings.twitter },
  ].filter((s) => s.href);

  return (
    <div className="min-h-screen bg-paper">
      <header className="px-5 sm:px-8 py-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-navy/70 hover:text-gold transition">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </header>
      <main className="max-w-3xl mx-auto px-5 sm:px-8 pb-24">
        <div className="flex items-center gap-4 mb-8">
          {settings.companyLogo && (
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-navy/10 shrink-0">
              <img src={settings.companyLogo} alt={settings.companyName} className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <p className="text-gold uppercase tracking-[0.3em] text-xs mb-2">About The Company</p>
            <h1 className="font-display text-3xl sm:text-4xl">{settings.companyName}</h1>
          </div>
        </div>

        {settings.aboutCompany && <p className="text-navy/70 leading-relaxed mb-10 text-base">{settings.aboutCompany}</p>}

        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {settings.phone1 && (
            <a href={`tel:+91${settings.phone1.replace(/\D/g, "")}`} className="flex items-center gap-3 bg-white border border-navy/10 rounded-xl px-4 py-3.5 text-sm hover:border-gold transition">
              <Phone size={18} className="text-gold" /> {settings.phone1}
            </a>
          )}
          {settings.whatsapp && (
            <a href={`https://wa.me/91${settings.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-white border border-navy/10 rounded-xl px-4 py-3.5 text-sm hover:border-gold transition">
              <MessageCircle size={18} className="text-gold" /> WhatsApp
            </a>
          )}
          {settings.email && (
            <a href={`mailto:${settings.email}`} className="flex items-center gap-3 bg-white border border-navy/10 rounded-xl px-4 py-3.5 text-sm hover:border-gold transition sm:col-span-2">
              <Mail size={18} className="text-gold" /> {settings.email}
            </a>
          )}
          {settings.address && (
            <p className="flex items-center gap-3 text-sm text-navy/60 sm:col-span-2">
              <MapPin size={18} className="text-gold shrink-0" /> {settings.address}
            </p>
          )}
          {settings.officeTiming && (
            <p className="flex items-center gap-3 text-sm text-navy/60 sm:col-span-2">
              <Clock size={18} className="text-gold shrink-0" /> {settings.officeTiming}
            </p>
          )}
        </div>

        {socials.length > 0 && (
          <div className="flex items-center gap-3">
            {socials.map(({ icon: Icon, href }, i) => (
              <a key={i} href={href} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center hover:bg-navy hover:text-white transition">
                <Icon size={16} />
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
