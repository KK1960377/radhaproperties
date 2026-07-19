import { useEffect, useState } from "react";
import { Save, UploadCloud, Settings2 } from "lucide-react";
import api from "../../api/axios";
import { uploadFile } from "../../utils/upload";

const emptySettings = {
  companyName: "",
  companyLogo: "",
  favicon: "",
  aboutCompany: "",
  address: "",
  phone1: "",
  phone2: "",
  email: "",
  whatsapp: "",
  facebook: "",
  instagram: "",
  youtube: "",
  linkedin: "",
  twitter: "",
  officeTiming: "",
  mapLink: "",
};

function Field({ label, ...props }) {
  return (
    <div>
      <label className="text-xs font-semibold text-navy/60 mb-1 block">{label}</label>
      <input {...props} className="border border-navy/10 rounded-lg px-3 py-2.5 text-sm w-full" />
    </div>
  );
}

export default function CompanySettings() {
  const [settings, setSettings] = useState(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/settings").then((res) => setSettings({ ...emptySettings, ...res.data })).finally(() => setLoading(false));
  }, []);

  function update(field, value) {
    setSettings((s) => ({ ...s, [field]: value }));
  }

  async function handleLogoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    setError("");
    try {
      const url = await uploadFile(file);
      update("companyLogo", url);
    } catch (err) {
      setError(err.message || "Logo upload failed.");
    } finally {
      setUploadingLogo(false);
      e.target.value = "";
    }
  }

  async function handleFaviconUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFavicon(true);
    setError("");
    try {
      const url = await uploadFile(file);
      update("favicon", url);
    } catch (err) {
      setError(err.message || "Favicon upload failed.");
    } finally {
      setUploadingFavicon(false);
      e.target.value = "";
    }
  }

  async function save() {
    setSaving(true);
    setError("");
    try {
      const { data } = await api.put("/settings", settings);
      setSettings(data);
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 2500);
    } catch (err) {
      setError(err?.response?.data?.message || "Could not save settings.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-navy/50 text-sm">Loading...</p>;

  return (
    <div>
      <h2 className="font-display text-2xl mb-1 flex items-center gap-2">
        <Settings2 size={22} className="text-gold" /> Company Settings
      </h2>
      <p className="text-xs text-navy/50 mb-6">
        For the dynamic Owner section, see Company Management &rsaquo; Owner Profile.
      </p>

      {/* Company identity */}
      <section className="bg-white border border-navy/10 rounded-2xl p-6 mb-6">
        <h3 className="font-display text-lg mb-4">Company Identity</h3>
        <div className="flex flex-wrap items-start gap-8 mb-5">
          <div className="shrink-0">
            <p className="text-[11px] font-semibold text-navy/50 mb-1.5">Logo</p>
            <div className="w-20 h-20 rounded-2xl overflow-hidden border border-navy/10 bg-navy/5 flex items-center justify-center">
              {settings.companyLogo ? <img src={settings.companyLogo} alt="Logo" className="w-full h-full object-cover" /> : <span className="text-xs text-navy/30">No Logo</span>}
            </div>
            <label className="mt-2 text-[11px] font-semibold px-3 py-1.5 rounded-full border border-navy/20 flex items-center gap-1 cursor-pointer hover:bg-navy/5 justify-center">
              <UploadCloud size={12} /> {uploadingLogo ? "..." : "Upload"}
              <input type="file" accept="image/*" hidden disabled={uploadingLogo} onChange={handleLogoUpload} />
            </label>
          </div>
          <div className="shrink-0">
            <p className="text-[11px] font-semibold text-navy/50 mb-1.5">Favicon</p>
            <div className="w-20 h-20 rounded-2xl overflow-hidden border border-navy/10 bg-navy/5 flex items-center justify-center">
              {settings.favicon ? <img src={settings.favicon} alt="Favicon" className="w-full h-full object-cover" /> : <span className="text-xs text-navy/30">None</span>}
            </div>
            <label className="mt-2 text-[11px] font-semibold px-3 py-1.5 rounded-full border border-navy/20 flex items-center gap-1 cursor-pointer hover:bg-navy/5 justify-center">
              <UploadCloud size={12} /> {uploadingFavicon ? "..." : "Upload"}
              <input type="file" accept="image/*" hidden disabled={uploadingFavicon} onChange={handleFaviconUpload} />
            </label>
          </div>
          <div className="flex-1 grid sm:grid-cols-2 gap-4 min-w-[240px]">
            <Field label="Company Name" value={settings.companyName} onChange={(e) => update("companyName", e.target.value)} />
            <Field label="Office Timing" value={settings.officeTiming} onChange={(e) => update("officeTiming", e.target.value)} />
          </div>
        </div>
        <label className="text-xs font-semibold text-navy/60 mb-1 block">About Company</label>
        <textarea value={settings.aboutCompany} onChange={(e) => update("aboutCompany", e.target.value)} rows={3}
          className="border border-navy/10 rounded-lg px-3 py-2.5 text-sm w-full" />
      </section>

      {/* Contact details */}
      <section className="bg-white border border-navy/10 rounded-2xl p-6 mb-6">
        <h3 className="font-display text-lg mb-4">Contact Details</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Phone Number 1" value={settings.phone1} onChange={(e) => update("phone1", e.target.value)} />
          <Field label="Phone Number 2" value={settings.phone2} onChange={(e) => update("phone2", e.target.value)} />
          <Field label="Email Address" value={settings.email} onChange={(e) => update("email", e.target.value)} />
          <Field label="WhatsApp Number" value={settings.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} />
          <Field label="Address" value={settings.address} onChange={(e) => update("address", e.target.value)} className="sm:col-span-2" />
          <Field label="Google Maps Embed URL" value={settings.mapLink} onChange={(e) => update("mapLink", e.target.value)} />
        </div>
      </section>

      {/* Social links */}
      <section className="bg-white border border-navy/10 rounded-2xl p-6 mb-6">
        <h3 className="font-display text-lg mb-4">Social Media</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Facebook Link" value={settings.facebook} onChange={(e) => update("facebook", e.target.value)} />
          <Field label="Instagram Link" value={settings.instagram} onChange={(e) => update("instagram", e.target.value)} />
          <Field label="YouTube Link" value={settings.youtube} onChange={(e) => update("youtube", e.target.value)} />
          <Field label="LinkedIn Link" value={settings.linkedin} onChange={(e) => update("linkedin", e.target.value)} />
          <Field label="Twitter / X Link" value={settings.twitter} onChange={(e) => update("twitter", e.target.value)} />
        </div>
      </section>

      {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
      <button onClick={save} disabled={saving} className="bg-navy text-paper px-6 py-3 rounded-full font-semibold text-sm flex items-center gap-2 disabled:opacity-60">
        <Save size={16} /> {saving ? "Saving..." : "Save All Changes"}
      </button>
      {savedMsg && <span className="ml-3 text-xs text-emerald-600">Saved! Changes are live on the website.</span>}
    </div>
  );
}
