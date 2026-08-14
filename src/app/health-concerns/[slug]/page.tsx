import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CTAButton } from "@/components/CTAButton";
import { getHealthConcern, healthConcerns } from "@/data/healthConcerns";

export function generateStaticParams() {
  return healthConcerns.map((item) => ({ slug: item.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const concern = getHealthConcern(params.slug);
  if (!concern) return {};
  return {
    title: concern.searchTitle,
    description: concern.intro,
    keywords: concern.seoTerms,
  };
}

const tone: Record<string, string> = {
  "Established clinical pathway": "bg-[#dfe9e3] text-deep-green",
  "Evidence varies / discuss": "bg-[#efe8de] text-navy",
  "Research or tightly regulated": "bg-navy text-ivory",
  "Assessment first": "bg-white text-deep-green",
};

export default function HealthConcernDetailPage({ params }: { params: { slug: string } }) {
  const concern = getHealthConcern(params.slug);
  if (!concern) notFound();

  return (
    <main>
      <section className="bg-[#062e29] px-4 pb-16 pt-28 text-ivory md:pt-36">
        <div className="mx-auto max-w-5xl">
          <Link href="/health-concerns" className="text-xs font-bold uppercase tracking-[.18em] text-[#d7c9a7]">← Health concern guides</Link>
          <h1 className="mt-5 max-w-4xl text-balance font-serif text-5xl leading-[1.04] md:text-7xl">{concern.title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-ivory/72">{concern.intro}</p>
        </div>
      </section>

      <section className="bg-ivory px-4 py-14"><div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-[.9fr_1.1fr]"><article className="rounded-[1.8rem] bg-white p-7 shadow-soft"><p className="text-xs font-bold uppercase tracking-[.15em] text-deep-green">In plain English</p><p className="mt-4 text-lg leading-8 text-navy">{concern.layman}</p></article><article className="rounded-[1.8rem] bg-[#edf2ef] p-7"><p className="text-xs font-bold uppercase tracking-[.15em] text-deep-green">Medical boundary</p><p className="mt-4 leading-7 text-warm-gray">This page is general education. It cannot tell you what you have or which treatment you personally need. A qualified healthcare professional should assess symptoms, review contraindications and confirm any diagnosis or treatment plan.</p></article></div></section>

      <section className="bg-warm-white px-4 py-16"><div className="mx-auto max-w-5xl"><div className="grid gap-6 lg:grid-cols-2"><article className="rounded-[1.8rem] border border-stone-200 bg-white p-7"><p className="text-xs font-bold uppercase tracking-[.15em] text-deep-green">What usually needs checking first</p><ul className="mt-5 grid gap-3">{concern.firstChecks.map(item=><li key={item} className="flex gap-3 rounded-xl bg-ivory p-4 text-sm leading-6 text-navy"><span className="font-bold text-deep-green">✓</span><span>{item}</span></li>)}</ul></article><article className="rounded-[1.8rem] border border-[#d8b9ad] bg-[#f5ece8] p-7"><p className="text-xs font-bold uppercase tracking-[.15em] text-[#8a5140]">Seek prompt medical attention if</p><ul className="mt-5 grid gap-3">{concern.redFlags.map(item=><li key={item} className="flex gap-3 text-sm leading-6 text-navy"><span className="font-bold text-[#8a5140]">!</span><span>{item}</span></li>)}</ul></article></div></div></section>

      <section className="bg-ivory px-4 py-16"><div className="mx-auto max-w-5xl"><div className="mb-8"><p className="text-xs font-bold uppercase tracking-[.16em] text-deep-green">Topics you may discuss</p><h2 className="mt-3 font-serif text-4xl text-navy md:text-5xl">Not every treatment belongs at the same evidence level.</h2><p className="mt-4 max-w-3xl leading-7 text-warm-gray">These links are intended to help you research and prepare questions. They are not a recommendation that you undergo the treatment.</p></div><div className="grid gap-5 md:grid-cols-2">{concern.relatedTopics.map(topic=><article key={topic.label} className="rounded-[1.7rem] border border-stone-200 bg-white p-6 shadow-soft"><div className="flex flex-wrap items-start justify-between gap-3"><h3 className="font-serif text-2xl text-navy">{topic.label}</h3><span className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${tone[topic.evidence]}`}>{topic.evidence}</span></div><p className="mt-4 text-sm leading-6 text-warm-gray">{topic.note}</p>{topic.href?<Link href={topic.href} className="mt-5 inline-flex text-sm font-bold text-deep-green">Read treatment guide →</Link>:null}</article>)}</div></div></section>

      <section className="bg-[#07372f] px-4 py-18 text-ivory"><div className="mx-auto max-w-5xl py-16 text-center"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#d7c9a7]">Next step</p><h2 className="mt-3 font-serif text-4xl md:text-5xl">Turn research into a qualified discussion.</h2><p className="mx-auto mt-4 max-w-2xl leading-7 text-ivory/70">Bring your symptoms, history, medications, test results and questions. MMS can help organise the discussion; a qualified professional decides what assessment or treatment is appropriate.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><CTAButton href="/health-discovery">Start health discovery</CTAButton><CTAButton href="/treatments" variant="outline">Browse all treatments</CTAButton></div></div></section>
    </main>
  );
}
