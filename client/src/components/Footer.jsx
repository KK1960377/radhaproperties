import { Facebook, Instagram, Youtube, Clock } from "lucide-react";

export default function Footer({ settings }) {
  const year = new Date().getFullYear();
  const companyName = settings?.companyName || "Radha Homes Properties";
  const [firstWord, ...rest] = companyName.split(" ");
  const restName = rest.join(" ");
  const socials = [
    { icon: Facebook, href: settings?.facebook, label: "Facebook" },
    { icon: Instagram, href: settings?.instagram, label: "Instagram" },
    { icon: Youtube, href: settings?.youtube, label: "YouTube" },
  ].filter((s) => s.href);

  return (
    <footer className="bg-ink text-white/70 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
        <div>
          <p className="font-display text-2xl text-white mb-3">{firstWord} <span className="text-gold">{restName}</span></p>
          <p className="text-sm leading-relaxed">Your Trusted Property Partner in Greater Noida — buy, sell &amp; rent with confidence.</p>
          {settings?.officeTiming && (
            <p className="flex items-center gap-2 text-xs text-white/50 mt-4">
              <Clock size={14} className="text-gold" /> {settings.officeTiming}
            </p>
          )}
          {socials.length > 0 && (
            <div className="flex items-center gap-3 mt-5">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-navy transition"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          )}
        </div>
        <div>
          <p className="text-white font-semibold mb-4 text-sm tracking-wide">Quick Links</p>
          <ul className="space-y-2.5 text-sm">
            <li><a href="#properties" className="hover:text-gold transition">Properties</a></li>
            <li><a href="#about" className="hover:text-gold transition">About Us</a></li>
            <li><a href="#team" className="hover:text-gold transition">Our Team</a></li>
            <li><a href="/owner" className="hover:text-gold transition">Owner Profile</a></li>
            <li><a href="/company" className="hover:text-gold transition">Company Details</a></li>
            <li><a href="/blogs" className="hover:text-gold transition">Blogs</a></li>
            <li><a href="#contact" className="hover:text-gold transition">Contact</a></li>
            <li><a href="/admin/login" className="hover:text-gold transition">Admin Login</a></li>
          </ul>
        </div>
        <div>
          <p className="text-white font-semibold mb-4 text-sm tracking-wide">Areas We Serve</p>
          <ul className="space-y-2.5 text-sm">
            <li>Gaur City 1</li><li>Gaur City 2</li><li>Noida Extension</li><li>Greater Noida West</li>
          </ul>
        </div>
        <div>
          <p className="text-white font-semibold mb-4 text-sm tracking-wide">Legal</p>
          <ul className="space-y-2.5 text-sm">
            <li>Privacy Policy</li>
            <li>Terms &amp; Conditions</li>
            <li>RERA Disclosure</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 pt-6 max-w-7xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row justify-between gap-3 text-xs text-white/40">
        <p>&copy; {year} {companyName}. All rights reserved.</p>
        <p>A trusted address in Gaur City 2, Greater Noida.</p>
      </div>
    </footer>
  );
}
