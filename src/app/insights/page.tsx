import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { CapabilityStatus } from "@/components/CapabilityStatus";

const categories = ["Preventive Health", "Longevity Science", "Medicine Markets", "Regulation", "SCF Progress", "Regional Care"];

export default function InsightsPage() {
  return <main><PageHero eyebrow="MMS Insights" title="Medical intelligence, made understandable." lead="Research, market and regulatory developments—summarised by Ling and governed by human review." primaryHref="/ling" primaryLabel="Ask Ling" />
    <Section eyebrow="Intelligence desk" title="One signal, clearly labelled." lead="Every future update will show its source, evidence level and review status.">
      <div className="mb-6"><CapabilityStatus status="development" /></div>
      <div className="grid gap-4 md:grid-cols-3">{categories.map((category,index)=><article key={category} className="rounded-2xl border border-gold-light/35 bg-white p-6 shadow-soft"><p className="text-xs font-bold uppercase tracking-[.16em] text-gold">Desk 0{index+1}</p><h2 className="mt-3 font-serif text-2xl text-navy">{category}</h2><div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-4 text-xs text-warm-gray"><span>Editorial feed</span><span className="rounded-full bg-ivory px-2 py-1">In development</span></div></article>)}</div>
      <div className="mt-10 rounded-2xl bg-deep-green p-6 text-ivory"><p className="text-xs font-bold uppercase tracking-[.16em] text-gold-light">Editorial governance</p><div className="mt-5 grid gap-4 md:grid-cols-4">{["Original source","Evidence level","Ling summary","Human review"].map((item,i)=><div key={item}><span className="text-gold-light">0{i+1}</span><p className="mt-1 font-serif text-xl">{item}</p></div>)}</div></div>
    </Section></main>;
}
