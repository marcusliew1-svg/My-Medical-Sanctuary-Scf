"use client";

import { useState } from "react";

const services = [
  { icon: "◎", name: "Screening", promise: "Know your baseline", includes: ["Core health markers", "Risk discussion", "Doctor review"], accent: "bg-[#dce8e1]" },
  { icon: "↗", name: "Metabolic Health", promise: "Improve energy and weight", includes: ["Body composition", "Lifestyle patterns", "Progress reviews"], accent: "bg-[#ead8d1]" },
  { icon: "∞", name: "Healthy Ageing", promise: "Plan for longer vitality", includes: ["Longevity priorities", "Preventive roadmap", "Ongoing monitoring"], accent: "bg-[#e5e0d5]" },
  { icon: "◌", name: "Sleep & Recovery", promise: "Restore everyday resilience", includes: ["Sleep patterns", "Stress and recovery", "Care navigation"], accent: "bg-[#dbe5e7]" },
  { icon: "✦", name: "Advanced Support", promise: "Explore suitable options", includes: ["IV wellness education", "Regenerative education", "Doctor suitability"], accent: "bg-[#eadfd8]" },
  { icon: "◇", name: "Executive Care", promise: "Protect time and continuity", includes: ["Priority coordination", "Private planning", "Family support"], accent: "bg-[#d9e4dc]" },
];

export function ServiceExplorer() {
  const [active, setActive] = useState(0);
  const selected = services[active];
  return <div className="grid overflow-hidden rounded-[2rem] border border-gold-light/40 bg-white shadow-premium lg:grid-cols-[1.1fr_.9fr]">
    <div className="grid grid-cols-2 gap-px bg-stone-100 sm:grid-cols-3">{services.map((service,index)=><button key={service.name} onClick={()=>setActive(index)} className={`min-h-36 p-5 text-left transition ${active===index ? `${service.accent} shadow-inner` : "bg-white hover:bg-ivory"}`}><span className="grid size-10 place-items-center rounded-full bg-deep-green font-serif text-xl text-white">{service.icon}</span><strong className="mt-5 block font-serif text-xl text-navy">{service.name}</strong><span className="mt-1 block text-xs text-warm-gray">{service.promise}</span></button>)}</div>
    <aside className={`${selected.accent} flex flex-col justify-center p-8 md:p-12`}><p className="text-xs font-bold uppercase tracking-[.18em] text-gold">Selected pathway</p><h3 className="mt-3 font-serif text-4xl text-navy">{selected.name}</h3><p className="mt-3 text-lg text-deep-green">{selected.promise}</p><div className="mt-7 grid gap-3">{selected.includes.map((item,index)=><div key={item} className="flex items-center gap-3 rounded-xl bg-white/70 p-3 text-sm text-navy"><span className="grid size-7 place-items-center rounded-full bg-deep-green text-xs text-white">{index+1}</span>{item}</div>)}</div><p className="mt-6 text-xs leading-5 text-warm-gray">Final services depend on individual needs and qualified professional review.</p></aside>
  </div>;
}
