import { useEffect, useState } from "react";
import { Plus, Trash2, Save, UploadCloud, Users2, UserRound } from "lucide-react";
import api from "../../api/axios";
import { uploadFile } from "../../utils/upload";

const emptyMember = {
  photo: "",
  name: "",
  designation: "",
  phone: "",
  email: "",
  whatsapp: "",
  experience: "",
  bio: "",
  facebook: "",
  instagram: "",
  linkedin: "",
  order: 0,
  active: true,
};

function MemberForm({ member, onSave, onDelete }) {
  const [form, setForm] = useState({ ...emptyMember, ...member });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const url = await uploadFile(file);
      update("photo", url);
    } catch (err) {
      setError(err.message || "Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSave() {
    if (!form.name.trim() || !form.designation.trim()) {
      setError("Name and designation are required.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await onSave(member._id, { ...form, order: Number(form.order) || 0 });
    } catch (err) {
      setError(err?.response?.data?.message || "Could not save team member.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="border border-navy/10 rounded-2xl p-5 bg-white">
      <div className="flex gap-5">
        <div className="shrink-0">
          <div className="w-24 h-24 rounded-full overflow-hidden border border-navy/10 bg-navy/5 flex items-center justify-center">
            {form.photo ? <img src={form.photo} alt="" className="w-full h-full object-cover" /> : <UserRound className="text-navy/30" size={32} />}
          </div>
          <label className="mt-2 text-[11px] font-semibold px-3 py-1.5 rounded-full border border-navy/20 flex items-center gap-1 cursor-pointer hover:bg-navy/5 justify-center">
            <UploadCloud size={12} />
            {uploading ? "..." : "Photo"}
            <input type="file" accept="image/*" hidden disabled={uploading} onChange={handlePhoto} />
          </label>
          {form.photo && (
            <button onClick={() => update("photo", "")} className="mt-1 text-[11px] text-red-500 w-full text-center">
              Remove
            </button>
          )}
        </div>

        <div className="flex-1 grid sm:grid-cols-2 gap-3">
          <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Full Name *"
            className="border border-navy/10 rounded-lg px-3 py-2.5 text-sm w-full" />
          <input value={form.designation} onChange={(e) => update("designation", e.target.value)} placeholder="Designation *"
            className="border border-navy/10 rounded-lg px-3 py-2.5 text-sm w-full" />
          <input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="Phone Number"
            className="border border-navy/10 rounded-lg px-3 py-2.5 text-sm w-full" />
          <input value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="Email" type="email"
            className="border border-navy/10 rounded-lg px-3 py-2.5 text-sm w-full" />
          <input value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} placeholder="WhatsApp Number"
            className="border border-navy/10 rounded-lg px-3 py-2.5 text-sm w-full" />
          <input value={form.experience} onChange={(e) => update("experience", e.target.value)} placeholder="Experience (e.g. 5+ Years)"
            className="border border-navy/10 rounded-lg px-3 py-2.5 text-sm w-full" />
          <input value={form.facebook} onChange={(e) => update("facebook", e.target.value)} placeholder="Facebook Link"
            className="border border-navy/10 rounded-lg px-3 py-2.5 text-sm w-full" />
          <input value={form.instagram} onChange={(e) => update("instagram", e.target.value)} placeholder="Instagram Link"
            className="border border-navy/10 rounded-lg px-3 py-2.5 text-sm w-full" />
          <input value={form.linkedin} onChange={(e) => update("linkedin", e.target.value)} placeholder="LinkedIn Link"
            className="border border-navy/10 rounded-lg px-3 py-2.5 text-sm w-full" />
          <input type="number" value={form.order} onChange={(e) => update("order", e.target.value)} placeholder="Display Order"
            className="border border-navy/10 rounded-lg px-3 py-2.5 text-sm w-full" />
          <textarea value={form.bio} onChange={(e) => update("bio", e.target.value)} placeholder="Short Bio" rows={2}
            className="border border-navy/10 rounded-lg px-3 py-2.5 text-sm w-full sm:col-span-2" />
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <label className="flex items-center gap-2 text-xs text-navy/60">
          <input type="checkbox" checked={form.active} onChange={(e) => update("active", e.target.checked)} />
          Active (visible on website)
        </label>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="flex gap-2">
          <button onClick={handleSave} disabled={saving} className="text-xs font-semibold px-4 py-2 rounded-full bg-navy text-paper flex items-center gap-1 disabled:opacity-60">
            <Save size={14} /> {saving ? "Saving..." : "Save"}
          </button>
          <button onClick={() => onDelete(member._id)} className="text-xs font-semibold px-4 py-2 rounded-full border border-red-400 text-red-500 flex items-center gap-1">
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TeamManager() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    api.get("/team/all").then((res) => setTeam(res.data)).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function saveMember(id, payload) {
    if (id) {
      const { data } = await api.put(`/team/${id}`, payload);
      setTeam((prev) => prev.map((m) => (m._id === id ? data : m)));
    } else {
      const { data } = await api.post("/team", payload);
      setTeam((prev) => [data, ...prev]);
    }
  }

  async function deleteMember(id) {
    if (!confirm("Delete this team member?")) return;
    await api.delete(`/team/${id}`);
    setTeam((prev) => prev.filter((m) => m._id !== id));
  }

  function addNew() {
    setTeam((prev) => [{ ...emptyMember, _id: null, key: Date.now() }, ...prev]);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-2xl flex items-center gap-2">
          <Users2 size={22} className="text-gold" /> Team Management
        </h2>
        <button onClick={addNew} className="text-xs font-semibold px-4 py-2 rounded-full bg-navy text-paper flex items-center gap-1">
          <Plus size={14} /> Add Team Member
        </button>
      </div>
      <p className="text-xs text-navy/50 mb-4">
        Only "Active" members appear in the Meet Our Team section on the client website.
      </p>
      {loading ? (
        <p className="text-navy/50 text-sm">Loading...</p>
      ) : team.length === 0 ? (
        <p className="text-navy/50 text-sm">No team members yet. Add your first one above.</p>
      ) : (
        <div className="space-y-4">
          {team.map((m) => (
            <MemberForm
              key={m._id || m.key}
              member={m}
              onSave={saveMember}
              onDelete={m._id ? deleteMember : () => setTeam((prev) => prev.filter((x) => x !== m))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
