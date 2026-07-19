import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, PhoneCall } from "lucide-react";

function initials(name) {
  return (name || "Radha Homes Properties")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function Navbar({ settings }) {
  const [open, setOpen] = useState(false);
  const phone1 = (settings?.phone1 || "8851142540").replace(/\D/g, "");
  const companyName = settings?.companyName || "Radha Homes Properties";
  const links = [
    { label: "Properties", href: "#properties" },
    { label: "Why Us", href: "#why-us" },
    { label: "About", href: "#about" },
    { label: "Team", href: "#team" },
    { label: "Blogs", to: "/blogs" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Contact", href: "#contact" },
  ];

  function NavLink({ link, className, onClick }) {
    if (link.to) {
      return (
        <Link to={link.to} className={className} onClick={onClick}>
          {link.label}
        </Link>
      );
    }
    return (
      <a href={link.href} className={className} onClick={onClick}>
        {link.label}
      </a>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-paper/90 backdrop-blur border-b border-navy/5">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-8 py-4">
        <a href="#home" className="flex items-center gap-3">
          {settings?.companyLogo ? (
            <div className="w-11 h-11 rounded-full border border-gold/60 overflow-hidden shrink-0">
              <img src={settings.companyLogo} alt={companyName} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-11 h-11 rounded-full border border-gold/60 flex items-center justify-center shrink-0">
              <span className="font-display text-lg tracking-wide text-gold">{initials(companyName)}</span>
            </div>
          )}
          <div className="leading-tight">
            <p className="font-display text-lg sm:text-xl tracking-wide">{companyName}</p>
            <p className="text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-gold/90 -mt-0.5">
              Greater Noida West
            </p>
          </div>
        </a>

        <div className="hidden lg:flex items-center gap-9 text-sm font-medium">
          {links.map((l) => (
            <NavLink key={l.label} link={l} className="underline-grow" />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`tel:+91${phone1}`}
            className="hidden sm:flex items-center gap-2 bg-navy text-paper px-5 py-2.5 rounded-full text-sm font-semibold hover:shadow-gold transition-all"
          >
            <PhoneCall size={16} /> Call Now
          </a>
          <button className="lg:hidden w-10 h-10 flex items-center justify-center" onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="lg:hidden mx-4 mb-4 rounded-2xl bg-white shadow-lg px-6 py-6 flex flex-col gap-5 text-sm font-medium">
          {links.map((l) => (
            <NavLink key={l.label} link={l} onClick={() => setOpen(false)} />
          ))}
          <a
            href={`tel:+91${phone1}`}
            className="flex items-center gap-2 bg-navy text-paper px-5 py-3 rounded-full justify-center font-semibold"
          >
            <PhoneCall size={16} /> Call Now
          </a>
        </div>
      )}
    </header>
  );
}
