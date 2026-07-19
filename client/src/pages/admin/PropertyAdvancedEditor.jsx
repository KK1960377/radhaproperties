import { useState } from "react";
import { Plus, Trash2, UploadCloud, X } from "lucide-react";
import { uploadFile } from "../../utils/upload";
import { AMENITY_LIST, FEATURE_LIST, FURNISHING_LIST, FURNISHING_TYPES } from "../../utils/propertyIcons";
import { NEARBY_CATEGORIES } from "../../utils/propertyIcons";

function Field({ label, ...props }) {
  return (
    <div>
      <label className="text-[11px] font-semibold text-navy/50 mb-1 block">{label}</label>
      <input {...props} className="border border-navy/10 rounded-lg px-3 py-2 text-sm w-full" />
    </div>
  );
}

function CheckboxGrid({ options, selected, onToggle }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-2 text-xs bg-navy/[0.03] rounded-lg px-3 py-2 cursor-pointer">
          <input type="checkbox" checked={selected.includes(opt)} onChange={() => onToggle(opt)} />
          {opt}
        </label>
      ))}
    </div>
  );
}

export default function PropertyAdvancedEditor({ form, update, team }) {
  const [docUploading, setDocUploading] = useState(false);
  const [docError, setDocError] = useState("");
  const [featuredUploading, setFeaturedUploading] = useState(false);

  function toggleListItem(field, value) {
    const list = form[field] || [];
    update(field, list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  }

  function updateNested(field, key, value) {
    update(field, { ...(form[field] || {}), [key]: value });
  }

  function updateArrayItem(field, index, patch) {
    const arr = [...(form[field] || [])];
    arr[index] = { ...arr[index], ...patch };
    update(field, arr);
  }

  function addArrayItem(field, item) {
    update(field, [...(form[field] || []), item]);
  }

  function removeArrayItem(field, index) {
    update(field, (form[field] || []).filter((_, i) => i !== index));
  }

  async function handleDocUpload(index, file) {
    if (!file) return;
    setDocError("");
    setDocUploading(true);
    try {
      const url = await uploadFile(file);
      updateArrayItem("documents", index, { url });
    } catch (err) {
      setDocError(err.message || "Upload failed.");
    } finally {
      setDocUploading(false);
    }
  }

  async function handleFeaturedUpload(file) {
    if (!file) return;
    setFeaturedUploading(true);
    try {
      const url = await uploadFile(file);
      update("featuredImage", url);
    } catch (err) {
      setDocError(err.message || "Upload failed.");
    } finally {
      setFeaturedUploading(false);
    }
  }

  return (
    <div className="mt-4 pt-4 border-t border-navy/10 space-y-6">
      {/* Identification */}
      <div>
        <p className="text-xs font-semibold text-navy/60 mb-2">Identification</p>
        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-navy/50 mb-1 block">Category</label>
            <select value={form.category || "Residential"} onChange={(e) => update("category", e.target.value)} className="border border-navy/10 rounded-lg px-3 py-2 text-sm w-full">
              {["Residential", "Commercial", "Land"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-navy/50 mb-1 block">Purpose</label>
            <select value={form.purpose || "Sale"} onChange={(e) => update("purpose", e.target.value)} className="border border-navy/10 rounded-lg px-3 py-2 text-sm w-full">
              {["Sale", "Rent"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <Field label="Builder" value={form.builder || ""} onChange={(e) => update("builder", e.target.value)} />
          <Field label="Builder Logo URL" value={form.builderLogo || ""} onChange={(e) => update("builderLogo", e.target.value)} />
          <Field label="Project Name" value={form.projectName || ""} onChange={(e) => update("projectName", e.target.value)} />
          <Field label="Society Name" value={form.societyName || ""} onChange={(e) => update("societyName", e.target.value)} />
          <Field label="Building Name" value={form.buildingName || ""} onChange={(e) => update("buildingName", e.target.value)} />
          <Field label="Tower" value={form.tower || ""} onChange={(e) => update("tower", e.target.value)} />
          <Field label="Wing" value={form.wing || ""} onChange={(e) => update("wing", e.target.value)} />
          <Field label="Block" value={form.block || ""} onChange={(e) => update("block", e.target.value)} />
        </div>
        <div className="mt-3">
          <label className="text-[11px] font-semibold text-navy/50 mb-1 block">Builder Description (shown in the Builder Information section)</label>
          <textarea rows={2} value={form.builderDescription || ""} onChange={(e) => update("builderDescription", e.target.value)}
            placeholder="Short description of the builder shown on the property detail page..."
            className="border border-navy/10 rounded-lg px-3 py-2 text-sm w-full" />
        </div>
      </div>

      {/* Building details */}
      <div>
        <p className="text-xs font-semibold text-navy/60 mb-2">Building Details</p>
        <div className="grid sm:grid-cols-3 gap-3">
          <Field label="Total Towers" value={form.totalTowers || ""} onChange={(e) => update("totalTowers", e.target.value)} />
          <Field label="Total Flats in Building" value={form.totalFlatsInBuilding || ""} onChange={(e) => update("totalFlatsInBuilding", e.target.value)} />
          <Field label="Flats Per Floor" value={form.flatsPerFloor || ""} onChange={(e) => update("flatsPerFloor", e.target.value)} />
          <Field label="Flat Number" value={form.flatNumber || ""} onChange={(e) => update("flatNumber", e.target.value)} />
          <Field label="Unit Number" value={form.unitNumber || ""} onChange={(e) => update("unitNumber", e.target.value)} />
          <Field label="Lift Count" type="number" min="0" value={form.liftCount || 0} onChange={(e) => update("liftCount", e.target.value)} />
          <Field label="Visitor Parking" type="number" min="0" value={form.visitorParking || 0} onChange={(e) => update("visitorParking", e.target.value)} />
          <Field label="Basement Parking" type="number" min="0" value={form.basementParking || 0} onChange={(e) => update("basementParking", e.target.value)} />
          <Field label="Covered Parking" type="number" min="0" value={form.coveredParking || 0} onChange={(e) => update("coveredParking", e.target.value)} />
          <Field label="Open Parking" type="number" min="0" value={form.openParking || 0} onChange={(e) => update("openParking", e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-5 mt-2">
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={!!form.serviceLift} onChange={(e) => update("serviceLift", e.target.checked)} /> Service Lift
          </label>
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={!!form.fireExit} onChange={(e) => update("fireExit", e.target.checked)} /> Fire Exit
          </label>
        </div>
      </div>

      {/* Room details */}
      <div>
        <p className="text-xs font-semibold text-navy/60 mb-2">Room Details</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            ["livingRoom", "Living Room"], ["diningRoom", "Dining Room"], ["drawingRoom", "Drawing Room"], ["kitchen", "Kitchen"],
            ["modularKitchen", "Modular Kitchen"], ["storeRoom", "Store Room"], ["studyRoom", "Study Room"],
            ["servantRoom", "Servant Room"], ["poojaRoom", "Pooja Room"], ["utility", "Utility"], ["dryBalcony", "Dry Balcony"], ["terrace", "Terrace"],
          ].map(([field, label]) => (
            <label key={field} className="flex items-center gap-2 text-xs bg-navy/[0.03] rounded-lg px-3 py-2 cursor-pointer">
              <input type="checkbox" checked={!!form[field]} onChange={(e) => update(field, e.target.checked)} />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* Top section extras */}
      <div>
        <p className="text-xs font-semibold text-navy/60 mb-2">Top Section</p>
        <div className="grid sm:grid-cols-3 gap-3">
          <Field label="BHK (e.g. 3 BHK)" value={form.bhk || ""} onChange={(e) => update("bhk", e.target.value)} />
          <Field label="Price Per Sq.Ft" value={form.pricePerSqft || ""} onChange={(e) => update("pricePerSqft", e.target.value)} />
          <Field label="RERA ID" value={form.reraId || ""} onChange={(e) => update("reraId", e.target.value)} />
        </div>
        <label className="flex items-center gap-2 text-xs mt-2">
          <input type="checkbox" checked={!!form.reraRegistered} onChange={(e) => update("reraRegistered", e.target.checked)} />
          RERA Registered
        </label>
      </div>

      {/* Overview specs */}
      <div>
        <p className="text-xs font-semibold text-navy/60 mb-2">Overview Specs</p>
        <div className="grid sm:grid-cols-3 gap-3">
          <Field label="Balcony" type="number" min="0" value={form.balcony || 0} onChange={(e) => update("balcony", e.target.value)} />
          <Field label="Facing" value={form.facing || ""} onChange={(e) => update("facing", e.target.value)} placeholder="East / West..." />
          <Field label="Floor" value={form.floor || ""} onChange={(e) => update("floor", e.target.value)} />
          <Field label="Total Floors" value={form.totalFloors || ""} onChange={(e) => update("totalFloors", e.target.value)} />
          <Field label="Property Age" value={form.propertyAge || ""} onChange={(e) => update("propertyAge", e.target.value)} placeholder="e.g. 2 Years" />
          <Field label="Possession" value={form.possession || ""} onChange={(e) => update("possession", e.target.value)} placeholder="e.g. Ready / Dec 2026" />
          <Field label="Carpet Area" value={form.carpetArea || ""} onChange={(e) => update("carpetArea", e.target.value)} />
          <Field label="Built-up Area" value={form.builtupArea || ""} onChange={(e) => update("builtupArea", e.target.value)} />
          <Field label="Super Area" value={form.superArea || ""} onChange={(e) => update("superArea", e.target.value)} />
          <Field label="Plot Area" value={form.plotArea || ""} onChange={(e) => update("plotArea", e.target.value)} />
          <Field label="Floor Height" value={form.floorHeight || ""} onChange={(e) => update("floorHeight", e.target.value)} placeholder="e.g. 10 ft" />
          <Field label="Ceiling Height" value={form.ceilingHeight || ""} onChange={(e) => update("ceilingHeight", e.target.value)} placeholder="e.g. 9.5 ft" />
          <Field label="Ownership" value={form.ownership || ""} onChange={(e) => update("ownership", e.target.value)} placeholder="Freehold / Leasehold" />
          <div>
            <label className="text-[11px] font-semibold text-navy/50 mb-1 block">Furnishing Type</label>
            <select value={form.furnishingType || "Unfurnished"} onChange={(e) => update("furnishingType", e.target.value)} className="border border-navy/10 rounded-lg px-3 py-2 text-sm w-full">
              {FURNISHING_TYPES.map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
          <Field label="Furnishing Status (extra note)" value={form.furnishingStatus || ""} onChange={(e) => update("furnishingStatus", e.target.value)} placeholder="Optional free-text note" />
          <Field label="Water Supply" value={form.waterSupply || ""} onChange={(e) => update("waterSupply", e.target.value)} />
          <Field label="Electricity" value={form.electricity || ""} onChange={(e) => update("electricity", e.target.value)} />
        </div>
        <div className="flex gap-5 mt-2">
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={!!form.lift} onChange={(e) => update("lift", e.target.checked)} /> Lift Available
          </label>
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={!!form.powerBackup} onChange={(e) => update("powerBackup", e.target.checked)} /> Power Backup
          </label>
        </div>
      </div>

      {/* Description */}
      <div>
        <p className="text-xs font-semibold text-navy/60 mb-2">Description</p>
        <textarea rows={4} value={form.description || ""} onChange={(e) => update("description", e.target.value)}
          placeholder="Full property description shown on the detail page..."
          className="border border-navy/10 rounded-lg px-3 py-2 text-sm w-full" />
      </div>

      {/* Amenities */}
      <div>
        <p className="text-xs font-semibold text-navy/60 mb-2">Amenities</p>
        <CheckboxGrid options={AMENITY_LIST} selected={form.amenities || []} onToggle={(v) => toggleListItem("amenities", v)} />
      </div>

      {/* Features */}
      <div>
        <p className="text-xs font-semibold text-navy/60 mb-2">Property Features (Highlights)</p>
        <CheckboxGrid options={FEATURE_LIST} selected={form.features || []} onToggle={(v) => toggleListItem("features", v)} />
      </div>

      {/* Furnishing */}
      <div>
        <p className="text-xs font-semibold text-navy/60 mb-2">Furnishing Items</p>
        <CheckboxGrid options={FURNISHING_LIST} selected={form.furnishingItems || []} onToggle={(v) => toggleListItem("furnishingItems", v)} />
      </div>

      {/* Furnishing quantities */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-navy/60">Furniture Quantity (e.g. Beds: 2, AC: 1)</p>
          <button type="button" onClick={() => addArrayItem("furnishingQty", { item: "", quantity: 1 })}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-navy/20 flex items-center gap-1">
            <Plus size={12} /> Add Item
          </button>
        </div>
        <div className="space-y-2">
          {(form.furnishingQty || []).map((row, i) => (
            <div key={i} className="grid grid-cols-[1fr_100px_auto] gap-2 items-center">
              <input value={row.item} onChange={(e) => updateArrayItem("furnishingQty", i, { item: e.target.value })} placeholder="Item (e.g. Wardrobes)"
                className="border border-navy/10 rounded-lg px-2.5 py-2 text-xs w-full" />
              <input type="number" min="0" value={row.quantity} onChange={(e) => updateArrayItem("furnishingQty", i, { quantity: Number(e.target.value) })}
                className="border border-navy/10 rounded-lg px-2.5 py-2 text-xs w-full" />
              <button type="button" onClick={() => removeArrayItem("furnishingQty", i)} className="text-red-500">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <p className="text-xs font-semibold text-navy/60 mb-2">Location</p>
        <div className="grid sm:grid-cols-3 gap-3 mb-3">
          <Field label="Country" value={form.country || "India"} onChange={(e) => update("country", e.target.value)} />
          <Field label="State" value={form.state || ""} onChange={(e) => update("state", e.target.value)} />
          <Field label="City" value={form.city || ""} onChange={(e) => update("city", e.target.value)} />
          <Field label="Sector" value={form.sector || ""} onChange={(e) => update("sector", e.target.value)} />
          <Field label="Locality / Area" value={form.locality || ""} onChange={(e) => update("locality", e.target.value)} />
          <Field label="Landmark" value={form.landmark || ""} onChange={(e) => update("landmark", e.target.value)} />
          <Field label="Pincode" value={form.pincode || ""} onChange={(e) => update("pincode", e.target.value)} />
          <Field label="Latitude" type="number" step="any" value={form.latitude ?? ""} onChange={(e) => update("latitude", e.target.value === "" ? null : Number(e.target.value))} />
          <Field label="Longitude" type="number" step="any" value={form.longitude ?? ""} onChange={(e) => update("longitude", e.target.value === "" ? null : Number(e.target.value))} />
        </div>
        <Field label="Google Maps Embed URL" value={form.mapLink || ""} onChange={(e) => update("mapLink", e.target.value)} />
      </div>

      {/* Nearby places */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-navy/60">Nearby Places</p>
          <button type="button" onClick={() => addArrayItem("nearbyPlaces", { name: "", category: "Other", distance: "" })}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-navy/20 flex items-center gap-1">
            <Plus size={12} /> Add Place
          </button>
        </div>
        <div className="space-y-2">
          {(form.nearbyPlaces || []).map((place, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
              <input value={place.name} onChange={(e) => updateArrayItem("nearbyPlaces", i, { name: e.target.value })} placeholder="Name"
                className="border border-navy/10 rounded-lg px-2.5 py-2 text-xs w-full" />
              <select value={place.category} onChange={(e) => updateArrayItem("nearbyPlaces", i, { category: e.target.value })}
                className="border border-navy/10 rounded-lg px-2.5 py-2 text-xs w-full">
                {NEARBY_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <input value={place.distance} onChange={(e) => updateArrayItem("nearbyPlaces", i, { distance: e.target.value })} placeholder="Distance (1.2 km)"
                className="border border-navy/10 rounded-lg px-2.5 py-2 text-xs w-full" />
              <button type="button" onClick={() => removeArrayItem("nearbyPlaces", i)} className="text-red-500">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Price details */}
      <div>
        <p className="text-xs font-semibold text-navy/60 mb-2">Price Details</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Booking Amount" value={form.priceDetails?.bookingAmount || ""} onChange={(e) => updateNested("priceDetails", "bookingAmount", e.target.value)} />
          <Field label="Maintenance" value={form.priceDetails?.maintenance || ""} onChange={(e) => updateNested("priceDetails", "maintenance", e.target.value)} />
          <Field label="Registry Charges" value={form.priceDetails?.registryCharges || ""} onChange={(e) => updateNested("priceDetails", "registryCharges", e.target.value)} />
          <Field label="Stamp Duty" value={form.priceDetails?.stampDuty || ""} onChange={(e) => updateNested("priceDetails", "stampDuty", e.target.value)} />
          <Field label="Security Deposit" value={form.priceDetails?.securityDeposit || ""} onChange={(e) => updateNested("priceDetails", "securityDeposit", e.target.value)} />
          <Field label="GST" value={form.priceDetails?.gst || ""} onChange={(e) => updateNested("priceDetails", "gst", e.target.value)} />
          <Field label="PLC Charges" value={form.priceDetails?.plcCharges || ""} onChange={(e) => updateNested("priceDetails", "plcCharges", e.target.value)} />
          <Field label="Monthly Rent" value={form.priceDetails?.monthlyRent || ""} onChange={(e) => updateNested("priceDetails", "monthlyRent", e.target.value)} placeholder="If purpose is Rent" />
          <Field label="EMI (text)" value={form.priceDetails?.emi || ""} onChange={(e) => updateNested("priceDetails", "emi", e.target.value)} placeholder="Shown alongside the calculator" />
        </div>
        <label className="flex items-center gap-2 text-xs mt-2">
          <input type="checkbox" checked={!!form.priceDetails?.negotiable} onChange={(e) => updateNested("priceDetails", "negotiable", e.target.checked)} />
          Price Negotiable
        </label>
      </div>

      {/* Documents */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-navy/60">Documents (Brochure, Floor Plan, Price List...)</p>
          <button type="button" onClick={() => addArrayItem("documents", { label: "", url: "" })}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-navy/20 flex items-center gap-1">
            <Plus size={12} /> Add Document
          </button>
        </div>
        <div className="space-y-2">
          {(form.documents || []).map((doc, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-center">
              <input value={doc.label} onChange={(e) => updateArrayItem("documents", i, { label: e.target.value })} placeholder="Label (e.g. Brochure)"
                className="border border-navy/10 rounded-lg px-2.5 py-2 text-xs w-full" />
              <input value={doc.url} onChange={(e) => updateArrayItem("documents", i, { url: e.target.value })} placeholder="PDF URL"
                className="border border-navy/10 rounded-lg px-2.5 py-2 text-xs w-full" />
              <label className="text-[11px] font-semibold px-2.5 py-2 rounded-lg border border-navy/20 flex items-center gap-1 cursor-pointer whitespace-nowrap">
                <UploadCloud size={12} /> {docUploading ? "..." : "Upload"}
                <input type="file" accept="application/pdf,image/*" hidden onChange={(e) => handleDocUpload(i, e.target.files?.[0])} />
              </label>
              <button type="button" onClick={() => removeArrayItem("documents", i)} className="text-red-500">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        {docError && <p className="text-[11px] text-red-500 mt-1">{docError}</p>}
      </div>

      {/* Video */}
      <div>
        <p className="text-xs font-semibold text-navy/60 mb-2">Property Video</p>
        <Field label="YouTube URL" value={form.videoUrl || ""} onChange={(e) => update("videoUrl", e.target.value)} placeholder="https://youtube.com/watch?v=..." />
      </div>

      {/* Additional media */}
      <div>
        <p className="text-xs font-semibold text-navy/60 mb-2">Additional Media</p>
        <div className="grid sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-[11px] font-semibold text-navy/50 mb-1 block">Featured Image URL</label>
            <div className="flex gap-2 items-center">
              <input value={form.featuredImage || ""} onChange={(e) => update("featuredImage", e.target.value)}
                placeholder="Falls back to the first gallery photo if left blank"
                className="border border-navy/10 rounded-lg px-3 py-2 text-sm w-full" />
              <label className="text-[11px] font-semibold px-2.5 py-2 rounded-lg border border-navy/20 flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0">
                <UploadCloud size={12} /> {featuredUploading ? "..." : "Upload"}
                <input type="file" accept="image/*" hidden onChange={(e) => handleFeaturedUpload(e.target.files?.[0])} />
              </label>
            </div>
          </div>
          <Field label="Virtual Tour Link" value={form.virtualTourUrl || ""} onChange={(e) => update("virtualTourUrl", e.target.value)} placeholder="https://..." />
        </div>
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-semibold text-navy/50">360° Image URLs</label>
            <button type="button" onClick={() => addArrayItem("images360", "")} className="text-[11px] font-semibold px-2 py-0.5 rounded-full border border-navy/20 flex items-center gap-1">
              <Plus size={11} /> Add
            </button>
          </div>
          {(form.images360 || []).map((url, i) => (
            <div key={i} className="flex gap-2 mb-1.5">
              <input value={url} onChange={(e) => { const arr = [...(form.images360 || [])]; arr[i] = e.target.value; update("images360", arr); }}
                placeholder="360° image URL" className="border border-navy/10 rounded-lg px-2.5 py-2 text-xs w-full" />
              <button type="button" onClick={() => removeArrayItem("images360", i)} className="text-red-500"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-semibold text-navy/50">Additional Video URLs</label>
            <button type="button" onClick={() => addArrayItem("videos", "")} className="text-[11px] font-semibold px-2 py-0.5 rounded-full border border-navy/20 flex items-center gap-1">
              <Plus size={11} /> Add
            </button>
          </div>
          {(form.videos || []).map((url, i) => (
            <div key={i} className="flex gap-2 mb-1.5">
              <input value={url} onChange={(e) => { const arr = [...(form.videos || [])]; arr[i] = e.target.value; update("videos", arr); }}
                placeholder="Video URL" className="border border-navy/10 rounded-lg px-2.5 py-2 text-xs w-full" />
              <button type="button" onClick={() => removeArrayItem("videos", i)} className="text-red-500"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </div>

      {/* SEO */}
      <div>
        <p className="text-xs font-semibold text-navy/60 mb-2">SEO</p>
        <div className="grid sm:grid-cols-2 gap-3 mb-3">
          <Field label="Meta Title" value={form.seo?.metaTitle || ""} onChange={(e) => updateNested("seo", "metaTitle", e.target.value)} placeholder="Falls back to property title" />
          <Field label="Canonical URL" value={form.seo?.canonicalUrl || ""} onChange={(e) => updateNested("seo", "canonicalUrl", e.target.value)} />
          <Field label="Meta Keywords" value={form.seo?.metaKeywords || ""} onChange={(e) => updateNested("seo", "metaKeywords", e.target.value)} placeholder="comma, separated, keywords" />
          <Field label="Open Graph Image URL" value={form.seo?.ogImage || ""} onChange={(e) => updateNested("seo", "ogImage", e.target.value)} placeholder="Falls back to featured image" />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-navy/50 mb-1 block">Meta Description</label>
          <textarea rows={2} value={form.seo?.metaDescription || ""} onChange={(e) => updateNested("seo", "metaDescription", e.target.value)}
            placeholder="Falls back to the property description..."
            className="border border-navy/10 rounded-lg px-3 py-2 text-sm w-full" />
        </div>
      </div>

      {/* Agent */}
      <div>
        <p className="text-xs font-semibold text-navy/60 mb-2">Assigned Agent</p>
        <select
          value={form.agent?._id || form.agent || ""}
          onChange={(e) => update("agent", e.target.value || null)}
          className="border border-navy/10 rounded-lg px-3 py-2 text-sm w-full sm:w-1/2"
        >
          <option value="">No agent (use Owner Profile as contact)</option>
          {team.map((m) => <option key={m._id} value={m._id}>{m.name} — {m.designation}</option>)}
        </select>
      </div>
    </div>
  );
}
