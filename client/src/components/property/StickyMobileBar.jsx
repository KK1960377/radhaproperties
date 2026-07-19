import { Phone, MessageCircle, Eye, CalendarCheck, MessageSquareText } from "lucide-react";

export default function StickyMobileBar({ phone, whatsapp, onEnquire, onBookVisit, onViewPhone, phoneRevealed }) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-navy/10 px-2 py-2.5 flex items-stretch gap-1.5 shadow-[0_-8px_30px_-15px_rgba(0,0,0,0.2)]">
      <a
        href={`https://wa.me/91${(whatsapp || phone || "").replace(/\D/g, "")}`}
        target="_blank"
        rel="noreferrer"
        className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-xl bg-[#25D366]/10 text-[#128C4A]"
      >
        <MessageCircle size={16} />
        <span className="text-[10px] font-semibold">WhatsApp</span>
      </a>

      {phoneRevealed ? (
        <a href={`tel:+91${(phone || "").replace(/\D/g, "")}`} className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-xl bg-navy/5 text-navy">
          <Phone size={16} />
          <span className="text-[10px] font-semibold">Call</span>
        </a>
      ) : (
        <button onClick={onViewPhone} className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-xl bg-navy/5 text-navy">
          <Eye size={16} />
          <span className="text-[10px] font-semibold">View Phone</span>
        </button>
      )}

      <button onClick={onBookVisit} className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-xl bg-navy/5 text-navy">
        <CalendarCheck size={16} />
        <span className="text-[10px] font-semibold">Site Visit</span>
      </button>

      <button onClick={onEnquire} className="flex-[1.3] flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-xl bg-gold text-navy">
        <MessageSquareText size={16} />
        <span className="text-[10px] font-semibold">Enquire Now</span>
      </button>
    </div>
  );
}
