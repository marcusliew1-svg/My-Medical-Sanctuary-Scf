import type { Metadata } from "next";
import Image from "next/image";
import { CTAButton } from "@/components/CTAButton";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { CapabilityStatus } from "@/components/CapabilityStatus";

export const metadata: Metadata = {
  title: "Medicine Access Intelligence",
  description: "Visual medicine access intelligence across markets, with professional and regulatory review built into the pathway.",
};

const markets = [
  { country: "Thailand", flag: "TH", amount: "RM 82", index: 24, note: "Illustrative lower-cost market" },
  { country: "Malaysia", flag: "MY", amount: "RM 118", index: 35, note: "Reference market" },
  { country: "Singapore", flag: "SG", amount: "RM 206", index: 60, note: "Illustrative higher retail context" },
  { country: "UAE", flag: "AE", amount: "RM 268", index: 78, note: "Illustrative Middle East market" },
  { country: "United States", flag: "US", amount: "RM 342", index: 100, note: "Illustrative cash-price context" },
];

const factors = ["Same molecule", "Same strength", "Same dosage form", "Same pack", "Licensed source", "Total fulfilment cost"];

export default function InternationalMedicineAccessPage() {
  return (
    <main>
      <section className="relative isolate overflow-hidden bg-[#071e2c] px-4 pb-16 pt-28 text-ivory md:pt-36">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_76%_30%,rgba(84,153,128,.22),transparent_30%),radial-gradient(circle_at_18%_78%,rgba(212,190,133,.13),transparent_34%)]" />
        <div className="mx-auto grid min-h-[620px] max-w-6xl items-center gap-10 lg:grid-cols-[.9fr_1.1fr]">
          <div><CapabilityStatus status="pilot"/><p className="mt-7 text-xs font-bold uppercase tracking-[.2em] text-gold-light">Medicine access intelligence</p><h1 className="mt-4 text-balance font-serif text-5xl leading-[1.03] md:text-7xl">One medicine. Very different market realities.</h1><p className="mt-6 max-w-xl text-lg leading-8 text-ivory/72">Compare like-for-like products before a licensed professional reviews the medical and supply pathway.</p><div className="mt-8 flex flex-wrap gap-3"><CTAButton href="/contact">Request a comparison</CTAButton><CTAButton href="/ling" variant="outline">Ask Ling first</CTAButton></div></div>
          <div className="relative min-h-[520px]"><div className="absolute inset-0 overflow-hidden rounded-[2.2rem] border border-white/10 bg-white/5 shadow-2xl"><Image src="/mms-medicine-intelligence.webp" alt="Illustrative global medicine comparison" fill priority className="object-cover" sizes="(min-width:1024px) 50vw,100vw"/><div className="absolute inset-0 bg-gradient-to-t from-[#071e2c] via-transparent to-transparent"/></div><div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-2">{[["5","markets"],["1","matched pack"],["0","shortcuts"]].map(([value,label])=><div key={label} className="rounded-2xl border border-white/10 bg-[#071e2c]/82 p-4 text-center backdrop-blur-md"><p className="font-serif text-3xl text-gold-light">{value}</p><p className="mt-1 text-xs text-ivory/60">{label}</p></div>)}</div></div>
        </div>
      </section>

      <section className="bg-ivory px-4 py-20"><div className="mx-auto max-w-6xl"><div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:items-center"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-gold">Match before you compare</p><h2 className="mt-3 font-serif text-5xl leading-tight text-navy">The label is not enough.</h2><p className="mt-5 leading-7 text-warm-gray">A meaningful comparison starts only when the product itself is truly matched.</p></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{factors.map((factor,index)=><div key={factor} className={`rounded-[1.4rem] p-5 shadow-soft ${index===5?"bg-deep-green text-ivory":"bg-white text-navy"}`}><span className={`text-xs font-bold ${index===5?"text-gold-light":"text-gold"}`}>0{index+1}</span><p className="mt-3 font-serif text-2xl">{factor}</p></div>)}</div></div></div></section>

      <section className="bg-warm-white px-4 py-20"><div className="mx-auto max-w-6xl"><div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-gold">Five-market lens</p><h2 className="mt-2 font-serif text-5xl text-navy">See the spread instantly.</h2></div><p className="max-w-md text-sm leading-6 text-warm-gray">Synthetic design example only. Real prices require named products, dates and licensed sources.</p></div><div className="grid gap-4 lg:grid-cols-5">{markets.map((market,index)=><article key={market.country} className={`relative overflow-hidden rounded-[1.6rem] border border-stone-200 p-5 shadow-soft ${index===0?"bg-[#dce8e1]":index===4?"bg-navy text-ivory":"bg-white"}`}><div className="flex items-center justify-between"><span className={`grid size-11 place-items-center rounded-full text-xs font-bold ${index===4?"bg-white/10 text-white":"bg-deep-green text-white"}`}>{market.flag}</span><span className={`text-xs ${index===4?"text-ivory/50":"text-warm-gray"}`}>#{index+1}</span></div><p className={`mt-6 text-sm font-semibold ${index===4?"text-ivory/60":"text-warm-gray"}`}>{market.country}</p><p className="mt-1 font-serif text-4xl">{market.amount}</p><div className={`mt-6 h-28 rounded-2xl p-3 ${index===4?"bg-white/5":"bg-ivory"}`}><div className="flex h-full items-end"><div className="w-full rounded-xl bg-gradient-to-t from-deep-green to-gold-light" style={{height:`${Math.max(24,market.index)}%`}} /></div></div><p className={`mt-4 text-xs leading-5 ${index===4?"text-ivory/55":"text-warm-gray"}`}>{market.note}</p></article>)}</div><p className="mt-5 text-center text-xs text-warm-gray">All figures above are fictional examples converted to RM for visual explanation. They are not current quotations or claims of availability.</p></div></section>

      <section className="bg-[#07372f] px-4 py-20 text-ivory"><div className="mx-auto max-w-6xl"><div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-gold-light">MMS role</p><h2 className="mt-3 font-serif text-5xl leading-tight">Compare first. Decide with professionals.</h2><p className="mt-5 leading-7 text-ivory/68">MMS organises the question. Licensed professionals clear prescribing, dispensing, import and jurisdictional requirements.</p></div><div className="grid gap-3 sm:grid-cols-2">{[["01","Identify the exact product"],["02","Compare valid markets"],["03","Check regulatory boundaries"],["04","Coordinate licensed next steps"]].map(([number,label])=><div key={number} className="rounded-[1.4rem] border border-white/10 bg-white/5 p-5"><span className="text-xs text-gold-light">{number}</span><p className="mt-2 font-serif text-2xl">{label}</p></div>)}</div></div></div></section>

      <section className="bg-ivory px-4 py-16"><div className="mx-auto max-w-5xl"><DisclaimerBox title="Medicine access boundary"><p>Information is educational and coordination-focused. MMS does not provide diagnosis, prescribing, dosage recommendations, dispensing or promises of medicine availability through this website. Any medicine-related pathway must follow applicable laws and involve appropriate licensed professionals.</p></DisclaimerBox></div></section>
    </main>
  );
}
