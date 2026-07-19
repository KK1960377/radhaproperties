import { Link } from "react-router-dom";
import { MessageCircle, Phone, Settings } from "lucide-react";

export default function FloatingButtons({ settings }) {
  const phone1 = (settings?.phone1 || "8851142540").replace(/\D/g, "");
  const whatsapp = (settings?.whatsapp || settings?.phone1 || "8851142540").replace(/\D/g, "");

  return (
    <>
      <a
        href={`https://wa.me/91${whatsapp}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-xl hover:scale-110 transition-transform float"
      >
        <MessageCircle className="text-white" size={24} />
      </a>
      <a
        href={`tel:+91${phone1}`}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-navy flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
      >
        <Phone className="text-white" size={24} />
      </a>
      <Link
        to="/admin/login"
        title="Admin Panel"
        className="fixed bottom-24 left-6 z-40 w-11 h-11 rounded-full bg-white shadow-lg border border-navy/10 flex items-center justify-center hover:bg-gold/20 transition-all"
      >
        <Settings size={16} />
      </Link>
    </>
  );
}
