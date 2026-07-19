import { useEffect, useState } from "react";
import { KeyRound, Banknote, CalendarClock, ChevronLeft, ChevronRight } from "lucide-react";
import api from "../api/axios";

const DEFAULT_SLIDE = {
  image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1920&auto=format&fit=crop",
  title: "Find a home worthy of your story.",
  subtitle: "Your Trusted Property Partner in Greater Noida — curated apartments, villas & commercial addresses across Gaur City 1 & 2, Noida Extension.",
  buttonText: "",
  buttonLink: "",
};

export default function Hero() {
  const [slides, setSlides] = useState([DEFAULT_SLIDE]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    api
      .get("/home-content")
      .then((res) => {
        if (res.data?.heroSlides?.length) setSlides(res.data.heroSlides);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  const slide = slides[idx] || DEFAULT_SLIDE;
  // Render the title as italic-gold on the last word to match the original design,
  // only when using the default (untitled admin slides just render plainly).
  const isDefault = slide === DEFAULT_SLIDE;

  return (
    <section id="home" className="relative min-h-[85vh] flex items-end overflow-hidden bg-navy-deep">
      <div className="absolute inset-0">
        <img
          key={slide.image}
          src={slide.image}
          className="w-full h-full object-cover scale-105 transition-opacity duration-700"
          alt={slide.title || "Hero banner"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-[#0B0B0D]/70 to-[#0B0B0D]/20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pb-20 pt-40 w-full">
        <p className="text-gold uppercase tracking-[0.35em] text-xs sm:text-sm mb-5 flex items-center gap-3">
          <span className="w-8 h-px bg-gold" /> Gaur City 2 · Greater Noida West
        </p>
        <h1 className="font-display text-white text-4xl sm:text-6xl lg:text-7xl leading-[1.05] max-w-3xl">
          {isDefault ? (
            <>Find a home worthy <span className="italic text-gold">of your story.</span></>
          ) : (
            slide.title
          )}
        </h1>
        {slide.subtitle && <p className="text-white/70 max-w-xl mt-6 text-base sm:text-lg">{slide.subtitle}</p>}

        <div className="flex flex-wrap gap-4 mt-9">
          {slide.buttonText ? (
            <a href={slide.buttonLink || "#properties"} className="bg-gold text-navy px-7 py-3.5 rounded-full font-semibold text-sm flex items-center gap-2 hover:shadow-gold transition-all">
              <KeyRound size={16} /> {slide.buttonText}
            </a>
          ) : (
            <>
              <a href="#properties" className="bg-gold text-navy px-7 py-3.5 rounded-full font-semibold text-sm flex items-center gap-2 hover:shadow-gold transition-all">
                <KeyRound size={16} /> Buy Property
              </a>
              <a href="#contact" className="bg-white/15 backdrop-blur text-white px-7 py-3.5 rounded-full font-semibold text-sm flex items-center gap-2 hover:bg-white/20 transition-all">
                <Banknote size={16} /> Sell Property
              </a>
              <a href="#properties" className="border border-white/30 text-white px-7 py-3.5 rounded-full font-semibold text-sm flex items-center gap-2 hover:bg-white/10 transition-all">
                <CalendarClock size={16} /> Rent Property
              </a>
            </>
          )}
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button onClick={() => setIdx((i) => (i - 1 + slides.length) % slides.length)} className="hidden sm:flex absolute left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 items-center justify-center text-white">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => setIdx((i) => (i + 1) % slides.length)} className="hidden sm:flex absolute right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 items-center justify-center text-white">
            <ChevronRight size={18} />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)} className={`w-2.5 h-2.5 rounded-full ${i === idx ? "bg-gold" : "bg-white/30"}`} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
