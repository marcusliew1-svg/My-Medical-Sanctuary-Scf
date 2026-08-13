const stages = [
  ["01", "Discover", "Ling + You"], ["02", "Assess", "MMS team"], ["03", "Approve", "Doctor"],
  ["04", "Coordinate", "MMS network"], ["05", "Continue", "Ling + care team"],
];

export function JourneyVisual() {
  return <div className="grid gap-3 md:grid-cols-5">{stages.map(([number, title, owner], index) => <div key={title} className="relative rounded-2xl border border-gold-light/40 bg-white p-5 shadow-soft"><p className="text-xs font-bold tracking-[.18em] text-gold">{number}</p><h3 className="mt-4 font-serif text-2xl text-navy">{title}</h3><p className="mt-2 text-sm text-warm-gray">{owner}</p>{index < stages.length - 1 ? <span className="absolute -right-3 top-1/2 z-10 hidden size-6 -translate-y-1/2 place-items-center rounded-full bg-deep-green text-xs text-white md:grid">→</span> : null}</div>)}</div>;
}
