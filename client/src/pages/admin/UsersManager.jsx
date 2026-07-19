import { useEffect, useState } from "react";
import { UserCog, Plus, Trash2 } from "lucide-react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function UsersManager() {
  const { admin } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  function load() {
    setLoading(true);
    api.get("/auth/admins").then((res) => setAdmins(res.data)).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function addAdmin(e) {
    e.preventDefault();
    setError("");
    if (!form.email.trim() || !form.password.trim()) {
      setError("Email and password are required.");
      return;
    }
    setCreating(true);
    try {
      await api.post("/auth/admins", form);
      setForm({ name: "", email: "", password: "" });
      load();
    } catch (err) {
      setError(err?.response?.data?.message || "Could not create admin user.");
    } finally {
      setCreating(false);
    }
  }

  async function remove(id) {
    if (!confirm("Remove this admin user's access?")) return;
    try {
      await api.delete(`/auth/admins/${id}`);
      setAdmins((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || "Could not delete admin.");
    }
  }

  return (
    <div>
      <h2 className="font-display text-2xl mb-6 flex items-center gap-2">
        <UserCog size={22} className="text-gold" /> Users
      </h2>
      <p className="text-xs text-navy/50 mb-4">Manage who can access this Admin Panel.</p>

      <form onSubmit={addAdmin} className="bg-white border border-navy/10 rounded-2xl p-6 grid sm:grid-cols-3 gap-3 mb-6">
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full Name"
          className="border border-navy/10 rounded-lg px-3 py-2.5 text-sm w-full" />
        <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" type="email"
          className="border border-navy/10 rounded-lg px-3 py-2.5 text-sm w-full" />
        <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" type="password"
          className="border border-navy/10 rounded-lg px-3 py-2.5 text-sm w-full" />
        {error && <p className="text-red-500 text-xs sm:col-span-3">{error}</p>}
        <button disabled={creating} className="sm:col-span-3 justify-self-start text-xs font-semibold px-5 py-2.5 rounded-full bg-navy text-paper flex items-center gap-1 disabled:opacity-60">
          <Plus size={14} /> {creating ? "Adding..." : "Add Admin User"}
        </button>
      </form>

      {loading ? (
        <p className="text-navy/50 text-sm">Loading...</p>
      ) : (
        <div className="bg-white border border-navy/10 rounded-2xl divide-y divide-navy/5">
          {admins.map((a) => (
            <div key={a._id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-semibold">{a.name} {a._id === admin?.id && <span className="text-[10px] text-gold ml-1">(You)</span>}</p>
                <p className="text-xs text-navy/50">{a.email}</p>
              </div>
              {a._id !== admin?.id && (
                <button onClick={() => remove(a._id)} className="text-red-500 hover:text-red-600" title="Remove">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
