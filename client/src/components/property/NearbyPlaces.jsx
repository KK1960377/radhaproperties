import { nearbyIcon } from "../../utils/propertyIcons";

export default function NearbyPlaces({ places }) {
  if (!places?.length) return null;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {places.map((place, i) => {
        const Icon = nearbyIcon(place.category);
        return (
          <div key={i} className="bg-white border border-navy/10 rounded-xl p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-navy/5 flex items-center justify-center shrink-0">
              <Icon size={16} className="text-navy/70" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">{place.name}</p>
              <p className="text-[11px] text-navy/50 mt-0.5">{place.category}{place.distance && ` · ${place.distance}`}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
