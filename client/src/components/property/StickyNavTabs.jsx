import { useEffect, useRef, useState } from "react";

export default function StickyNavTabs({ sections }) {
  const [active, setActive] = useState(sections[0]?.id);
  const tabsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-140px 0px -70% 0px", threshold: 0 }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  function scrollTo(id) {
    const el = document.getElementById(id);
    if (el) {
      const offset = 120;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }

  return (
    <div className="sticky top-16 sm:top-20 z-30 bg-paper/95 backdrop-blur border-b border-navy/10">
      <div ref={tabsRef} className="max-w-7xl mx-auto px-5 sm:px-8 flex gap-1 overflow-x-auto no-scrollbar">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className={`shrink-0 px-4 py-3.5 text-sm font-semibold border-b-2 transition whitespace-nowrap ${
              active === s.id ? "border-gold text-navy" : "border-transparent text-navy/50 hover:text-navy"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
