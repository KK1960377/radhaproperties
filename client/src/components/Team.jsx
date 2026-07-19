import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Phone, MessageCircle, Mail, Facebook, Instagram, Linkedin, UserRound } from "lucide-react";
import api from "../api/axios";

function Avatar({ src, name }) {
  if (src) {
    return <img src={src} alt={name} className="w-full h-full object-cover" />;
  }
  return (
    <div className="w-full h-full flex items-center justify-center bg-navy/5">
      <UserRound className="text-navy/30" size={40} />
    </div>
  );
}

export default function Team() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/team")
      .then((res) => setTeam(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Nothing to show and nothing loading → don't render an empty section
  if (!loading && team.length === 0) return null;

  return (
    <section id="team" className="max-w-7xl mx-auto px-5 sm:px-8 py-24">
      <div className="text-center mb-14">
        <p className="text-gold uppercase tracking-[0.3em] text-xs mb-3">Our People</p>
        <h2 className="font-display text-3xl sm:text-5xl">Meet Our Team</h2>
      </div>

      {loading ? (
        <p className="text-navy/50 text-sm text-center">Loading team...</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {team.map((m) => (
            <div key={m._id} className="card-hover rounded-3xl overflow-hidden bg-white border border-navy/5 p-7 text-center">
              <Link to={`/team/${m._id}`} className="block w-28 h-28 rounded-full overflow-hidden mx-auto mb-5 border-4 border-gold/20">
                <Avatar src={m.photo} name={m.name} />
              </Link>
              <Link to={`/team/${m._id}`}>
                <h3 className="font-display text-lg hover:text-gold transition">{m.name}</h3>
              </Link>
              <p className="text-gold text-xs uppercase tracking-wide mt-1">{m.designation}</p>
              {m.experience && <p className="text-navy/50 text-xs mt-1">{m.experience} Experience</p>}
              {m.bio && <p className="text-navy/60 text-sm mt-4 leading-relaxed line-clamp-3">{m.bio}</p>}

              <div className="flex items-center justify-center gap-2 mt-6">
                {m.phone && (
                  <a href={`tel:+91${m.phone.replace(/\D/g, "")}`} title="Call" className="w-9 h-9 rounded-full bg-navy/5 flex items-center justify-center hover:bg-navy hover:text-white transition">
                    <Phone size={15} />
                  </a>
                )}
                {(m.whatsapp || m.phone) && (
                  <a
                    href={`https://wa.me/91${(m.whatsapp || m.phone).replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    title="WhatsApp"
                    className="w-9 h-9 rounded-full bg-navy/5 flex items-center justify-center hover:bg-[#25D366] hover:text-white transition"
                  >
                    <MessageCircle size={15} />
                  </a>
                )}
                {m.email && (
                  <a href={`mailto:${m.email}`} title="Email" className="w-9 h-9 rounded-full bg-navy/5 flex items-center justify-center hover:bg-navy hover:text-white transition">
                    <Mail size={15} />
                  </a>
                )}
                {m.facebook && (
                  <a href={m.facebook} target="_blank" rel="noreferrer" title="Facebook" className="w-9 h-9 rounded-full bg-navy/5 flex items-center justify-center hover:bg-navy hover:text-white transition">
                    <Facebook size={15} />
                  </a>
                )}
                {m.instagram && (
                  <a href={m.instagram} target="_blank" rel="noreferrer" title="Instagram" className="w-9 h-9 rounded-full bg-navy/5 flex items-center justify-center hover:bg-navy hover:text-white transition">
                    <Instagram size={15} />
                  </a>
                )}
                {m.linkedin && (
                  <a href={m.linkedin} target="_blank" rel="noreferrer" title="LinkedIn" className="w-9 h-9 rounded-full bg-navy/5 flex items-center justify-center hover:bg-navy hover:text-white transition">
                    <Linkedin size={15} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
