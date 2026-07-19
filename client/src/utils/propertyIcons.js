import {
  ArrowUpDown, Dumbbell, Waves, Users, Baby, Trees, ShieldCheck, Camera, Zap,
  Phone, Flower2, Footprints, ParkingCircle, Flame, CloudRain, Landmark,
  ShoppingBag, Hospital, School, TrainFront, Sparkles, Wind, Fan, Lightbulb,
  Archive, ChefHat, Armchair, BedDouble, UtensilsCrossed, Tv, Refrigerator,
  WashingMachine, CheckCircle2, Building2, Bus, Plane, MapPin,
  BatteryCharging, Gamepad2, Target, Trophy, Church, Store, Compass,
  RectangleHorizontal, Route, LockKeyholeOpen, Star, Accessibility, PawPrint,
  GraduationCap, TrainTrack, Cross, ShieldPlus, Microwave, Waves as Dishwasher,
  Droplet, Utensils, Flame as Stove, Blinds, GraduationCap as StudyTable,
  Briefcase, Footprints as ShoeRack, Sofa,
} from "lucide-react";

// Amenities — icon cards
export const AMENITY_ICONS = {
  Lift: ArrowUpDown,
  Gym: Dumbbell,
  "Swimming Pool": Waves,
  "Club House": Users,
  "Kids Play Area": Baby,
  Garden: Flower2,
  Park: Trees,
  "Jogging Track": Footprints,
  "Community Hall": Landmark,
  Temple: Church,
  Security: ShieldCheck,
  CCTV: Camera,
  "Power Backup": Zap,
  "Fire Safety": Flame,
  "Rain Water Harvesting": CloudRain,
  "EV Charging": BatteryCharging,
  "Indoor Games": Gamepad2,
  "Outdoor Games": Target,
  "Basketball Court": Trophy,
  "Badminton Court": Trophy,
  "Tennis Court": Trophy,
  "Cricket Ground": Trophy,
  "Yoga Room": Sparkles,
  Spa: Sparkles,
  ATM: Store,
  "Medical Store": Cross,
  Restaurant: Store,
  Intercom: Phone,
  "Visitor Parking": ParkingCircle,
  "Shopping Area": ShoppingBag,
  "Hospital Nearby": Hospital,
  "School Nearby": School,
  "Metro Nearby": TrainFront,
};
export const AMENITY_LIST = Object.keys(AMENITY_ICONS);
export function amenityIcon(name) {
  return AMENITY_ICONS[name] || Sparkles;
}

// Furniture / furnishing items — icon grid (with admin-set quantities)
export const FURNISHING_ICONS = {
  Beds: BedDouble,
  Wardrobes: Archive,
  Sofa: Armchair,
  "Dining Table": UtensilsCrossed,
  "TV Unit": Tv,
  TV: Tv,
  AC: Wind,
  Fans: Fan,
  Lights: Lightbulb,
  Geyser: Flame,
  Refrigerator: Refrigerator,
  "Washing Machine": WashingMachine,
  Microwave: Microwave,
  Dishwasher: Dishwasher,
  RO: Droplet,
  Chimney: Utensils,
  "Gas Pipeline": Flame,
  Stove: Stove,
  Curtains: Blinds,
  "Study Table": StudyTable,
  "Office Table": Briefcase,
  "Shoe Rack": ShoeRack,
  "Dressing Table": Sofa,
  "Modular Kitchen": ChefHat,
};
export const FURNISHING_LIST = Object.keys(FURNISHING_ICONS);
export function furnishingIcon(name) {
  return FURNISHING_ICONS[name] || CheckCircle2;
}

// Furnishing type — Unfurnished / Semi Furnished / Fully Furnished
export const FURNISHING_TYPES = ["Unfurnished", "Semi Furnished", "Fully Furnished"];

// Property highlight features
export const FEATURE_LIST = [
  "Corner Property",
  "Corner Plot",
  "Park Facing",
  "Pool Facing",
  "Garden Facing",
  "East Facing",
  "West Facing",
  "North Facing",
  "South Facing",
  "Vastu Compliant",
  "Premium Location",
  "Wide Road",
  "Gated Society",
  "Pet Friendly",
  "Wheelchair Accessible",
  "Ready To Move",
  "New Launch",
];
export function featureIcon() {
  return Sparkles;
}

// Nearby place categories
export const NEARBY_CATEGORY_ICONS = {
  School: School,
  College: GraduationCap,
  Hospital: Hospital,
  Metro: TrainFront,
  "Railway Station": TrainTrack,
  "Bus Stand": Bus,
  Mall: ShoppingBag,
  Market: ShoppingBag,
  Temple: Church,
  Airport: Plane,
  Other: MapPin,
};
export const NEARBY_CATEGORIES = Object.keys(NEARBY_CATEGORY_ICONS);
export function nearbyIcon(category) {
  return NEARBY_CATEGORY_ICONS[category] || MapPin;
}
