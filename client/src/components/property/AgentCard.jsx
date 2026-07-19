import { Link } from "react-router-dom";
import { Phone, MessageCircle, Mail, UserRound, BadgeCheck } from "lucide-react";

export default function AgentCard({ agent, companyName, compact = false }) {
  if (!agent) return null;

  const phoneDigits = (agent.phone || "").replace(/\D/g, "");
  const whatsappDigits = (agent.whatsapp || agent.phone || "").replace(/\D/g, "");

  return (
    <div className={compact ? "" : "bg-white border border-navy/10 rounded-2xl p-6"}>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full overflow-hidden border border-navy/10 bg-navy/5 flex items-center justify-center shrink-0">
          {agent.photo ? <img src={agent.photo} alt={agent.name} className="w-full h-full object-cover" /> : <UserRound className="text-navy/30" size={26} />}
        </div>
        <div>
          <p className="font-display text-lg leading-tight">{agent.name}</p>
          <p className="text-xs text-gold uppercase tracking-wide">{agent.designation}</p>
          {companyName && (
            <p className="text-[11px] text-navy/50 flex items-center gap-1 mt-0.5">
              <BadgeCheck size={11} /> {companyName}
            </p>
          )}
          {agent.experience && <p className="text-[11px] text-navy/40 mt-0.5">{agent.experience} Experience</p>}
        </div>
      </div>

      {agent.bio && !compact && <p className="text-sm text-navy/60 leading-relaxed mb-4">{agent.bio}</p>}

      <div className="grid grid-cols-2 gap-2 mb-2">
        {phoneDigits && (
          <a href={`tel:+91${phoneDigits}`} className="flex items-center justify-center gap-1.5 bg-navy text-paper text-xs font-semibold py-2.5 rounded-lg hover:opacity-90">
            <Phone size={14} /> Call
          </a>
        )}
        {whatsappDigits && (
          <a href={`https://wa.me/91${whatsappDigits}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5 bg-[#25D366] text-white text-xs font-semibold py-2.5 rounded-lg hover:opacity-90">
            <MessageCircle size={14} /> WhatsApp
          </a>
        )}
      </div>
      {agent.email && (
        <a href={`mailto:${agent.email}`} className="w-full flex items-center justify-center gap-1.5 border border-navy/15 text-xs font-semibold py-2.5 rounded-lg hover:bg-navy/5 mb-2">
          <Mail size={14} /> {agent.email}
        </a>
      )}
      {!compact && (
        <Link to={`/team/${agent._id}`} className="block text-center text-xs font-semibold text-gold hover:underline mt-1">
          View Full Profile
        </Link>
      )}
    </div>
  );
}
