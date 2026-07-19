import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import api from "../api/axios";

const FALLBACK_FAQS = [
  { question: "Do you only deal in Gaur City properties?", answer: "Our core focus is Gaur City 1 & 2, but we actively cover all of Greater Noida West including Noida Extension." },
  { question: "Are all listed properties RERA registered?", answer: "Yes — we verify RERA registration and title documents before any property is listed or shown to clients." },
  { question: "Can you help with home loans?", answer: "Yes, we have direct tie-ups with leading banks and NBFCs to get you the best rate and fastest approval." },
  { question: "What are your service charges?", answer: "Brokerage is charged only on successful transactions, discussed transparently upfront — no hidden fees." },
  { question: "Do you assist NRIs in buying property?", answer: "Absolutely. We offer remote consultations, video walkthroughs, and full documentation support for NRI clients." },
];

export default function FAQ() {
  const [faqs, setFaqs] = useState(FALLBACK_FAQS);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    api
      .get("/faqs")
      .then((res) => {
        if (res.data?.length) setFaqs(res.data);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="faqs" className="bg-gold-light/30 py-24">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <p className="text-gold uppercase tracking-[0.3em] text-xs mb-3 text-center">Questions</p>
        <h2 className="font-display text-3xl sm:text-5xl text-center mb-14">Frequently Asked</h2>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={f._id || f.question} className="bg-white rounded-2xl border border-navy/10 overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-medium text-sm sm:text-base pr-4">{f.question}</span>
                <Plus size={16} className={`text-gold shrink-0 transition-transform ${open === i ? "rotate-45" : ""}`} />
              </button>
              {open === i && (
                <p className="px-6 pb-5 text-sm text-navy/60 leading-relaxed">{f.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
