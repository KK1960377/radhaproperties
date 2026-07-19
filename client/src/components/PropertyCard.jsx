import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, MapPin, Ruler, BedDouble, Bath, Car, Heart } from "lucide-react";
import { useFavorites } from "../utils/favorites";

const statusColor = {
  "Ready to Move": "bg-emerald-500",
  "Under Construction": "bg-amber-500",
  "New Launch": "bg-navy",
};

export default function PropertyCard({ p }) {
  const [idx, setIdx] = useState(0);
  const { isFavorite, toggleFavorite } = useFavorites();
  const imgs = p.imgs?.length ? p.imgs : ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=900&auto=format&fit=crop"];

  function slide(dir) {
    setIdx((cur) => {
      let next = cur + dir;
      if (next < 0) next = imgs.length - 1;
      if (next > imgs.length - 1) next = 0;
      return next;
    });
  }

  return (
    <div className="card-hover rounded-3xl overflow-hidden bg-white border border-navy/5">
      <Link to={`/property/${p._id}`} className="relative aspect-[4/3] overflow-hidden group block">
        <div
          className="flex h-full transition-transform duration-500"
          style={{ transform: `translateX(-${idx * 100}%)` }}
        >
          {imgs.map((src, i) => (
            <img key={i} loading="lazy" src={src} className="w-full h-full object-cover shrink-0" style={{ minWidth: "100%" }} />
          ))}
        </div>
        <div className={`absolute top-3 left-3 ${statusColor[p.status] || "bg-navy"} text-white text-[11px] font-semibold px-3 py-1 rounded-full`}>
          {p.status}
        </div>
        <div className="absolute top-3 right-3 bg-black/40 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
          {p.type}
        </div>
        {(p.premium || p.hot) && (
          <div className="absolute top-11 left-3 flex flex-col gap-1.5">
            {p.premium && <span className="bg-gold text-navy text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">Premium</span>}
            {p.hot && <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">Hot</span>}
          </div>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(p._id);
          }}
          title="Save to Favorites"
          className={`absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition ${
            isFavorite(p._id) ? "bg-red-500 text-white" : "bg-white/85 text-navy opacity-0 group-hover:opacity-100"
          }`}
        >
          <Heart size={14} fill={isFavorite(p._id) ? "currentColor" : "none"} />
        </button>
        {imgs.length > 1 && (
          <>
            <button onClick={(e) => { e.preventDefault(); slide(-1); }} className="opacity-0 group-hover:opacity-100 transition absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center">
              <ChevronLeft size={16} />
            </button>
            <button onClick={(e) => { e.preventDefault(); slide(1); }} className="opacity-0 group-hover:opacity-100 transition absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center">
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </Link>
      <Link to={`/property/${p._id}`} className="block p-6">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-display text-lg leading-snug pr-2 hover:text-gold transition">{p.title}</h3>
          <p className="text-gold font-semibold whitespace-nowrap">{p.price}</p>
        </div>
        <p className="text-xs text-navy/50 flex items-center gap-1.5 mb-4">
          <MapPin size={12} /> {p.location}
        </p>
        <div className="flex flex-wrap gap-3 text-xs text-navy/70 mb-5">
          <span className="flex items-center gap-1"><Ruler size={14} /> {p.area}</span>
          {p.beds > 0 && <span className="flex items-center gap-1"><BedDouble size={14} /> {p.beds} Beds</span>}
          <span className="flex items-center gap-1"><Bath size={14} /> {p.baths} Bath</span>
          <span className="flex items-center gap-1"><Car size={14} /> {p.parking} Parking</span>
        </div>
      </Link>
    </div>
  );
}
