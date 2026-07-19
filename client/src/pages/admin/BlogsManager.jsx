import { useEffect, useState } from "react";
import { Plus, Trash2, UploadCloud, Save, Newspaper, Image as ImageIcon } from "lucide-react";
import api from "../../api/axios";
import { uploadFile } from "../../utils/upload";

const emptyBlog = { title: "", coverImage: "", excerpt: "", content: "", author: "", tags: [], published: true };

function BlogForm({ blog, onSave, onDelete }) {
  const [form, setForm] = useState({ ...emptyBlog, ...blog });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tagsInput, setTagsInput] = useState((blog.tags || []).join(", "));

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleCover(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      update("coverImage", url);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSave() {
    setSaving(true);
    const payload = { ...form, tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean) };
    await onSave(blog._id, payload);
    setSaving(false);
  }

  return (
    <div className="bg-white border border-navy/10 rounded-2xl p-5">
      <div className="flex gap-4">
        <div className="shrink-0">
          <div className="w-28 h-20 rounded-lg overflow-hidden border border-navy/10 bg-navy/5 flex items-center justify-center">
            {form.coverImage ? <img src={form.coverImage} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="text-navy/30" size={20} />}
          </div>
          <label className="mt-1 text-[10px] font-semibold px-2 py-1 rounded-full border border-navy/20 flex items-center gap-1 cursor-pointer justify-center">
            <UploadCloud size={10} /> {uploading ? "..." : "Cover"}
            <input type="file" accept="image/*" hidden onChange={handleCover} />
          </label>
        </div>
        <div className="flex-1 grid sm:grid-cols-2 gap-3">
          <input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Blog Title"
            className="border border-navy/10 rounded-lg px-3 py-2 text-sm w-full sm:col-span-2" />
          <input value={form.author} onChange={(e) => update("author", e.target.value)} placeholder="Author"
            className="border border-navy/10 rounded-lg px-3 py-2 text-sm w-full" />
          <input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="Tags (comma separated)"
            className="border border-navy/10 rounded-lg px-3 py-2 text-sm w-full" />
        </div>
      </div>
      <textarea value={form.excerpt} onChange={(e) => update("excerpt", e.target.value)} placeholder="Short excerpt (shown in listings)" rows={2}
        className="border border-navy/10 rounded-lg px-3 py-2 text-sm w-full mt-3" />
      <textarea value={form.content} onChange={(e) => update("content", e.target.value)} placeholder="Full blog content" rows={5}
        className="border border-navy/10 rounded-lg px-3 py-2 text-sm w-full mt-3" />

      <div className="flex items-center justify-between mt-4">
        <label className="flex items-center gap-2 text-xs text-navy/60">
          <input type="checkbox" checked={form.published} onChange={(e) => update("published", e.target.checked)} /> Published
        </label>
        <div className="flex gap-2">
          <button onClick={handleSave} disabled={saving} className="text-xs font-semibold px-4 py-2 rounded-full bg-navy text-paper flex items-center gap-1 disabled:opacity-60">
            <Save size={14} /> {saving ? "Saving..." : "Save"}
          </button>
          <button onClick={() => onDelete(blog._id)} className="text-xs font-semibold px-4 py-2 rounded-full border border-red-400 text-red-500 flex items-center gap-1">
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BlogsManager() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    api.get("/blogs/all").then((res) => setBlogs(res.data)).finally(() => setLoading(false));
  }
  useEffect(() => { load(); }, []);

  async function saveBlog(id, payload) {
    if (id) {
      const { data } = await api.put(`/blogs/${id}`, payload);
      setBlogs((prev) => prev.map((b) => (b._id === id ? data : b)));
    } else {
      const { data } = await api.post("/blogs", payload);
      setBlogs((prev) => [data, ...prev]);
    }
  }

  async function deleteBlog(id) {
    if (!confirm("Delete this blog post?")) return;
    await api.delete(`/blogs/${id}`);
    setBlogs((prev) => prev.filter((b) => b._id !== id));
  }

  function addNew() {
    setBlogs((prev) => [{ ...emptyBlog, _id: null, key: Date.now() }, ...prev]);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl flex items-center gap-2">
          <Newspaper size={22} className="text-gold" /> Blogs
        </h2>
        <button onClick={addNew} className="text-xs font-semibold px-4 py-2 rounded-full bg-navy text-paper flex items-center gap-1">
          <Plus size={14} /> Add Blog Post
        </button>
      </div>
      {loading ? (
        <p className="text-navy/50 text-sm">Loading...</p>
      ) : blogs.length === 0 ? (
        <p className="text-navy/50 text-sm">No blog posts yet.</p>
      ) : (
        <div className="space-y-4">
          {blogs.map((b) => (
            <BlogForm
              key={b._id || b.key}
              blog={b}
              onSave={saveBlog}
              onDelete={b._id ? deleteBlog : () => setBlogs((prev) => prev.filter((x) => x !== b))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
