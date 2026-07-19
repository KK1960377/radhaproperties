import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import api from "../api/axios";
import PropertyCard from "./PropertyCard";

const QUICK_FILTERS = [
  { key: "all", label: "All" },
  { key: "featured", label: "Featured" },
  { key: "premium", label: "Premium" },
  { key: "hot", label: "Hot" },
];

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [categories, setCategories] = useState([]);
  const [type, setType] = useState("all");
  const [quick, setQuick] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/categories", { params: { active: true } }).then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    function onSearch(e) {
      setKeyword(e.detail?.keyword || "");
      setType("all");
      setQuick("all");
    }
    window.addEventListener("property-search", onSearch);
    return () => window.removeEventListener("property-search", onSearch);
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .get("/properties", { params: { type } })
      .then((res) => setProperties(res.data))
      .catch(() => setError("Properties load nahi ho paayi. Server check karein."))
      .finally(() => setLoading(false));
  }, [type]);

  const visible = properties.filter((p) => {
    if (quick !== "all" && !p[quick]) return false;
    if (keyword.trim()) {
      const k = keyword.trim().toLowerCase();
      const haystack = [p.title, p.location, p.city, p.locality, p.projectName, p.builder].filter(Boolean).join(" ").toLowerCase();
      if (!haystack.includes(k)) return false;
    }
    return true;
  });

  return (
    <section id="properties" className="max-w-7xl mx-auto px-5 sm:px-8 py-24">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
        <div>
          <p className="text-gold uppercase tracking-[0.3em] text-xs mb-3">Handpicked</p>
          <h2 className="font-display text-3xl sm:text-5xl">Featured Properties</h2>
        </div>
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/40" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search by title, location, project..."
            className="w-full bg-white border border-navy/10 rounded-full pl-10 pr-4 py-2.5 text-sm"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {QUICK_FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setQuick(f.key)}
            className={`px-4 py-2 rounded-full text-xs font-semibold border ${
              quick === f.key ? "bg-navy text-paper border-navy" : "border-navy/15 text-navy/60"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-12">
        <button
          onClick={() => setType("all")}
          className={`px-4 py-2 rounded-full text-xs font-semibold border ${
            type === "all" ? "bg-gold text-navy border-gold" : "border-navy/15"
          }`}
        >
          All Categories
        </button>
        {categories.map((c) => (
          <button
            key={c._id}
            onClick={() => setType(c.name)}
            className={`px-4 py-2 rounded-full text-xs font-semibold border ${
              type === c.name ? "bg-gold text-navy border-gold" : "border-navy/15"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {error && <p className="text-red-500 text-sm mb-6">{error}</p>}
      {loading ? (
        <p className="text-navy/50 text-sm">Loading properties...</p>
      ) : visible.length === 0 ? (
        <p className="text-navy/50 text-sm">Is criteria ke liye abhi koi property nahi hai.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {visible.map((p) => (
            <PropertyCard key={p._id} p={p} />
          ))}
        </div>
      )}
    </section>
  );
}
