import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import api from "../api/axios";

const FALLBACK_TESTIMONIALS = [
  { name: "Ritu Sharma", location: "Gaur City 2 Resident", text: "Radha Homes Properties made buying our first flat completely stress-free — every document was checked twice before we even asked.", rating: 5 },
  { name: "Vikram Singh", location: "Investor, Noida Extension", text: "Honest pricing advice and zero pressure. Sold my property within three weeks at a fair value.", rating: 5 },
  { name: "Anjali & Rohit", location: "Gaur City 1 Residents", text: "From site visits to registry, the team personally handled everything. Truly a trusted partner.", rating: 5 },
  { name: "Deepak Verma", location: "Shop Owner, Gaur City Market", text: "Got a home loan approved in record time thanks to their bank tie-ups. Highly recommend.", rating: 5 },
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState(FALLBACK_TESTIMONIALS);
  const [i, setI] = useState(0);

  useEffect(() => {
    api
      .get("/testimonials")
      .then((res) => {
        if (res.data?.length) setTestimonials(res.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const t = setInterval(() => setI((cur) => (cur + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, [testimonials.length]);

  const t = testimonials[i] || testimonials[0];

  return (
    <section id="testimonials" className="bg-navy text-paper py-24">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
        <p className="text-gold uppercase tracking-[0.3em] text-xs mb-3">Client Stories</p>
        <h2 className="font-display text-3xl sm:text-5xl mb-14">What Families Say</h2>

        <div className="min-h-[200px] flex flex-col items-center justify-center">
          {t.photo && (
            <div className="w-14 h-14 rounded-full overflow-hidden border border-gold/40 mb-4">
              <img src={t.photo} alt={t.name} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex gap-1 mb-4">
            {Array.from({ length: t.rating || 5 }).map((_, idx) => (
              <Star key={idx} size={16} className="text-gold fill-gold" />
            ))}
          </div>
          <p className="font-display text-xl sm:text-2xl leading-relaxed max-w-2xl">"{t.text}"</p>
          <p className="text-gold mt-6 font-semibold text-sm">{t.name}</p>
          <p className="text-white/50 text-xs">{t.location}</p>
        </div>

        <div className="flex justify-center gap-2 mt-10">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              className={`w-2.5 h-2.5 rounded-full ${idx === i ? "bg-gold" : "bg-white/20"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
