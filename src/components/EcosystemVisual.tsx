const nodes = [
  ["LING", "Understand"],
  ["MMS", "Coordinate"],
  ["DOCTOR", "Decide"],
  ["NETWORK", "Deliver"],
];

export function EcosystemVisual() {
  return (
    <div className="relative min-h-[560px] overflow-hidden rounded-[2.4rem] bg-[#14383e] p-6 text-ivory shadow-[0_32px_90px_rgba(20,30,32,.22)] md:p-10">
      <div className="mms-kinetic-ring left-1/2 top-1/2 size-[26rem] -translate-x-1/2 -translate-y-1/2" />
      <div className="mms-kinetic-ring left-1/2 top-1/2 size-[18rem] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute left-1/2 top-1/2 h-px w-[68%] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-[#e0b88f]/25 to-transparent" />
      <div className="absolute left-1/2 top-1/2 h-[68%] w-px -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-[#e0b88f]/25 to-transparent" />

      <div className="absolute left-1/2 top-1/2 z-10 grid size-40 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[#e1b88e]/45 bg-[#f2e5d8] text-center text-navy shadow-[0_20px_70px_rgba(0,0,0,.25)]">
        <div><strong className="font-serif text-4xl">YOU</strong><p className="mt-1 text-[9px] font-bold uppercase tracking-[.16em] text-terracotta">At the centre</p></div>
      </div>

      <div className="relative h-[480px]">
        {nodes.map(([name, role], index) => {
          const positions = ["left-[4%] top-[9%]", "right-[4%] top-[10%]", "left-[5%] bottom-[8%]", "right-[4%] bottom-[8%]"];
          return <div key={name} className={`absolute ${positions[index]} min-w-[155px] rounded-[1.5rem] border border-white/10 bg-white/[.055] p-4 backdrop-blur-xl`}><p className="text-[9px] font-bold tracking-[.18em] text-[#dfb78f]">{name}</p><p className="mt-2 font-serif text-2xl">{role}</p></div>;
        })}
      </div>
    </div>
  );
}
