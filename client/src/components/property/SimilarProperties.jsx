import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import api from "../../api/axios";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=900&auto=format&fit=crop";

export default function SimilarProperties({ currentId, type }) {
  const [items, setItems] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!type) return;
    api
      .get("/properties", { params: { type } })
      .then((res) => setItems(res.data.filter((p) => p._id !== currentId).slice(0, 8)))
      .catch(() => {});
  }, [currentId, type]);

  function scroll(dir) {
    scrollRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  }

  if (items.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display text-xl sm:text-2xl">Similar Properties</h3>
        <div className="hidden sm:flex gap-2">
          <button onClick={() => scroll(-1)} className="w-9 h-9 rounded-full border border-navy/15 flex items-center justify-center hover:bg-navy/5">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => scroll(1)} className="w-9 h-9 rounded-full border border-navy/15 flex items-center justify-center hover:bg-navy/5">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-5 overflow-x-auto pb-2 snap-x">
        {items.map((p) => (
          <Link
            key={p._id}
            to={`/property/${p._id}`}
            className="shrink-0 w-64 sm:w-72 rounded-2xl overflow-hidden bg-white border border-navy/5 card-hover snap-start"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img src={p.imgs?.[0] || FALLBACK_IMG} alt={p.title} loading="lazy" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <p className="font-display text-sm leading-snug mb-1 line-clamp-1">{p.title}</p>
              <p className="text-gold font-semibold text-sm mb-1">{p.price}</p>
              <p className="text-[11px] text-navy/50 flex items-center gap-1">
                <MapPin size={11} /> {p.location}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
