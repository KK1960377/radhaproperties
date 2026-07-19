import { useState } from "react";
import { Send, CalendarCheck } from "lucide-react";
import api from "../../api/axios";

/**
 * Generic lead-capture form used across every trigger point on the
 * Property Detail page (Enquire Now, Book Site Visit, Contact Agent,
 * Download Brochure, Request Callback). The `source` prop is stamped onto
 * the inquiry so the admin panel can tell them apart.
 */
export default function PropertyInquiryForm({
  property,
  onSuccess,
  compact = false,
  source = "Enquire Now",
  minimal = false, // only Name + Phone — used for quick Callback / Brochure capture
  showDateField = false, // Book Site Visit — lets the visitor suggest a date/time
  submitLabel = "Submit Enquiry",
}) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", city: "", budget: "", message: "", preferredDate: "" });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Name and phone are required.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/inquiries", {
        ...form,
        interest: property?.type,
        property: property?._id,
        propertyTitle: property?.title,
        propertyPrice: property?.price,
        propertyType: property?.type,
        source,
      });
      setSent(true);
      onSuccess?.();
    } catch (err) {
      setError(err?.response?.data?.message || "Could not submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="text-center py-8">
        <p className="font-display text-xl mb-2">Thank you, {form.name.split(" ")[0]}!</p>
        <p className="text-navy/60 text-sm">Our team will reach out to you shortly about {property?.title}.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? "space-y-3" : "space-y-3.5"}>
      {property && (
        <div className="bg-navy/5 rounded-xl px-4 py-3 text-xs text-navy/60">
          {source === "Download Brochure" ? "Requesting brochure for" : "Enquiring about"}{" "}
          <span className="font-semibold text-navy">{property.title}</span> · {property.price}
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-3">
        <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Full Name *"
          className="bg-white border border-navy/10 rounded-xl px-4 py-3 text-sm w-full" />
        <input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="Phone Number *"
          className="bg-white border border-navy/10 rounded-xl px-4 py-3 text-sm w-full" />
        {!minimal && (
          <>
            <input value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="Email" type="email"
              className="bg-white border border-navy/10 rounded-xl px-4 py-3 text-sm w-full" />
            <input value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="City"
              className="bg-white border border-navy/10 rounded-xl px-4 py-3 text-sm w-full" />
            <input value={form.budget} onChange={(e) => update("budget", e.target.value)} placeholder="Budget (optional)"
              className="bg-white border border-navy/10 rounded-xl px-4 py-3 text-sm w-full sm:col-span-2" />
          </>
        )}
      </div>
      {showDateField && (
        <input value={form.preferredDate} onChange={(e) => update("preferredDate", e.target.value)} placeholder="Preferred visit date & time (e.g. 22 Jul, 11:00 AM)"
          className="bg-white border border-navy/10 rounded-xl px-4 py-3 text-sm w-full" />
      )}
      {!minimal && (
        <textarea rows={3} placeholder="Message (optional)" value={form.message} onChange={(e) => update("message", e.target.value)}
          className="bg-white border border-navy/10 rounded-xl px-4 py-3 text-sm w-full" />
      )}
      {error && <p className="text-red-500 text-xs">{error}</p>}
      <button disabled={submitting} className="w-full bg-navy text-paper py-3.5 rounded-xl font-semibold text-sm hover:shadow-gold transition-all flex items-center justify-center gap-2 disabled:opacity-60">
        {submitting ? "Sending..." : submitLabel} {showDateField ? <CalendarCheck size={15} /> : <Send size={15} />}
      </button>
    </form>
  );
}
