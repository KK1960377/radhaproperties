import { useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X, Share2, Heart } from "lucide-react";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop";

export default function Gallery({ imgs, title, isFavorite, onToggleFavorite }) {
  const gallery = imgs?.length ? imgs : [FALLBACK_IMG];
  const [idx, setIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [copied, setCopied] = useState(false);

  function slide(dir) {
    setIdx((cur) => {
      let next = cur + dir;
      if (next < 0) next = gallery.length - 1;
      if (next > gallery.length - 1) next = 0;
      return next;
    });
  }

  async function handleShare() {
    const shareData = { title, url: window.location.href };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        /* user cancelled — no-op */
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="relative">
      <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden bg-navy/5 group">
        <img
          src={gallery[idx]}
          alt={`${title} photo ${idx + 1}`}
          loading="eager"
          className="w-full h-full object-cover"
        />

        {gallery.length > 1 && (
          <>
            <button
              onClick={() => slide(-1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => slide(1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
          {idx + 1}/{gallery.length}
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button
            onClick={onToggleFavorite}
            title="Save to Favorites"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
              isFavorite ? "bg-red-500 text-white" : "bg-white/90 text-navy hover:bg-white"
            }`}
          >
            <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
          </button>
          <button
            onClick={handleShare}
            title="Share"
            className="w-9 h-9 rounded-full bg-white/90 text-navy flex items-center justify-center hover:bg-white transition relative"
          >
            <Share2 size={16} />
            {copied && (
              <span className="absolute -bottom-8 right-0 bg-navy text-white text-[10px] px-2 py-1 rounded-full whitespace-nowrap">
                Link copied!
              </span>
            )}
          </button>
          <button
            onClick={() => setLightbox(true)}
            title="View Fullscreen"
            className="w-9 h-9 rounded-full bg-white/90 text-navy flex items-center justify-center hover:bg-white transition"
          >
            <Expand size={16} />
          </button>
        </div>
      </div>

      {gallery.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {gallery.map((src, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition ${
                i === idx ? "border-gold" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div className="fixed inset-0 z-[80] bg-black/95 flex items-center justify-center">
          <button onClick={() => setLightbox(false)} className="absolute top-5 right-5 text-white/80 hover:text-white">
            <X size={28} />
          </button>
          {gallery.length > 1 && (
            <>
              <button onClick={() => slide(-1)} className="absolute left-4 sm:left-8 text-white/70 hover:text-white">
                <ChevronLeft size={36} />
              </button>
              <button onClick={() => slide(1)} className="absolute right-4 sm:right-8 text-white/70 hover:text-white">
                <ChevronRight size={36} />
              </button>
            </>
          )}
          <img src={gallery[idx]} alt="" className="max-h-[85vh] max-w-[92vw] object-contain rounded-lg" />
          <div className="absolute bottom-6 text-white/60 text-sm">{idx + 1} / {gallery.length}</div>
        </div>
      )}
    </div>
  );
}
