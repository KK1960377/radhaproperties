import { useState } from "react";
import { Search } from "lucide-react";

export default function SearchBar() {
  const [keyword, setKeyword] = useState("");

  function handleSearch(e) {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("property-search", { detail: { keyword } }));
    document.getElementById("properties")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="relative z-10 -mt-8 sm:-mt-10 px-5 sm:px-8">
      <form
        onSubmit={handleSearch}
        className="max-w-4xl mx-auto bg-white rounded-2xl sm:rounded-full shadow-xl border border-navy/5 p-2 flex flex-col sm:flex-row gap-2"
      >
        <div className="flex-1 flex items-center gap-3 px-4 py-2.5">
          <Search size={18} className="text-navy/40 shrink-0" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search by locality, project name, or property title..."
            className="w-full text-sm outline-none bg-transparent"
          />
        </div>
        <button type="submit" className="bg-gold text-navy px-7 py-3 rounded-xl sm:rounded-full font-semibold text-sm hover:shadow-gold transition-all shrink-0">
          Search Properties
        </button>
      </form>
    </div>
  );
}
