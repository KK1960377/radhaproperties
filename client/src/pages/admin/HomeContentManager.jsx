import { useEffect, useState } from "react";
import { Plus, Trash2, UploadCloud, Save, LayoutTemplate, Image as ImageIcon } from "lucide-react";
import api from "../../api/axios";
import { uploadFile } from "../../utils/upload";

export default function HomeContentManager() {
  const [content, setContent] = useState({ heroSlides: [], counters: [], partners: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [uploadingIndex, setUploadingIndex] = useState(null); // "hero-0", "partner-2"...

  useEffect(() => {
    api.get("/home-content").then((res) => setContent(res.data)).finally(() => setLoading(false));
  }, []);

  function updateList(key, index, patch) {
    setContent((c) => {
      const list = [...c[key]];
      list[index] = { ...list[index], ...patch };
      return { ...c, [key]: list };
    });
  }

  function addItem(key, item) {
    setContent((c) => ({ ...c, [key]: [...c[key], item] }));
  }

  function removeItem(key, index) {
    setContent((c) => ({ ...c, [key]: c[key].filter((_, i) => i !== index) }));
  }

  async function handleImageUpload(key, index, file) {
    if (!file) return;
    const tag = `${key}-${index}`;
    setUploadingIndex(tag);
    try {
      const url = await uploadFile(file);
      updateList(key, index, { [key === "heroSlides" ? "image" : "logo"]: url });
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Upload failed." });
    } finally {
      setUploadingIndex(null);
    }
  }

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const { data } = await api.put("/home-content", content);
      setContent(data);
      setMessage({ type: "success", text: "Home page content saved. Changes are live." });
    } catch (err) {
      setMessage({ type: "error", text: err?.response?.data?.message || "Could not save." });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-navy/50 text-sm">Loading...</p>;

  return (
    <div>
      <h2 className="font-display text-2xl mb-1 flex items-center gap-2">
        <LayoutTemplate size={22} className="text-gold" /> Home Page Content
      </h2>
      <p className="text-xs text-navy/50 mb-6">Manage the hero banner slider, stat counters, and partner logos shown on the homepage.</p>

      {message && (
        <div className={`text-xs font-medium rounded-lg px-4 py-3 mb-5 ${message.type === "error" ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"}`}>
          {message.text}
        </div>
      )}

      {/* Hero Slides */}
      <section className="bg-white border border-navy/10 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg">Hero Banner Slider</h3>
          <button type="button" onClick={() => addItem("heroSlides", { image: "", title: "", subtitle: "", buttonText: "", buttonLink: "" })}
            className="text-[11px] font-semibold px-3 py-1.5 rounded-full border border-navy/20 flex items-center gap-1">
            <Plus size={12} /> Add Slide
          </button>
        </div>
        <div className="space-y-4">
          {content.heroSlides.map((slide, i) => (
            <div key={i} className="border border-navy/10 rounded-xl p-4 flex flex-col sm:flex-row gap-4">
              <div className="shrink-0">
                <div className="w-32 h-20 rounded-lg overflow-hidden border border-navy/10 bg-navy/5 flex items-center justify-center">
                  {slide.image ? <img src={slide.image} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="text-navy/30" size={20} />}
                </div>
                <label className="mt-1 text-[10px] font-semibold px-2 py-1 rounded-full border border-navy/20 flex items-center gap-1 cursor-pointer justify-center">
                  <UploadCloud size={10} /> {uploadingIndex === `heroSlides-${i}` ? "..." : "Upload"}
                  <input type="file" accept="image/*" hidden onChange={(e) => handleImageUpload("heroSlides", i, e.target.files?.[0])} />
                </label>
              </div>
              <div className="flex-1 grid sm:grid-cols-2 gap-2">
                <input value={slide.title} onChange={(e) => updateList("heroSlides", i, { title: e.target.value })} placeholder="Title"
                  className="border border-navy/10 rounded-lg px-2.5 py-2 text-xs w-full" />
                <input value={slide.subtitle} onChange={(e) => updateList("heroSlides", i, { subtitle: e.target.value })} placeholder="Subtitle"
                  className="border border-navy/10 rounded-lg px-2.5 py-2 text-xs w-full" />
                <input value={slide.buttonText} onChange={(e) => updateList("heroSlides", i, { buttonText: e.target.value })} placeholder="Button Text"
                  className="border border-navy/10 rounded-lg px-2.5 py-2 text-xs w-full" />
                <input value={slide.buttonLink} onChange={(e) => updateList("heroSlides", i, { buttonLink: e.target.value })} placeholder="Button Link (#properties)"
                  className="border border-navy/10 rounded-lg px-2.5 py-2 text-xs w-full" />
              </div>
              <button type="button" onClick={() => removeItem("heroSlides", i)} className="text-red-500 self-start"><Trash2 size={15} /></button>
            </div>
          ))}
          {content.heroSlides.length === 0 && <p className="text-xs text-navy/40">No slides yet — the homepage will use its default hero.</p>}
        </div>
      </section>

      {/* Counters */}
      <section className="bg-white border border-navy/10 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg">Stat Counters</h3>
          <button type="button" onClick={() => addItem("counters", { label: "", value: 0, suffix: "+" })}
            className="text-[11px] font-semibold px-3 py-1.5 rounded-full border border-navy/20 flex items-center gap-1">
            <Plus size={12} /> Add Counter
          </button>
        </div>
        <div className="space-y-2">
          {content.counters.map((c, i) => (
            <div key={i} className="grid grid-cols-[1fr_100px_80px_auto] gap-2 items-center">
              <input value={c.label} onChange={(e) => updateList("counters", i, { label: e.target.value })} placeholder="Label (e.g. Happy Families)"
                className="border border-navy/10 rounded-lg px-2.5 py-2 text-xs w-full" />
              <input type="number" value={c.value} onChange={(e) => updateList("counters", i, { value: Number(e.target.value) })} placeholder="Value"
                className="border border-navy/10 rounded-lg px-2.5 py-2 text-xs w-full" />
              <input value={c.suffix} onChange={(e) => updateList("counters", i, { suffix: e.target.value })} placeholder="+"
                className="border border-navy/10 rounded-lg px-2.5 py-2 text-xs w-full" />
              <button type="button" onClick={() => removeItem("counters", i)} className="text-red-500"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </section>

      {/* Partners */}
      <section className="bg-white border border-navy/10 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg">Partners / Builders</h3>
          <button type="button" onClick={() => addItem("partners", { name: "", logo: "", link: "" })}
            className="text-[11px] font-semibold px-3 py-1.5 rounded-full border border-navy/20 flex items-center gap-1">
            <Plus size={12} /> Add Partner
          </button>
        </div>
        <div className="space-y-3">
          {content.partners.map((p, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-lg overflow-hidden border border-navy/10 bg-navy/5 flex items-center justify-center shrink-0">
                {p.logo ? <img src={p.logo} alt="" className="w-full h-full object-contain" /> : <ImageIcon className="text-navy/30" size={16} />}
              </div>
              <label className="text-[10px] font-semibold px-2 py-1.5 rounded-full border border-navy/20 flex items-center gap-1 cursor-pointer shrink-0">
                <UploadCloud size={10} /> {uploadingIndex === `partners-${i}` ? "..." : "Logo"}
                <input type="file" accept="image/*" hidden onChange={(e) => handleImageUpload("partners", i, e.target.files?.[0])} />
              </label>
              <input value={p.name} onChange={(e) => updateList("partners", i, { name: e.target.value })} placeholder="Partner Name"
                className="border border-navy/10 rounded-lg px-2.5 py-2 text-xs w-full" />
              <input value={p.link} onChange={(e) => updateList("partners", i, { link: e.target.value })} placeholder="Website Link (optional)"
                className="border border-navy/10 rounded-lg px-2.5 py-2 text-xs w-full" />
              <button type="button" onClick={() => removeItem("partners", i)} className="text-red-500 shrink-0"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </section>

      <button onClick={save} disabled={saving} className="bg-navy text-paper px-6 py-3 rounded-full font-semibold text-sm flex items-center gap-2 disabled:opacity-60">
        <Save size={16} /> {saving ? "Saving..." : "Save Home Page Content"}
      </button>
    </div>
  );
}
