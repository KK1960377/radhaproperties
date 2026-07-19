import { useEffect, useMemo, useState } from "react";
import { MessageSquareText, Trash2, Search, Download } from "lucide-react";
import api from "../../api/axios";

const statusColor = {
  New: "bg-amber-100 text-amber-700",
  Contacted: "bg-blue-100 text-blue-700",
  Closed: "bg-emerald-100 text-emerald-700",
};

const SOURCES = [
  "Contact Form",
  "Enquire Now",
  "Book Site Visit",
  "Contact Agent",
  "Download Brochure",
  "Request Callback",
];

const sourceColor = {
  "Contact Form": "bg-navy/5 text-navy/70",
  "Enquire Now": "bg-gold/15 text-gold-dim",
  "Book Site Visit": "bg-purple-100 text-purple-700",
  "Contact Agent": "bg-sky-100 text-sky-700",
  "Download Brochure": "bg-orange-100 text-orange-700",
  "Request Callback": "bg-teal-100 text-teal-700",
};

function toCSV(rows) {
  const headers = ["Name", "Phone", "Email", "Property", "Property Type", "City", "Budget", "Source", "Status", "Date", "Message"];
  const lines = [headers.join(",")];
  rows.forEach((i) => {
    const cells = [
      i.name, i.phone, i.email, i.propertyTitle, i.propertyType, i.city, i.budget,
      i.source, i.status, new Date(i.createdAt).toLocaleString(), (i.message || "").replace(/\n/g, " "),
    ].map((v) => `"${String(v || "").replace(/"/g, '""')}"`);
    lines.push(cells.join(","));
  });
  return lines.join("\n");
}

export default function InquiriesManager() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  function load() {
    setLoading(true);
    const params = {};
    if (search.trim()) params.search = search.trim();
    if (statusFilter !== "all") params.status = statusFilter;
    if (sourceFilter !== "all") params.source = sourceFilter;
    api.get("/inquiries", { params }).then((res) => setInquiries(res.data)).finally(() => setLoading(false));
  }

  useEffect(() => {
    const timer = setTimeout(load, 300); // debounce search
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter, sourceFilter]);

  async function updateStatus(id, status) {
    const { data } = await api.put(`/inquiries/${id}`, { status });
    setInquiries((prev) => prev.map((i) => (i._id === id ? data : i)));
  }

  async function remove(id) {
    if (!confirm("Delete this inquiry?")) return;
    await api.delete(`/inquiries/${id}`);
    setInquiries((prev) => prev.filter((i) => i._id !== id));
  }

  function exportCSV() {
    const csv = toCSV(inquiries);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const counts = useMemo(() => {
    const c = { New: 0, Contacted: 0, Closed: 0 };
    inquiries.forEach((i) => { c[i.status] = (c[i.status] || 0) + 1; });
    return c;
  }, [inquiries]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <h2 className="font-display text-2xl flex items-center gap-2">
          <MessageSquareText size={22} className="text-gold" /> Inquiries
        </h2>
        <button
          onClick={exportCSV}
          disabled={!inquiries.length}
          className="text-xs font-semibold px-4 py-2 rounded-full border border-navy/20 flex items-center gap-1.5 hover:bg-navy/5 disabled:opacity-40"
        >
          <Download size={13} /> Export CSV
        </button>
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-navy/50 mb-5">
        <span>{inquiries.length} total</span>
        <span>· {counts.New || 0} New</span>
        <span>· {counts.Contacted || 0} Contacted</span>
        <span>· {counts.Closed || 0} Closed</span>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, email, or property..."
            className="w-full border border-navy/10 rounded-xl pl-9 pr-4 py-2.5 text-sm"
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-navy/10 rounded-xl px-3 py-2.5 text-sm sm:w-48">
          <option value="all">All Statuses</option>
          {["New", "Contacted", "Closed"].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} className="border border-navy/10 rounded-xl px-3 py-2.5 text-sm sm:w-56">
          <option value="all">All Sources</option>
          {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <p className="text-navy/50 text-sm">Loading...</p>
      ) : inquiries.length === 0 ? (
        <p className="text-navy/50 text-sm">No inquiries found — leads from Enquire Now, Book Site Visit, Contact Agent, Download Brochure and Request Callback will appear here.</p>
      ) : (
        <div className="space-y-3">
          {inquiries.map((i) => (
            <div key={i._id} className="bg-white border border-navy/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-sm">{i.name}</p>
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${statusColor[i.status] || "bg-navy/5"}`}>{i.status}</span>
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${sourceColor[i.source] || "bg-navy/5"}`}>{i.source || "Contact Form"}</span>
                </div>
                <p className="text-xs text-navy/50 mt-1">
                  {i.phone} {i.email && `· ${i.email}`} {i.city && `· ${i.city}`} {i.budget && `· Budget: ${i.budget}`}
                </p>
                {i.propertyTitle && (
                  <p className="text-xs text-navy/60 mt-1">
                    Property: <span className="font-medium">{i.propertyTitle}</span>
                    {i.propertyPrice && ` · ${i.propertyPrice}`}
                    {i.propertyType && ` · ${i.propertyType}`}
                  </p>
                )}
                {i.preferredDate && <p className="text-xs text-navy/60 mt-1">Preferred visit: {i.preferredDate}</p>}
                {i.message && <p className="text-sm text-navy/70 mt-2">{i.message}</p>}
                <p className="text-[11px] text-navy/30 mt-2">{new Date(i.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <select value={i.status} onChange={(e) => updateStatus(i._id, e.target.value)} className="text-xs border border-navy/10 rounded-lg px-3 py-2">
                  {["New", "Contacted", "Closed"].map((s) => <option key={s}>{s}</option>)}
                </select>
                <button onClick={() => remove(i._id)} className="text-red-500 hover:text-red-600" title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
