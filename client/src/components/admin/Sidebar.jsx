import { useState } from "react";
import {
  LayoutDashboard,
  Building2,
  Tags,
  Users2,
  Settings2,
  MessageSquareText,
  UserCog,
  LogOut,
  X,
  ChevronDown,
  Building,
  UserRound,
  LayoutTemplate,
  Newspaper,
  HelpCircle,
  MessageSquareQuote,
} from "lucide-react";

export const NAV = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "properties", label: "Properties", icon: Building2 },
  { key: "categories", label: "Property Categories", icon: Tags },
  { key: "team", label: "Team Management", icon: Users2 },
  {
    key: "company-group",
    label: "Company Management",
    icon: Building,
    children: [
      { key: "company", label: "Company Settings", icon: Settings2 },
      { key: "owner", label: "Owner Profile", icon: UserRound },
    ],
  },
  {
    key: "content-group",
    label: "Website Content",
    icon: LayoutTemplate,
    children: [
      { key: "home-content", label: "Home Page", icon: LayoutTemplate },
      { key: "blogs", label: "Blogs", icon: Newspaper },
      { key: "faqs", label: "FAQs", icon: HelpCircle },
      { key: "testimonials", label: "Testimonials", icon: MessageSquareQuote },
    ],
  },
  { key: "inquiries", label: "Inquiries", icon: MessageSquareText },
  { key: "users", label: "Users", icon: UserCog },
];

const GROUP_KEYS = NAV.filter((i) => i.children).map((i) => i.key);

export default function Sidebar({ active, onSelect, onLogout, open, onClose, companyName }) {
  // Auto-expand whichever group contains the active tab
  const [expanded, setExpanded] = useState(() => {
    const found = NAV.find((i) => i.children?.some((c) => c.key === active));
    return found ? [found.key] : GROUP_KEYS;
  });

  function toggleGroup(key) {
    setExpanded((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-navy text-paper flex flex-col z-50 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
          <div>
            <p className="font-display text-lg leading-tight">{companyName}</p>
            <p className="text-[11px] text-gold/80 uppercase tracking-widest">Admin Panel</p>
          </div>
          <button className="lg:hidden text-white/60" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV.map((item) =>
            item.children ? (
              <div key={item.key}>
                <button
                  onClick={() => toggleGroup(item.key)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition ${
                    item.children.some((c) => c.key === active) ? "text-gold" : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <item.icon size={17} /> {item.label}
                  </span>
                  <ChevronDown size={15} className={`transition-transform ${expanded.includes(item.key) ? "rotate-180" : ""}`} />
                </button>
                {expanded.includes(item.key) && (
                  <div className="ml-4 pl-3 border-l border-white/10 space-y-1 mt-1">
                    {item.children.map((c) => (
                      <button
                        key={c.key}
                        onClick={() => {
                          onSelect(c.key);
                          onClose();
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                          active === c.key ? "bg-gold text-navy" : "text-white/70 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <c.icon size={16} /> {c.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                key={item.key}
                onClick={() => {
                  onSelect(item.key);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  active === item.key ? "bg-gold text-navy" : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon size={17} /> {item.label}
              </button>
            )
          )}
        </nav>

        <div className="p-3 border-t border-white/10">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white transition"
          >
            <LogOut size={17} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
