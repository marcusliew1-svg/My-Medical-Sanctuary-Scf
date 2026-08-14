import type { Metadata } from "next";
import Link from "next/link";
import { CTAButton } from "@/components/CTAButton";
import { healthConcerns } from "@/data/healthConcerns";
import { extraHealthConcerns } from "@/data/healthConcernsExtra";
import { expandedHealthConcerns } from "@/data/healthConcernsExpanded";

const indexHealthEducation = (process.env.MMS_HEALTH_EDUCATION_INDEXABLE ?? "false").toLowerCase() === "true";
const allConcerns = [...healthConcerns, ...extraHealthConcerns, ...expandedHealthConcerns];

export const metadata: Metadata = {
  title: "Health Concerns & Treatment Research",
  description: "Plain-English guides connecting common health concerns with screening and treatment topics to discuss with qualified medical professionals.",
  robots: { index: indexHealthEducation, follow: indexHealthEducation },
};

const evidenceTone: Record<string, string> = {
  "Established clinical pathway": "bg-[#dfe9e3] text-deep-green",
  "Evidence varies / discuss": "bg-[#efe8de] text-navy",
  "Research or tightly regulated": "bg-navy text-ivory",
  "Assessment first": "bg-white text-deep-green",
};

export default function HealthConcernsPage() {
  return (
    <main>
      <section className="relative isolate overflow-hidden bg-[#062e29] px-4 pb-16 pt-28 text-ivory md:pt-36">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_25%,rgba(112,165,142,.22),transparent_30%),radial-gradient(circle_at_15%_78%,rgba(196,174,133,.12),transparent_34%)]" />
        <div className="mx-auto grid min-h-[540px] max-w-6xl items-center gap-10 lg:grid-cols-[1fr_.9fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#d7c9a7]">Research by concern</p>
            <h1 className="mt-4 text-balance font-serif text-5xl leading-[1.03] md:text-7xl">Start with what you are feeling—not a treatment name.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ivory/72">Explore common symptoms and conditions, understand what usually needs checking first, then see which MMS treatment topics may be worth discussing with a qualified professional.</p>
            <div className="mt-8 flex flex-wrap gap-3"><CTAButton href="/health-discovery">Start health discovery</CTAButton><CTAButton href="/treatments" variant="outline">Browse treatments</CTAButton></div>
          </div>
          <div className="grid grid-cols-2 gap-3">{[["01","Symptom"],["02","Possible causes"],["03","Tests & evidence"],["04","Doctor discussion"]].map(([n,label],index)=><div key={n} className={`rounded-[1.7rem] border border-white/10 p-6 ${index===3?"bg-ivory text-navy":"bg-white/5"}`}><span className={`text-xs font-bold ${index===3?"text-deep-green":"text-[#d7c9a7]"}`}>{n}</span><p className="mt-3 font-serif text-2xl md:text-3xl">{label}</p></div>)}</div>
        </div>
      </section>

      <section className="bg-ivory px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 rounded-[2rem] border border-stone-200 bg-white p-7 shadow-soft md:p-9"><p className="text-xs font-bold uppercase tracking-[.18em] text-deep-green">Important</p><h2 className="mt-3 font-serif text-4xl text-navy">These are research pathways, not personalised recommendations.</h2><p className="mt-4 max-w-4xl leading-7 text-warm-gray">A symptom can have many causes. The pages below are designed to improve health literacy and search visibility while keeping the medical boundary clear: they do not diagnose, prescribe, promise outcomes or replace consultation with a qualified healthcare professional.</p><p className="mt-3 text-xs leading-5 text-warm-gray">Search indexing remains disabled by default until MMS completes clinical, regulatory and advertising review. It can be enabled later with the server-side MMS_HEALTH_EDUCATION_INDEXABLE flag.</p></div>

          <div className="grid gap-5 md:grid-cols-2">
            {allConcerns.map((concern, index) => (
              <Link key={concern.slug} href={`/health-concerns/${concern.slug}`} className="group rounded-[1.8rem] border border-stone-200 bg-white p-7 shadow-soft transition hover:-translate-y-1 hover:border-[#95ad9f]">
                <div className="flex items-center justify-between gap-4"><span className="text-xs font-bold uppercase tracking-[.14em] text-deep-green">Guide {String(index + 1).padStart(2,"0")}</span><span className="text-xl text-deep-green transition group-hover:translate-x-1">→</span></div>
                <h2 className="mt-4 font-serif text-3xl text-navy">{concern.title}</h2>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-warm-gray">{concern.intro}</p>
                <div className="mt-5 flex flex-wrap gap-2">{concern.relatedTopics.slice(0,3).map(topic=><span key={topic.label} className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${evidenceTone[topic.evidence]}`}>{topic.label}</span>)}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
