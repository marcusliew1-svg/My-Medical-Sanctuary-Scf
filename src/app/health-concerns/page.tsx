import type { Metadata } from "next";
import Link from "next/link";
import { EditorialHero, FinalInvitation } from "@/components/Editorial";
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
      <EditorialHero
        eyebrow="Research by concern"
        title="Start with what you are feeling—not a treatment name."
        lead="Explore symptoms and health concerns in plain language, understand what may need checking first, then see which questions belong with a qualified professional."
        image="/ling-knowledge.png"
        imageAlt="Ling, the MMS virtual health spokesperson, helping patients organise health concerns before professional review."
        primaryLabel="Start health discovery"
        primaryHref="/health-discovery"
        secondaryLabel="Science & Evidence"
        secondaryHref="/science-evidence"
        imagePosition="70% center"
        spokespersonName="Ling"
        spokespersonMessage="I can help organise the concern, explain common possibilities and evidence boundaries, and show when a doctor needs to take over."
        trustItems={[
          { title: "Symptom first", text: "Start with what changed, not a treatment name." },
          { title: "Evidence visible", text: "Guides distinguish established pathways from uncertain or emerging ideas." },
          { title: "No diagnosis", text: "Education does not replace professional assessment." },
          { title: "Better questions", text: "The goal is a more useful next conversation." },
        ]}
      />

      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 rounded-[2rem] border border-gold/20 bg-white/90 p-7 shadow-[0_26px_80px_rgba(11,26,46,0.07)] md:p-9"><p className="text-xs font-bold uppercase tracking-[.18em] text-deep-green">Important</p><h2 className="mt-3 font-serif text-4xl text-navy">These are research pathways, not personalised recommendations.</h2><p className="mt-4 max-w-4xl leading-7 text-warm-gray">A symptom can have many causes. The pages below are designed to improve health literacy and search visibility while keeping the medical boundary clear: they do not diagnose, prescribe, promise outcomes or replace consultation with a qualified healthcare professional.</p><p className="mt-3 text-xs leading-5 text-warm-gray">Search indexing remains disabled by default until MMS completes clinical, regulatory and advertising review. It can be enabled later with the server-side MMS_HEALTH_EDUCATION_INDEXABLE flag.</p></div>

          <div className="grid gap-5 md:grid-cols-2">
            {allConcerns.map((concern, index) => (
              <Link key={concern.slug} href={`/health-concerns/${concern.slug}`} className="group rounded-[1.8rem] border border-gold/18 bg-white/92 p-7 shadow-[0_20px_60px_rgba(11,26,46,0.06)] transition hover:-translate-y-1 hover:border-gold/40">
                <div className="flex items-center justify-between gap-4"><span className="text-xs font-bold uppercase tracking-[.14em] text-deep-green">Guide {String(index + 1).padStart(2,"0")}</span><span className="text-xl text-deep-green transition group-hover:translate-x-1">→</span></div>
                <h2 className="mt-4 font-serif text-3xl text-navy">{concern.title}</h2>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-warm-gray">{concern.intro}</p>
                <div className="mt-5 flex flex-wrap gap-2">{concern.relatedTopics.slice(0,3).map(topic=><span key={topic.label} className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${evidenceTone[topic.evidence]}`}>{topic.label}</span>)}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <FinalInvitation title="Use the guide to ask a better question—not to self-diagnose." lead="Ling can help organise the concern. Clinical interpretation remains with qualified professionals." />
    </main>
  );
}
