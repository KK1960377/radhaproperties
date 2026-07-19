import { ShieldCheck, Scale, Landmark, TrendingUp, Users, MapPinned } from "lucide-react";

const items = [
  { icon: ShieldCheck, title: "Verified Listings", text: "Every property is personally inspected and legally verified before it reaches you." },
  { icon: Scale, title: "Legal Assistance", text: "End-to-end support with documentation, title checks and registry formalities." },
  { icon: Landmark, title: "Home Loan Support", text: "Tie-ups with leading banks and NBFCs for fast, transparent loan approvals." },
  { icon: TrendingUp, title: "Property Valuation", text: "Data-backed pricing guidance so you buy right and sell for full value." },
  { icon: Users, title: "Personal Consultant", text: "One dedicated point of contact from first visit to final handover." },
  { icon: MapPinned, title: "Local Expertise", text: "Deep, on-ground knowledge of Gaur City & Greater Noida West micro-markets." },
];

const stats = [
  { target: "10+", label: "Years Experience" },
  { target: "500+", label: "Happy Clients" },
  { target: "1000+", label: "Properties Sold" },
  { target: "100%", label: "Verified Listings" },
];

export default function WhyUs() {
  return (
    <section id="why-us" className="bg-navy text-paper py-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <p className="text-gold uppercase tracking-[0.3em] text-xs mb-3 text-center">The Radha Difference</p>
        <h2 className="font-display text-3xl sm:text-5xl text-center mb-16">Why Clients Choose Us</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-20">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-4xl sm:text-5xl text-gold">{s.target}</p>
              <p className="text-xs sm:text-sm text-white/60 mt-2 tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(({ icon: Icon, title, text }) => (
            <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-7 card-hover">
              <Icon className="text-gold mb-4" size={28} />
              <h3 className="font-display text-lg mb-2">{title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
