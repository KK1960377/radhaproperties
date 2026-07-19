import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Partners() {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    api
      .get("/home-content")
      .then((res) => setPartners(res.data?.partners || []))
      .catch(() => {});
  }, []);

  if (partners.length === 0) return null;

  return (
    <section className="py-16 border-t border-navy/5">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <p className="text-center text-xs uppercase tracking-[0.3em] text-navy/40 mb-10">Trusted By Leading Builders</p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {partners.map((p, i) => {
            const img = <img key={i} src={p.logo} alt={p.name} title={p.name} className="h-10 sm:h-12 object-contain grayscale hover:grayscale-0 transition opacity-70 hover:opacity-100" />;
            return p.link ? (
              <a key={i} href={p.link} target="_blank" rel="noreferrer">{img}</a>
            ) : (
              img
            );
          })}
        </div>
      </div>
    </section>
  );
}
