import { useEffect, useState } from "react";
import { Plus, Trash2, HelpCircle } from "lucide-react";
import api from "../../api/axios";

export default function FAQsManager() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ question: "", answer: "" });
  const [error, setError] = useState("");

  function load() {
    setLoading(true);
    api.get("/faqs/all").then((res) => setFaqs(res.data)).finally(() => setLoading(false));
  }
  useEffect(() => { load(); }, []);

  async function addFaq(e) {
    e.preventDefault();
    setError("");
    if (!form.question.trim() || !form.answer.trim()) {
      setError("Question and answer are both required.");
      return;
    }
    try {
      const { data } = await api.post("/faqs", { ...form, order: faqs.length });
      setFaqs((prev) => [...prev, data]);
      setForm({ question: "", answer: "" });
    } catch (err) {
      setError(err?.response?.data?.message || "Could not add FAQ.");
    }
  }

  async function updateFaq(id, patch) {
    const { data } = await api.put(`/faqs/${id}`, patch);
    setFaqs((prev) => prev.map((f) => (f._id === id ? data : f)));
  }

  async function deleteFaq(id) {
    if (!confirm("Delete this FAQ?")) return;
    await api.delete(`/faqs/${id}`);
    setFaqs((prev) => prev.filter((f) => f._id !== id));
  }

  return (
    <div>
      <h2 className="font-display text-2xl mb-6 flex items-center gap-2">
        <HelpCircle size={22} className="text-gold" /> FAQs
      </h2>

      <form onSubmit={addFaq} className="bg-white border border-navy/10 rounded-2xl p-6 space-y-3 mb-6">
        <input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} placeholder="Question"
          className="border border-navy/10 rounded-lg px-3 py-2.5 text-sm w-full" />
        <textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} placeholder="Answer" rows={2}
          className="border border-navy/10 rounded-lg px-3 py-2.5 text-sm w-full" />
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <button className="text-xs font-semibold px-5 py-2.5 rounded-full bg-navy text-paper flex items-center gap-1">
          <Plus size={14} /> Add FAQ
        </button>
      </form>

      {loading ? (
        <p className="text-navy/50 text-sm">Loading...</p>
      ) : faqs.length === 0 ? (
        <p className="text-navy/50 text-sm">No FAQs yet.</p>
      ) : (
        <div className="space-y-3">
          {faqs.map((f) => (
            <div key={f._id} className="bg-white border border-navy/10 rounded-2xl p-5">
              <input
                defaultValue={f.question}
                onBlur={(e) => e.target.value.trim() && e.target.value !== f.question && updateFaq(f._id, { question: e.target.value.trim() })}
                className="text-sm font-semibold w-full bg-transparent border-b border-transparent focus:border-gold outline-none mb-2"
              />
              <textarea
                defaultValue={f.answer}
                rows={2}
                onBlur={(e) => e.target.value.trim() && e.target.value !== f.answer && updateFaq(f._id, { answer: e.target.value.trim() })}
                className="text-sm text-navy/70 w-full bg-transparent border-b border-transparent focus:border-gold outline-none"
              />
              <div className="flex items-center justify-between mt-3">
                <label className="flex items-center gap-2 text-xs text-navy/60">
                  <input type="checkbox" checked={f.active} onChange={(e) => updateFaq(f._id, { active: e.target.checked })} /> Active
                </label>
                <button onClick={() => deleteFaq(f._id)} className="text-red-500 hover:text-red-600">
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
