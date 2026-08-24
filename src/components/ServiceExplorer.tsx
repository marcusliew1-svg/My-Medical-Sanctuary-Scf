"use client";

import { useState } from "react";

const services = [
  { icon: "◎", name: "Screening", promise: "Know your baseline", includes: ["Markers", "Risk", "Review"], accent: "#dce8e1" },
  { icon: "↗", name: "Metabolic", promise: "Energy & weight", includes: ["Body", "Patterns", "Progress"], accent: "#ead8d1" },
  { icon: "∞", name: "Healthy Ageing", promise: "Protect vitality", includes: ["Priorities", "Roadmap", "Monitor"], accent: "#e5e0d5" },
  { icon: "◌", name: "Recovery", promise: "Restore resilience", includes: ["Sleep", "Stress", "Recovery"], accent: "#dbe5e7" },
  { icon: "✦", name: "Advanced", promise: "Explore options", includes: ["Education", "Suitability", "Review"], accent: "#eadfd8" },
  { icon: "◇", name: "Executive", promise: "Protect time", includes: ["Priority", "Private", "Family"], accent: "#d9e4dc" },
];

export function ServiceExplorer() {
  const [active, setActive] = useState(0);
  const selected = services[active];

  return (
    <div className="grid overflow-hidden rounded-[2.4rem] border border-[#d8c8b7] bg-white shadow-[0_32px_90px_rgba(36,46,45,.11)] lg:grid-cols-[1.08fr_.92fr]">
      <div className="grid grid-cols-2 gap-px bg-[#d9d0c6] sm:grid-cols-3">
        {services.map((service,index)=><button key={service.name} onClick={()=>setActive(index)} className={`group min-h-44 p-5 text-left transition duration-500 ${active===index ? "bg-[#173d43] text-ivory" : "bg-[#f9f5ef] text-navy hover:bg-white"}`}>
          <span className={`grid size-11 place-items-center rounded-full border font-serif text-xl transition duration-500 ${active===index ? "border-[#dfb78f]/40 bg-[#dfb78f]/10 text-[#e9c6a4]" : "border-[#b9a693]/35 bg-white text-deep-green group-hover:scale-110"}`}>{service.icon}</span>
          <strong className="mt-8 block font-serif text-2xl">{service.name}</strong>
          <span className={`mt-1 block text-[10px] font-bold uppercase tracking-[.14em] ${active===index ? "text-ivory/50" : "text-warm-gray"}`}>{service.promise}</span>
        </button>)}
      </div>

      <aside className="relative flex min-h-[520px] flex-col justify-between overflow-hidden bg-[#173d43] p-8 text-ivory md:p-12">
        <div className="mms-kinetic-ring -right-24 -top-24 size-80" />
        <div className="mms-kinetic-ring right-4 top-8 size-48" />
        <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-black/20 to-transparent" />

        <div className="relative">
          <p className="text-[9px] font-bold uppercase tracking-[.22em] text-[#dfb78f]">Selected pathway</p>
          <div className="mt-7 flex items-start justify-between gap-5">
            <div><h3 className="font-serif text-5xl md:text-6xl">{selected.name}</h3><p className="mt-3 text-lg text-[#e4c6a7]">{selected.promise}</p></div>
            <span className="grid size-16 shrink-0 place-items-center rounded-full border border-[#dfb78f]/30 bg-white/[.04] font-serif text-3xl text-[#e6c19e]">{selected.icon}</span>
          </div>
        </div>

        <div className="relative mt-16">
          <div className="grid grid-cols-3 gap-3">
            {selected.includes.map((item,index)=><div key={item} className="rounded-2xl border border-white/10 bg-white/[.055] p-4 text-center backdrop-blur"><span className="text-[9px] font-bold text-[#dcb58d]">0{index+1}</span><p className="mt-2 font-serif text-lg">{item}</p></div>)}
          </div>
          <p className="mt-7 text-[11px] leading-5 text-ivory/48">Suitability and recommendations remain subject to qualified professional review.</p>
        </div>
      </aside>
    </div>
  );
}
