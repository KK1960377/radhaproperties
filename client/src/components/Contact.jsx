import { useState } from "react";
import { UserRound, MapPin, Phone, MessageCircle, Mail, Send } from "lucide-react";
import api from "../api/axios";

function formatPhone(p) {
  const digits = (p || "").replace(/\D/g, "");
  return digits.length === 10 ? `${digits.slice(0, 5)} ${digits.slice(5)}` : digits;
}

export default function Contact({ settings }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", interest: "", message: "" });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const phone1 = settings?.phone1 || "8851142540";
  const phone2 = settings?.phone2 || "9540122984";
  const dealerName = settings?.ownerName || settings?.dealerName || "Ravindra Kumar";
  const email = settings?.email || "hello@radhaproperties.in";
  const address = settings?.address || "Gaur City 2, Greater Noida West, UP";
  const companyName = settings?.companyName || "Radha Homes Properties";
  const mapLink =
    settings?.mapLink ||
    "https://www.google.com/maps?q=Gaur%20City%202%20Greater%20Noida%20West&output=embed";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post("/inquiries", form);
      setSent(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Could not send enquiry. Please try again or call us directly.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="contact" className="max-w-7xl mx-auto px-5 sm:px-8 py-24 grid lg:grid-cols-2 gap-14">
      <div>
        <p className="text-gold uppercase tracking-[0.3em] text-xs mb-3">Get In Touch</p>
        <h2 className="font-display text-3xl sm:text-5xl mb-6">Let's Find Your Address</h2>
        <p className="text-navy/60 mb-8">Tell us what you're looking for — a consultant will respond within a few hours.</p>

        {sent ? (
          <p className="bg-emerald-50 text-emerald-700 text-sm rounded-xl px-4 py-3.5">
            Thank you! Aapki enquiry mil gayi hai, team jaldi contact karegi.
          </p>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid sm:grid-cols-2 gap-4">
              <input required placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-white border border-navy/10 rounded-xl px-4 py-3.5 text-sm w-full" />
              <input required placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="bg-white border border-navy/10 rounded-xl px-4 py-3.5 text-sm w-full" />
            </div>
            <input type="email" placeholder="Email Address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="bg-white border border-navy/10 rounded-xl px-4 py-3.5 text-sm w-full" />
            <select value={form.interest} onChange={(e) => setForm({ ...form, interest: e.target.value })}
              className="bg-white border border-navy/10 rounded-xl px-4 py-3.5 text-sm w-full">
              <option value="">I'm interested in...</option>
              <option>Buying a Property</option>
              <option>Selling a Property</option>
              <option>Renting a Property</option>
              <option>Investment Advice</option>
            </select>
            <textarea rows={4} placeholder="Tell us about your requirement" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="bg-white border border-navy/10 rounded-xl px-4 py-3.5 text-sm w-full" />
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button disabled={submitting} className="w-full bg-navy text-paper py-4 rounded-xl font-semibold text-sm hover:shadow-gold transition-all flex items-center justify-center gap-2 disabled:opacity-60">
              {submitting ? "Sending..." : "Send Enquiry"} <Send size={16} />
            </button>
          </form>
        )}

        <div className="grid sm:grid-cols-2 gap-4 mt-10">
          <div className="flex items-center gap-3"><UserRound className="text-gold" size={20} /><span className="text-sm">Dealer: {dealerName}</span></div>
          <div className="flex items-center gap-3"><MapPin className="text-gold shrink-0" size={20} /><span className="text-sm">{address}</span></div>
          <div className="flex items-center gap-3">
            <Phone className="text-gold shrink-0" size={20} />
            <span className="text-sm">
              Call: <a href={`tel:+91${phone1}`} className="hover:text-gold">+91 {formatPhone(phone1)}</a>,{" "}
              <a href={`tel:+91${phone2}`} className="hover:text-gold">+91 {formatPhone(phone2)}</a>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <MessageCircle className="text-gold shrink-0" size={20} />
            <span className="text-sm">
              WhatsApp: <a href={`https://wa.me/91${phone1}`} target="_blank" rel="noreferrer" className="hover:text-gold">{formatPhone(phone1)}</a>,{" "}
              <a href={`https://wa.me/91${phone2}`} target="_blank" rel="noreferrer" className="hover:text-gold">{formatPhone(phone2)}</a>
            </span>
          </div>
          <div className="flex items-center gap-3 sm:col-span-2"><Mail className="text-gold shrink-0" size={20} /><span className="text-sm">{email}</span></div>
        </div>
      </div>

      <div className="rounded-3xl overflow-hidden min-h-[420px] border border-navy/10">
        <iframe
          src={mapLink}
          className="w-full h-full min-h-[420px]"
          style={{ border: 0 }}
          loading="lazy"
          title={`${companyName} Office Location`}
        />
      </div>
    </section>
  );
}
