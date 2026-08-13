const nodes = [
  ["LING", "Intelligence", "Organises options"],
  ["MMS", "Coordination", "Owns the journey"],
  ["DOCTOR", "Clinical authority", "Approves decisions"],
  ["SCF", "Future science", "Builds capability"],
];

export function EcosystemVisual() {
  return <div className="relative overflow-hidden rounded-[2rem] bg-deep-green p-6 text-ivory shadow-premium md:p-10">
    <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
      <div className="grid gap-4">{nodes.slice(0,2).map(([name, role, note]) => <Node key={name} name={name} role={role} note={note} />)}</div>
      <div className="mx-auto grid size-40 place-items-center rounded-full border-2 border-gold-light bg-ivory text-center text-deep-green shadow-premium"><div><strong className="font-serif text-3xl">YOU</strong><p className="mt-1 text-xs uppercase tracking-[.16em]">At the centre</p></div></div>
      <div className="grid gap-4">{nodes.slice(2).map(([name, role, note]) => <Node key={name} name={name} role={role} note={note} />)}</div>
    </div>
  </div>;
}

function Node({ name, role, note }: { name: string; role: string; note: string }) {
  return <div className="rounded-2xl border border-ivory/15 bg-white/[.08] p-5 backdrop-blur"><p className="text-xs font-bold tracking-[.18em] text-gold-light">{name}</p><p className="mt-2 font-serif text-xl">{role}</p><p className="mt-1 text-sm text-ivory/65">{note}</p></div>;
}
