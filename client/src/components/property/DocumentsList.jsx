import { FileText, Download } from "lucide-react";

export default function DocumentsList({ documents }) {
  if (!documents?.length) return null;
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {documents.map((doc, i) => (
        <a
          key={i}
          href={doc.url}
          target="_blank"
          rel="noreferrer"
          download
          className="flex items-center justify-between gap-3 bg-white border border-navy/10 rounded-xl px-5 py-4 hover:border-gold/60 hover:shadow-sm transition"
        >
          <span className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
              <FileText size={16} className="text-gold" />
            </span>
            <span className="text-sm font-semibold">{doc.label}</span>
          </span>
          <Download size={16} className="text-navy/40" />
        </a>
      ))}
    </div>
  );
}
