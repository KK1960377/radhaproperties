import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Counters() {
  const [counters, setCounters] = useState([]);

  useEffect(() => {
    api
      .get("/home-content")
      .then((res) => setCounters(res.data?.counters || []))
      .catch(() => {});
  }, []);

  if (counters.length === 0) return null;

  return (
    <section className="bg-navy text-paper py-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
        {counters.map((c, i) => (
          <div key={i}>
            <p className="font-display text-3xl sm:text-4xl text-gold">
              {c.value}{c.suffix}
            </p>
            <p className="text-xs sm:text-sm text-white/60 mt-2">{c.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
