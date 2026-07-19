import { useEffect, useRef, useState } from "react";
import { UploadCloud, UserRound, Trash2, Save, ToggleLeft, ToggleRight } from "lucide-react";
import api from "../../api/axios";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

const emptyForm = {
  name: "",
  designation: "",
  experience: "",
  description: "",
  phone: "",
  email: "",
  whatsapp: "",
  address: "",
  buttonText: "Book a Consultation",
  buttonLink: "#contact",
  isActive: true,
};

export default function OwnerProfileManager() {
  const fileInputRef = useRef(null);
  const [form, setForm] = useState(emptyForm);
  const [photo, setPhoto] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text }

  useEffect(() => {
    api
      .get("/admin/owner")
      .then((res) => {
        const d = res.data;
        setForm({
          name: d.name || "",
          designation: d.designation || "",
          experience: d.experience || "",
          description: d.description || "",
          phone: d.phone || "",
          email: d.email || "",
          whatsapp: d.whatsapp || "",
          address: d.address || "",
          buttonText: d.buttonText || "Book a Consultation",
          buttonLink: d.buttonLink || "#contact",
          isActive: d.isActive !== undefined ? d.isActive : true,
        });
        setPhoto(d.photo || "");
      })
      .catch(() => setMessage({ type: "error", text: "Could not load owner profile." }))
      .finally(() => setLoading(false));
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validateFile(file) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      setMessage({ type: "error", text: "Only JPG, JPEG, PNG and WEBP images are allowed." });
      return false;
    }
    if (file.size > MAX_SIZE) {
      setMessage({ type: "error", text: "Image must be smaller than 5MB." });
      return false;
    }
    return true;
  }

  async function handleFile(file) {
    if (!file || !validateFile(file)) return;
    setMessage(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("photo", file);
      const { data } = await api.post("/admin/owner/upload-photo", fd);
      setPhoto(data.photo || "");
      setMessage({ type: "success", text: "Photo uploaded." });
    } catch (err) {
      setMessage({ type: "error", text: err?.response?.data?.message || "Upload failed." });
    } finally {
      setUploading(false);
    }
  }

  function onDrop(e) {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files?.[0]);
  }

  function onFileInput(e) {
    handleFile(e.target.files?.[0]);
    e.target.value = "";
  }

  async function removePhoto() {
    if (!confirm("Delete the current owner photo?")) return;
    try {
      const { data } = await api.delete("/admin/owner/photo");
      setPhoto(data.photo || "");
      setMessage({ type: "success", text: "Owner photo removed." });
    } catch (err) {
      setMessage({ type: "error", text: err?.response?.data?.message || "Could not remove photo." });
    }
  }

  function validateForm() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Owner name is required.";
    if (!form.designation.trim()) errs.designation = "Designation is required.";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email address.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (!validateForm()) {
      setMessage({ type: "error", text: "Please fix the highlighted fields." });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      await api.put("/admin/owner", form);
      setMessage({ type: "success", text: "Owner profile updated successfully. Changes are live on the website." });
    } catch (err) {
      setMessage({ type: "error", text: err?.response?.data?.message || "Could not save owner profile." });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-navy/50 text-sm">Loading...</p>;

  return (
    <div>
      <h2 className="font-display text-2xl mb-1 flex items-center gap-2">
        <UserRound size={22} className="text-gold" /> Owner Profile
      </h2>
      <p className="text-xs text-navy/50 mb-6">Company Management &rsaquo; Owner Profile — controls the dynamic About/Owner section on the client website.</p>

      {message && (
        <div className={`text-xs font-medium rounded-lg px-4 py-3 mb-5 ${message.type === "error" ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white border border-navy/10 rounded-2xl p-6 mb-6">
        <h3 className="font-display text-lg mb-4">Owner Photo</h3>
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`w-40 h-40 rounded-2xl border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden shrink-0 transition ${
              dragActive ? "border-gold bg-gold/10" : "border-navy/20 bg-navy/5"
            }`}
          >
            {photo ? (
              <img src={photo} alt="Owner" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center px-3">
                <UploadCloud className="mx-auto mb-1 text-navy/40" size={22} />
                <p className="text-[11px] text-navy/50">Drag &amp; drop or click to upload</p>
              </div>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" hidden onChange={onFileInput} />

          <div className="flex flex-col gap-2">
            <p className="text-xs text-navy/50 max-w-xs">JPG, PNG, JPEG or WEBP. Maximum size 5MB. Uploading a new photo automatically replaces &amp; deletes the old one.</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="text-xs font-semibold px-4 py-2 rounded-full border border-navy/20 flex items-center gap-1 hover:bg-navy/5 disabled:opacity-60">
                <UploadCloud size={14} /> {uploading ? "Uploading..." : photo ? "Change Photo" : "Upload Photo"}
              </button>
              {photo && (
                <button type="button" onClick={removePhoto} className="text-xs font-semibold px-4 py-2 rounded-full border border-red-300 text-red-500 flex items-center gap-1 hover:bg-red-50">
                  <Trash2 size={14} /> Remove Photo
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-navy/10 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg">Owner Details</h3>
          <button type="button" onClick={() => update("isActive", !form.isActive)} className="flex items-center gap-2 text-xs font-semibold">
            {form.isActive ? <ToggleRight size={28} className="text-emerald-500" /> : <ToggleLeft size={28} className="text-navy/30" />}
            {form.isActive ? "Section Active" : "Section Inactive"}
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-navy/60 mb-1 block">Owner Name *</label>
            <input value={form.name} onChange={(e) => update("name", e.target.value)} className={`border rounded-lg px-3 py-2.5 text-sm w-full ${errors.name ? "border-red-400" : "border-navy/10"}`} />
            {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-navy/60 mb-1 block">Designation *</label>
            <input value={form.designation} onChange={(e) => update("designation", e.target.value)} className={`border rounded-lg px-3 py-2.5 text-sm w-full ${errors.designation ? "border-red-400" : "border-navy/10"}`} />
            {errors.designation && <p className="text-[11px] text-red-500 mt-1">{errors.designation}</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-navy/60 mb-1 block">Experience</label>
            <input value={form.experience} onChange={(e) => update("experience", e.target.value)} placeholder="e.g. 10+ Years" className="border border-navy/10 rounded-lg px-3 py-2.5 text-sm w-full" />
          </div>
          <div>
            <label className="text-xs font-semibold text-navy/60 mb-1 block">Phone Number</label>
            <input value={form.phone} onChange={(e) => update("phone", e.target.value)} className="border border-navy/10 rounded-lg px-3 py-2.5 text-sm w-full" />
          </div>
          <div>
            <label className="text-xs font-semibold text-navy/60 mb-1 block">Email</label>
            <input value={form.email} onChange={(e) => update("email", e.target.value)} className={`border rounded-lg px-3 py-2.5 text-sm w-full ${errors.email ? "border-red-400" : "border-navy/10"}`} />
            {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-navy/60 mb-1 block">WhatsApp Number</label>
            <input value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} className="border border-navy/10 rounded-lg px-3 py-2.5 text-sm w-full" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-navy/60 mb-1 block">Office Address</label>
            <input value={form.address} onChange={(e) => update("address", e.target.value)} className="border border-navy/10 rounded-lg px-3 py-2.5 text-sm w-full" />
          </div>
          <div>
            <label className="text-xs font-semibold text-navy/60 mb-1 block">Button Text</label>
            <input value={form.buttonText} onChange={(e) => update("buttonText", e.target.value)} className="border border-navy/10 rounded-lg px-3 py-2.5 text-sm w-full" />
          </div>
          <div>
            <label className="text-xs font-semibold text-navy/60 mb-1 block">Button Link</label>
            <input value={form.buttonLink} onChange={(e) => update("buttonLink", e.target.value)} placeholder="#contact or https://..." className="border border-navy/10 rounded-lg px-3 py-2.5 text-sm w-full" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-navy/60 mb-1 block">Description</label>
            <textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={4} className="border border-navy/10 rounded-lg px-3 py-2.5 text-sm w-full" />
          </div>
        </div>
      </div>

      <button onClick={handleSave} disabled={saving} className="bg-navy text-paper px-6 py-3 rounded-full font-semibold text-sm flex items-center gap-2 disabled:opacity-60">
        <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
