import { useEffect, useState } from "react";
import { Plus, Trash2, Save, UploadCloud, X, Building2, ChevronDown, ChevronUp, Copy } from "lucide-react";
import api from "../../api/axios";
import { uploadFiles } from "../../utils/upload";
import PropertyAdvancedEditor from "./PropertyAdvancedEditor";

const emptyProperty = {
  title: "New Property",
  type: "",
  price: "₹0",
  location: "Greater Noida West",
  area: "0 sq.ft",
  beds: 0,
  baths: 0,
  parking: 0,
  status: "Ready to Move",
  imgs: [],
  published: true,
  featured: false,
  premium: false,
  hot: false,
};

function TogglePill({ label, checked, onChange }) {
  return (
    <label className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border cursor-pointer flex items-center gap-1.5 transition ${
      checked ? "bg-gold/15 border-gold text-navy" : "border-navy/15 text-navy/50 hover:bg-navy/5"
    }`}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="hidden" />
      {label}
    </label>
  );
}

function PropertyForm({ property, categories, team, onSave, onDelete, onDuplicate }) {
  const [form, setForm] = useState({ ...property, imgs: property.imgs || [] });
  const [saving, setSaving] = useState(false);
  const [duplicating, setDuplicating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [manualUrl, setManualUrl] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleFileSelect(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadError("");
    setUploading(true);
    try {
      const urls = await uploadFiles(files);
      update("imgs", [...form.imgs, ...urls]);
    } catch (err) {
      setUploadError(err?.response?.data?.message || err.message || "Upload failed. Try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeImage(index) {
    update("imgs", form.imgs.filter((_, i) => i !== index));
  }

  function addManualUrl() {
    const url = manualUrl.trim();
    if (!url) return;
    update("imgs", [...form.imgs, url]);
    setManualUrl("");
  }

  async function handleSave() {
    setSaving(true);
    const payload = {
      ...form,
      beds: Number(form.beds) || 0,
      baths: Number(form.baths) || 0,
      parking: Number(form.parking) || 0,
      balcony: Number(form.balcony) || 0,
      agent: form.agent?._id || form.agent || null,
    };
    await onSave(property._id, payload);
    setSaving(false);
  }

  async function handleDuplicate() {
    if (!property._id) return;
    setDuplicating(true);
    await onDuplicate(property._id);
    setDuplicating(false);
  }

  return (
    <div className="border border-navy/10 rounded-2xl p-5 bg-white">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <TogglePill label={form.published ? "Published" : "Unpublished"} checked={!!form.published} onChange={(v) => update("published", v)} />
        <TogglePill label="Featured" checked={!!form.featured} onChange={(v) => update("featured", v)} />
        <TogglePill label="Premium" checked={!!form.premium} onChange={(v) => update("premium", v)} />
        <TogglePill label="Hot" checked={!!form.hot} onChange={(v) => update("hot", v)} />
        {property._id && (
          <button type="button" onClick={handleDuplicate} disabled={duplicating} className="ml-auto text-[11px] font-semibold px-3 py-1.5 rounded-full border border-navy/15 text-navy/60 hover:bg-navy/5 flex items-center gap-1 disabled:opacity-60">
            <Copy size={12} /> {duplicating ? "Duplicating..." : "Duplicate"}
          </button>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Title"
          className="border border-navy/10 rounded-lg px-3 py-2.5 text-sm w-full" />
        <select value={form.type} onChange={(e) => update("type", e.target.value)}
          className="border border-navy/10 rounded-lg px-3 py-2.5 text-sm w-full">
          <option value="">Select category...</option>
          {categories.map((c) => <option key={c._id} value={c.name}>{c.name}</option>)}
        </select>
        <input value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="Price"
          className="border border-navy/10 rounded-lg px-3 py-2.5 text-sm w-full" />
        <input value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="Location"
          className="border border-navy/10 rounded-lg px-3 py-2.5 text-sm w-full" />
        <input value={form.area} onChange={(e) => update("area", e.target.value)} placeholder="Area"
          className="border border-navy/10 rounded-lg px-3 py-2.5 text-sm w-full" />
        <select value={form.status} onChange={(e) => update("status", e.target.value)}
          className="border border-navy/10 rounded-lg px-3 py-2.5 text-sm w-full">
          {["Ready to Move", "Under Construction", "New Launch"].map((s) => <option key={s}>{s}</option>)}
        </select>
        <input type="number" min="0" value={form.beds} onChange={(e) => update("beds", e.target.value)} placeholder="Beds"
          className="border border-navy/10 rounded-lg px-3 py-2.5 text-sm w-full" />
        <input type="number" min="0" value={form.baths} onChange={(e) => update("baths", e.target.value)} placeholder="Baths"
          className="border border-navy/10 rounded-lg px-3 py-2.5 text-sm w-full" />
        <input type="number" min="0" value={form.parking} onChange={(e) => update("parking", e.target.value)} placeholder="Parking"
          className="border border-navy/10 rounded-lg px-3 py-2.5 text-sm w-full" />
      </div>
      <label className="text-xs font-semibold text-navy/60 mb-1 block">Photos</label>

      {form.imgs.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {form.imgs.map((url, i) => (
            <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-navy/10 group">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 mb-2">
        <label className="text-xs font-semibold px-4 py-2 rounded-full border border-navy/20 flex items-center gap-1 cursor-pointer hover:bg-navy/5">
          <UploadCloud size={14} />
          {uploading ? "Uploading..." : "Upload Photos"}
          <input type="file" accept="image/*" multiple hidden disabled={uploading} onChange={handleFileSelect} />
        </label>
        <span className="text-[11px] text-navy/40">Ek saath multiple photos select kar sakte hain</span>
      </div>

      <div className="flex gap-2 mb-3">
        <input
          value={manualUrl}
          onChange={(e) => setManualUrl(e.target.value)}
          placeholder="ya koi image URL paste karein (optional)"
          className="border border-navy/10 rounded-lg px-3 py-2 text-xs w-full"
        />
        <button type="button" onClick={addManualUrl} className="text-xs font-semibold px-3 py-2 rounded-lg border border-navy/10 whitespace-nowrap">
          Add URL
        </button>
      </div>

      {uploadError && <p className="text-xs text-red-500 mb-3">{uploadError}</p>}

      <button
        type="button"
        onClick={() => setShowAdvanced((v) => !v)}
        className="text-xs font-semibold text-gold flex items-center gap-1 mb-3"
      >
        {showAdvanced ? "Hide" : "Show"} Advanced Details (Overview, Amenities, Nearby, Price, Documents, Video, Agent...)
        {showAdvanced ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>

      {showAdvanced && <PropertyAdvancedEditor form={form} update={update} team={team} />}

      <div className="flex gap-2 mt-4">
        <button onClick={handleSave} disabled={saving} className="text-xs font-semibold px-4 py-2 rounded-full bg-navy text-paper flex items-center gap-1 disabled:opacity-60">
          <Save size={14} /> {saving ? "Saving..." : "Save"}
        </button>
        <button onClick={() => onDelete(property._id)} className="text-xs font-semibold px-4 py-2 rounded-full border border-red-400 text-red-500 flex items-center gap-1">
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </div>
  );
}

export default function PropertiesManager() {
  const [properties, setProperties] = useState([]);
  const [categories, setCategories] = useState([]);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  function loadAll() {
    setLoading(true);
    Promise.all([api.get("/properties/all"), api.get("/categories"), api.get("/team/all")])
      .then(([p, c, t]) => {
        setProperties(p.data);
        setCategories(c.data);
        setTeam(t.data);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadAll(); }, []);

  async function saveProperty(id, payload) {
    if (id) {
      const { data } = await api.put(`/properties/${id}`, payload);
      setProperties((prev) => prev.map((p) => (p._id === id ? data : p)));
    } else {
      const { data } = await api.post("/properties", payload);
      setProperties((prev) => [data, ...prev]);
    }
  }

  async function deleteProperty(id) {
    if (!confirm("Delete this property?")) return;
    await api.delete(`/properties/${id}`);
    setProperties((prev) => prev.filter((p) => p._id !== id));
  }

  async function duplicateProperty(id) {
    const { data } = await api.post(`/properties/${id}/duplicate`);
    setProperties((prev) => {
      const index = prev.findIndex((p) => p._id === id);
      const next = [...prev];
      next.splice(index + 1, 0, data);
      return next;
    });
  }

  function addNew() {
    const defaultType = categories[0]?.name || "";
    setProperties((prev) => [{ ...emptyProperty, type: defaultType, _id: null, _isNew: true, key: Date.now() }, ...prev]);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-2xl flex items-center gap-2">
          <Building2 size={22} className="text-gold" /> Properties &amp; Photos
        </h2>
        <button onClick={addNew} className="text-xs font-semibold px-4 py-2 rounded-full bg-navy text-paper flex items-center gap-1">
          <Plus size={14} /> Add Property
        </button>
      </div>
      <p className="text-xs text-navy/50 mb-4">
        Photos seedhe apne device se upload karein — automatically Cloudinary par save ho jayengi. Categories manage karne ke liye "Property Categories" tab dekhein.
        Har property ke "Advanced Details" mein overview specs, amenities, nearby places, price breakdown, documents, video aur agent set kar sakte hain.
        Publish/Unpublish, Featured, Premium aur Hot badges upar toggle kiye ja sakte hain.
      </p>
      {loading ? (
        <p className="text-navy/50 text-sm">Loading...</p>
      ) : (
        <div className="space-y-4">
          {properties.map((p) => (
            <PropertyForm
              key={p._id || p.key}
              property={p}
              categories={categories}
              team={team}
              onSave={saveProperty}
              onDelete={p._id ? deleteProperty : () => setProperties((prev) => prev.filter((x) => x !== p))}
              onDuplicate={duplicateProperty}
            />
          ))}
        </div>
      )}
    </div>
  );
}
