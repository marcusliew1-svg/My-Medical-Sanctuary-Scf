const stages = [
  ["01", "Discover", "You + Ling"],
  ["02", "Assess", "MMS"],
  ["03", "Review", "Doctor"],
  ["04", "Coordinate", "Network"],
  ["05", "Continue", "Care team"],
];

export function JourneyVisual() {
  return (
    <div className="relative grid gap-px overflow-hidden rounded-[2.2rem] border border-[#d6c3b1] bg-[#d6c3b1] md:grid-cols-5">
      {stages.map(([number, title, owner], index) => (
        <div key={title} className={`relative min-h-[280px] p-6 ${index===2?"bg-[#173d43] text-ivory":"bg-[#fbf7f1] text-navy"}`}>
          <span className={`text-[10px] font-bold tracking-[.18em] ${index===2?"text-[#dfb78f]":"text-terracotta"}`}>{number}</span>
          <div className={`mt-20 h-px w-12 ${index===2?"bg-[#dfb78f]/40":"bg-terracotta/25"}`} />
          <h3 className="mt-7 font-serif text-3xl">{title}</h3>
          <p className={`mt-3 text-[10px] font-bold uppercase tracking-[.14em] ${index===2?"text-ivory/48":"text-warm-gray"}`}>{owner}</p>
          {index < stages.length - 1 ? <span className={`absolute -right-3 top-1/2 z-10 hidden size-6 -translate-y-1/2 place-items-center rounded-full md:grid ${index===2?"bg-[#e4bf9a] text-navy":"bg-[#173d43] text-white"}`}>→</span> : null}
        </div>
      ))}
    </div>
  );
}
