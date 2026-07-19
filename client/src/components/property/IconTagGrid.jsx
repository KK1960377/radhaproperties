export default function IconTagGrid({ items, iconFor, columns = "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" }) {
  if (!items?.length) return null;
  return (
    <div className={`grid ${columns} gap-3`}>
      {items.map((name) => {
        const Icon = iconFor(name);
        return (
          <div
            key={name}
            className="flex items-center gap-3 bg-white border border-navy/10 rounded-xl px-4 py-3.5 hover:border-gold/60 hover:shadow-sm transition"
          >
            <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
              <Icon size={17} className="text-gold" />
            </div>
            <span className="text-sm font-medium leading-tight">{name}</span>
          </div>
        );
      })}
    </div>
  );
}
