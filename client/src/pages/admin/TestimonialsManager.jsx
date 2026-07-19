import { useEffect, useState } from "react";
import { Plus, Trash2, UploadCloud, MessageSquareQuote, UserRound, Star } from "lucide-react";
import api from "../../api/axios";
import { uploadFile } from "../../utils/upload";

const emptyForm = { name: "", location: "", photo: "", rating: 5, text: "", order: 0, active: true };

export default function TestimonialsManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  function load() {
    setLoading(true);
    api.get("/testimonials/all").then((res) => setItems(res.data)).finally(() => setLoading(false));
  }
  useEffect(() => { load(); }, []);

  async function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      setForm((f) => ({ ...f, photo: url }));
    } catch (err) {
      setError(err.message || "Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function addItem(e) {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.text.trim()) {
      setError("Name and testimonial text are required.");
      return;
    }
    try {
      const { data } = await api.post("/testimonials", { ...form, order: items.length });
      setItems((prev) => [...prev, data]);
      setForm(emptyForm);
    } catch (err) {
      setError(err?.response?.data?.message || "Could not add testimonial.");
    }
  }

  async function updateItem(id, patch) {
    const { data } = await api.put(`/testimonials/${id}`, patch);
    setItems((prev) => prev.map((t) => (t._id === id ? data : t)));
  }

  async function deleteItem(id) {
    if (!confirm("Delete this testimonial?")) return;
    await api.delete(`/testimonials/${id}`);
    setItems((prev) => prev.filter((t) => t._id !== id));
  }

  return (
    <div>
      <h2 className="font-display text-2xl mb-6 flex items-center gap-2">
        <MessageSquareQuote size={22} className="text-gold" /> Testimonials
      </h2>

      <form onSubmit={addItem} className="bg-white border border-navy/10 rounded-2xl p-6 mb-6">
        <div className="flex gap-4 mb-3">
          <div className="shrink-0">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-navy/10 bg-navy/5 flex items-center justify-center">
              {form.photo ? <img src={form.photo} alt="" className="w-full h-full object-cover" /> : <UserRound className="text-navy/30" size={22} />}
            </div>
            <label className="mt-1 text-[10px] font-semibold px-2 py-1 rounded-full border border-navy/20 flex items-center gap-1 cursor-pointer justify-center">
              <UploadCloud size={10} /> {uploading ? "..." : "Photo"}
              <input type="file" accept="image/*" hidden disabled={uploading} onChange={handlePhoto} />
            </label>
          </div>
          <div className="flex-1 grid sm:grid-cols-2 gap-3">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Customer Name"
              className="border border-navy/10 rounded-lg px-3 py-2.5 text-sm w-full" />
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Gaur City 2 Resident"
              className="border border-navy/10 rounded-lg px-3 py-2.5 text-sm w-full" />
            <select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="border border-navy/10 rounded-lg px-3 py-2.5 text-sm w-full">
              {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Stars</option>)}
            </select>
          </div>
        </div>
        <textarea value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} placeholder="Testimonial text" rows={2}
          className="border border-navy/10 rounded-lg px-3 py-2.5 text-sm w-full mb-3" />
        {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
        <button className="text-xs font-semibold px-5 py-2.5 rounded-full bg-navy text-paper flex items-center gap-1">
          <Plus size={14} /> Add Testimonial
        </button>
      </form>

      {loading ? (
        <p className="text-navy/50 text-sm">Loading...</p>
      ) : (
        <div className="space-y-3">
          {items.map((t) => (
            <div key={t._id} className="bg-white border border-navy/10 rounded-2xl p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-navy/10 bg-navy/5 flex items-center justify-center shrink-0">
                {t.photo ? <img src={t.photo} alt="" className="w-full h-full object-cover" /> : <UserRound className="text-navy/30" size={18} />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold">{t.name}</p>
                  <span className="text-[11px] text-navy/50">{t.location}</span>
                  <span className="flex items-center gap-0.5 text-gold">
                    {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={11} fill="currentColor" />)}
                  </span>
                </div>
                <p className="text-sm text-navy/70 mt-1">{t.text}</p>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <label className="flex items-center gap-1.5 text-[11px] text-navy/60">
                  <input type="checkbox" checked={t.active} onChange={(e) => updateItem(t._id, { active: e.target.checked })} /> Active
                </label>
                <button onClick={() => deleteItem(t._id)} className="text-red-500 hover:text-red-600">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
