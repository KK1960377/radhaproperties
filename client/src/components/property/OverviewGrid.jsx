import {
  BedDouble,
  Bath,
  DoorOpen,
  Car,
  Compass,
  Layers,
  Building2,
  Calendar,
  Key,
  Ruler,
  Landmark,
  Sofa,
  ArrowUpDown,
  Zap,
  Droplets,
  Plug,
} from "lucide-react";

function Spec({ icon: Icon, label, value }) {
  if (value === undefined || value === null || value === "" || value === 0) return null;
  return (
    <div className="bg-white border border-navy/10 rounded-xl p-4 flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-navy/5 flex items-center justify-center shrink-0">
        <Icon size={16} className="text-navy/70" />
      </div>
      <div>
        <p className="text-[11px] text-navy/50">{label}</p>
        <p className="text-sm font-semibold mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function BoolSpec({ icon: Icon, label, value }) {
  return (
    <div className="bg-white border border-navy/10 rounded-xl p-4 flex items-start gap-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${value ? "bg-emerald-50" : "bg-navy/5"}`}>
        <Icon size={16} className={value ? "text-emerald-600" : "text-navy/30"} />
      </div>
      <div>
        <p className="text-[11px] text-navy/50">{label}</p>
        <p className="text-sm font-semibold mt-0.5">{value ? "Available" : "Not Available"}</p>
      </div>
    </div>
  );
}

export default function OverviewGrid({ p }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      <Spec icon={BedDouble} label="Bedrooms" value={p.beds} />
      <Spec icon={Bath} label="Bathrooms" value={p.baths} />
      <Spec icon={DoorOpen} label="Balcony" value={p.balcony} />
      <Spec icon={Car} label="Parking" value={p.parking} />
      <Spec icon={Compass} label="Facing" value={p.facing} />
      <Spec icon={Layers} label="Floor" value={p.floor} />
      <Spec icon={Building2} label="Total Floors" value={p.totalFloors} />
      <Spec icon={Calendar} label="Property Age" value={p.propertyAge} />
      <Spec icon={Key} label="Possession" value={p.possession} />
      <Spec icon={Ruler} label="Carpet Area" value={p.carpetArea} />
      <Spec icon={Ruler} label="Built-up Area" value={p.builtupArea} />
      <Spec icon={Ruler} label="Super Area" value={p.superArea} />
      <Spec icon={Ruler} label="Plot Area" value={p.plotArea} />
      <Spec icon={Landmark} label="Ownership" value={p.ownership} />
      <Spec icon={Sofa} label="Furnishing" value={p.furnishingStatus} />
      <Spec icon={Droplets} label="Water Supply" value={p.waterSupply} />
      <Spec icon={Plug} label="Electricity" value={p.electricity} />
      <BoolSpec icon={ArrowUpDown} label="Lift" value={p.lift} />
      <BoolSpec icon={Zap} label="Power Backup" value={p.powerBackup} />
    </div>
  );
}
