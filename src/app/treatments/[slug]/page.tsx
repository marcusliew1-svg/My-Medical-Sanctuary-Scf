import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CTAButton } from "@/components/CTAButton";
import { TreatmentSystemVisual } from "@/components/TreatmentSystemVisual";
import { TreatmentSessionVisual } from "@/components/TreatmentSessionVisual";
import { treatmentEducation } from "@/data/treatmentEducation";
import { treatmentEducationExtra } from "@/data/treatmentEducationExtra";

const indexMedicalEducation = (process.env.MMS_MEDICAL_EDUCATION_INDEXABLE ?? "false").toLowerCase() === "true";
const allTreatmentEducation = [...treatmentEducation, ...treatmentEducationExtra];

function getTreatment(slug: string) {
  return allTreatmentEducation.find((item) => item.slug === slug);
}

const evidenceTone: Record<string, string> = {
  "Established / indication-specific": "bg-[#dfe9e3] text-deep-green",
  "Evidence varies by indication": "bg-[#efe8de] text-navy",
  "Emerging / tightly regulated": "bg-navy text-ivory",
  "Assessment / screening": "bg-white text-deep-green",
};

export function generateStaticParams() {
  return allTreatmentEducation.map((item) => ({ slug: item.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const item = getTreatment(params.slug);
  if (!item) return {};
  return {
    title: `${item.name} explained in plain English`,
    description: item.summary,
    keywords: item.seoTerms,
    robots: { index: indexMedicalEducation, follow: indexMedicalEducation },
  };
}

export default function TreatmentEducationPage({ params }: { params: { slug: string } }) {
  const item = getTreatment(params.slug);
  if (!item) notFound();

  return (
    <main>
      <section className="relative isolate overflow-hidden bg-[#062e29] px-4 pb-16 pt-28 text-ivory md:pt-36">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_82%_20%,rgba(112,165,142,.24),transparent_30%),radial-gradient(circle_at_18%_80%,rgba(196,174,133,.12),transparent_34%)]" />
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_.85fr] lg:items-center">
          <div>
            <Link href="/treatments/research" className="text-xs font-bold uppercase tracking-[.18em] text-[#d7c9a7]">← Treatment research library</Link>
            <p className="mt-8 text-xs font-bold uppercase tracking-[.18em] text-[#d7c9a7]">{item.eyebrow}</p>
            <h1 className="mt-3 max-w-4xl text-balance font-serif text-5xl leading-[1.03] md:text-7xl">{item.name}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-ivory/72">{item.summary}</p>
            <span className={`mt-6 inline-flex rounded-full px-4 py-2 text-xs font-bold ${evidenceTone[item.evidence]}`}>{item.evidence}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[["01","Why?","Define the goal"],["02","How?","Understand the method"],["03","Evidence","Know what is established"],["04","Decision","Qualified review"]].map(([n,title,text],index)=><article key={n} className={`rounded-[1.6rem] border border-white/10 p-5 ${index===3?"bg-ivory text-navy":"bg-white/5"}`}><span className={`text-xs font-bold ${index===3?"text-deep-green":"text-[#d7c9a7]"}`}>{n}</span><p className="mt-3 font-serif text-2xl">{title}</p><p className={`mt-1 text-xs ${index===3?"text-warm-gray":"text-ivory/60"}`}>{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="bg-ivory px-4 py-14"><div className="mx-auto max-w-5xl"><TreatmentSystemVisual slug={item.slug} /></div></section>

      <section className="bg-ivory px-4 pb-14">
        <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-[1.1fr_.9fr]">
          <article className="rounded-[1.8rem] bg-white p-7 shadow-soft md:p-9"><p className="text-xs font-bold uppercase tracking-[.15em] text-deep-green">In plain English</p><p className="mt-4 text-lg leading-8 text-navy">{item.plainEnglish}</p></article>
          <article className="rounded-[1.8rem] bg-[#edf2ef] p-7 md:p-9"><p className="text-xs font-bold uppercase tracking-[.15em] text-deep-green">Evidence position</p><p className="mt-4 leading-7 text-warm-gray">{item.evidenceNote}</p><p className="mt-5 border-t border-deep-green/15 pt-5 text-xs leading-5 text-warm-gray">Educational content only. Availability, suitability, product status and legal pathway can differ by country, clinic and indication.</p></article>
        </div>
      </section>

      <section className="bg-warm-white px-4 py-16"><div className="mx-auto max-w-5xl"><TreatmentSessionVisual slug={item.slug} /></div></section>

      <section className="bg-ivory px-4 py-16"><div className="mx-auto max-w-5xl"><div className="grid gap-6 lg:grid-cols-2"><article className="rounded-[1.8rem] border border-stone-200 bg-white p-7"><p className="text-xs font-bold uppercase tracking-[.15em] text-deep-green">Why people ask about it</p><ul className="mt-5 grid gap-3">{item.whyPeopleAsk.map(text=><li key={text} className="rounded-xl bg-ivory p-4 text-sm leading-6 text-navy">{text}</li>)}</ul></article><article className="rounded-[1.8rem] border border-[#d8b9ad] bg-[#f5ece8] p-7"><p className="text-xs font-bold uppercase tracking-[.15em] text-[#8a5140]">What to be cautious about</p><ul className="mt-5 grid gap-3">{item.caution.map(text=><li key={text} className="flex gap-3 text-sm leading-6 text-navy"><span className="font-bold text-[#8a5140]">!</span><span>{text}</span></li>)}</ul></article></div></div></section>

      <section className="bg-warm-white px-4 py-16"><div className="mx-auto max-w-5xl"><p className="text-xs font-bold uppercase tracking-[.16em] text-deep-green">What a responsible pathway looks like</p><h2 className="mt-3 font-serif text-4xl text-navy md:text-5xl">From interest to an informed decision.</h2><div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{item.typicalJourney.map((step,index)=><article key={step} className="relative rounded-[1.5rem] border border-stone-200 bg-white p-5 shadow-soft"><span className="grid size-10 place-items-center rounded-full bg-deep-green text-xs font-bold text-white">0{index+1}</span><p className="mt-4 text-sm leading-6 text-navy">{step}</p>{index<item.typicalJourney.length-1?<span className="absolute -right-3 top-8 z-10 hidden size-6 place-items-center rounded-full bg-[#d7c9a7] text-navy lg:grid">→</span>:null}</article>)}</div></div></section>

      <section className="bg-ivory px-4 py-16"><div className="mx-auto grid max-w-5xl gap-7 lg:grid-cols-[.85fr_1.15fr]"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-deep-green">Questions to take to your doctor</p><h2 className="mt-3 font-serif text-4xl text-navy">Research should improve the consultation.</h2><p className="mt-4 leading-7 text-warm-gray">Use these as conversation starters rather than a checklist for self-treatment.</p></div><div className="grid gap-3">{item.questions.map((q,index)=><div key={q} className="flex gap-4 rounded-2xl border border-stone-200 bg-white p-5"><span className="font-serif text-2xl text-deep-green">0{index+1}</span><p className="pt-1 text-sm leading-6 text-navy">{q}</p></div>)}</div></div></section>

      {item.relatedConcerns.length ? <section className="bg-warm-white px-4 py-14"><div className="mx-auto max-w-5xl"><p className="text-xs font-bold uppercase tracking-[.16em] text-deep-green">Related health concerns</p><div className="mt-5 flex flex-wrap gap-3">{item.relatedConcerns.map(link=><Link key={link.href} href={link.href} className="rounded-full border border-deep-green/20 bg-white px-5 py-3 text-sm font-bold text-deep-green transition hover:border-deep-green">{link.label} →</Link>)}</div></div></section> : null}

      <section className="bg-[#07372f] px-4 py-20 text-ivory"><div className="mx-auto max-w-4xl text-center"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#d7c9a7]">Medical boundary</p><h2 className="mt-3 font-serif text-4xl md:text-5xl">Understanding an option is not the same as being suitable for it.</h2><p className="mx-auto mt-5 max-w-2xl leading-7 text-ivory/70">A qualified healthcare professional should review your diagnosis, medical history, medicines, contraindications, product or device details and current evidence before any treatment decision.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><CTAButton href="/health-discovery">Start health discovery</CTAButton><CTAButton href="/online-doctor" variant="outline">Speak with a doctor</CTAButton></div></div></section>
    </main>
  );
}
