import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  Mail,
  Facebook,
  Instagram,
  Linkedin,
  UserRound,
  BadgeCheck,
} from "lucide-react";
import api from "../api/axios";

export default function TeamMemberDetail() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get(`/team/${id}`)
      .then((res) => setMember(res.data))
      .catch(() => setError("This team member could not be found."))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen bg-paper">
      <header className="px-5 sm:px-8 py-6">
        <Link to="/#team" className="inline-flex items-center gap-2 text-sm font-semibold text-navy/70 hover:text-gold transition">
          <ArrowLeft size={16} /> Back to Site
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-5 sm:px-8 pb-24">
        {loading ? (
          <p className="text-navy/50 text-sm">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : (
          <div className="grid sm:grid-cols-5 gap-10 items-start">
            <div className="sm:col-span-2">
              <div className="rounded-3xl overflow-hidden aspect-square border border-navy/10 bg-white">
                {member.photo ? (
                  <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-navy/5">
                    <UserRound className="text-navy/30" size={72} />
                  </div>
                )}
              </div>
            </div>

            <div className="sm:col-span-3">
              <p className="text-gold uppercase tracking-[0.3em] text-xs mb-3 flex items-center gap-2">
                <BadgeCheck size={14} /> Team Member
              </p>
              <h1 className="font-display text-3xl sm:text-4xl mb-2">{member.name}</h1>
              <p className="text-navy/60 font-medium mb-1">{member.designation}</p>
              {member.experience && <p className="text-navy/40 text-sm mb-6">{member.experience} Experience</p>}

              {member.bio && <p className="text-navy/70 leading-relaxed mb-8">{member.bio}</p>}

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {member.phone && (
                  <a href={`tel:+91${member.phone.replace(/\D/g, "")}`} className="flex items-center gap-3 bg-white border border-navy/10 rounded-xl px-4 py-3.5 text-sm hover:border-gold transition">
                    <Phone size={18} className="text-gold" /> {member.phone}
                  </a>
                )}
                {(member.whatsapp || member.phone) && (
                  <a
                    href={`https://wa.me/91${(member.whatsapp || member.phone).replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 bg-white border border-navy/10 rounded-xl px-4 py-3.5 text-sm hover:border-gold transition"
                  >
                    <MessageCircle size={18} className="text-gold" /> WhatsApp
                  </a>
                )}
                {member.email && (
                  <a href={`mailto:${member.email}`} className="flex items-center gap-3 bg-white border border-navy/10 rounded-xl px-4 py-3.5 text-sm hover:border-gold transition sm:col-span-2">
                    <Mail size={18} className="text-gold" /> {member.email}
                  </a>
                )}
              </div>

              <div className="flex items-center gap-3">
                {member.facebook && (
                  <a href={member.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center hover:bg-navy hover:text-white transition">
                    <Facebook size={16} />
                  </a>
                )}
                {member.instagram && (
                  <a href={member.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center hover:bg-navy hover:text-white transition">
                    <Instagram size={16} />
                  </a>
                )}
                {member.linkedin && (
                  <a href={member.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center hover:bg-navy hover:text-white transition">
                    <Linkedin size={16} />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
