import { useEffect, useState } from "react";
import { Plus, Trash2, Save, Tags } from "lucide-react";
import api from "../../api/axios";

export default function CategoriesManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");

  function load() {
    setLoading(true);
    api
      .get("/categories")
      .then((res) => setCategories(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function addCategory(e) {
    e.preventDefault();
    setError("");
    const name = newName.trim();
    if (!name) return;
    try {
      const { data } = await api.post("/categories", { name, order: categories.length });
      setCategories((prev) => [...prev, data]);
      setNewName("");
    } catch (err) {
      setError(err?.response?.data?.message || "Could not add category.");
    }
  }

  async function updateCategory(id, patch) {
    const { data } = await api.put(`/categories/${id}`, patch);
    setCategories((prev) => prev.map((c) => (c._id === id ? data : c)));
  }

  async function deleteCategory(id) {
    if (!confirm("Delete this category? Properties already using it will keep their existing type text.")) return;
    await api.delete(`/categories/${id}`);
    setCategories((prev) => prev.filter((c) => c._id !== id));
  }

  return (
    <div>
      <h2 className="font-display text-2xl mb-6 flex items-center gap-2">
        <Tags size={22} className="text-gold" /> Property Categories
      </h2>

      <form onSubmit={addCategory} className="flex flex-wrap gap-3 mb-6">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New category name (e.g. Farmhouse)"
          className="border border-navy/10 rounded-lg px-4 py-2.5 text-sm flex-1 min-w-[220px]"
        />
        <button className="text-xs font-semibold px-5 py-2.5 rounded-full bg-navy text-paper flex items-center gap-1">
          <Plus size={14} /> Add Category
        </button>
      </form>
      {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

      {loading ? (
        <p className="text-navy/50 text-sm">Loading...</p>
      ) : categories.length === 0 ? (
        <p className="text-navy/50 text-sm">No categories yet. Add your first one above.</p>
      ) : (
        <div className="bg-white border border-navy/10 rounded-2xl divide-y divide-navy/5">
          {categories.map((c) => (
            <div key={c._id} className="flex items-center justify-between px-5 py-4 gap-3">
              <input
                defaultValue={c.name}
                onBlur={(e) => e.target.value.trim() && e.target.value !== c.name && updateCategory(c._id, { name: e.target.value.trim() })}
                className="text-sm font-medium bg-transparent border-b border-transparent focus:border-gold outline-none flex-1"
              />
              <label className="flex items-center gap-2 text-xs text-navy/60">
                <input type="checkbox" checked={c.active} onChange={(e) => updateCategory(c._id, { active: e.target.checked })} />
                Active
              </label>
              <button onClick={() => deleteCategory(c._id)} className="text-red-500 hover:text-red-600" title="Delete">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-navy/40 mt-4 flex items-center gap-1"><Save size={12} /> Changes save automatically as you edit.</p>
    </div>
  );
}
