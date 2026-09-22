import type { Metadata } from "next";
import { EditorialHero, FinalInvitation } from "@/components/Editorial";
import { EvidenceStandard } from "@/components/EvidenceStandard";
import { ScreeningEvidence } from "@/components/ScreeningEvidence";
import { EvidenceLadder } from "@/components/EvidenceLadder";
import { ClinicalGovernance } from "@/components/ClinicalGovernance";
import { SourceHierarchy } from "@/components/SourceHierarchy";

export const metadata: Metadata = {
  title: "Science & Evidence",
  description:
    "How My Medical Sanctuary uses clinical guidance, evidence hierarchy, physician judgement and transparent uncertainty across preventive care and longevity.",
};

const principles = [
  {
    title: "Use the strongest relevant evidence",
    text: "Clinical guidelines, high-quality reviews and established professional standards should take priority over novelty or marketing appeal.",
  },
  {
    title: "Prefer local relevance",
    text: "Malaysian clinical guidance and regulation matter. International guidance can add context, but should not silently replace local standards.",
  },
  {
    title: "Show uncertainty",
    text: "Where evidence is incomplete, evolving or highly individual, MMS should say so visibly rather than implying certainty.",
  },
  {
    title: "Separate education from medical decisions",
    text: "Ling can explain concepts and evidence levels. Personal interpretation, diagnosis, prescribing and suitability decisions stay with qualified professionals.",
  },
];

const sourceGroups = [
  {
    label: "Malaysia",
    title: "Ministry of Health Malaysia",
    text: "Clinical Practice Guidelines across cardiovascular, endocrine, cancer and other areas provide the local reference layer.",
    href: "https://www.moh.gov.my/penerbitan-dan-laporan/dasar-akta-polisi-garis-panduan/penerbitan-klinikal/senarai-penerbitan-klinikal/panduan-amalan-klinikal-cpg",
  },
  {
    label: "Global",
    title: "World Health Organization",
    text: "WHO guidance provides a global prevention and noncommunicable-disease framework, including recognised behavioural and metabolic risk factors.",
    href: "https://www.who.int/news-room/fact-sheets/detail/noncommunicable-diseases",
  },
  {
    label: "Prevention",
    title: "U.S. Preventive Services Task Force",
    text: "USPSTF recommendations provide transparent grading and evidence review for many preventive screening decisions.",
    href: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation-topics/uspstf-a-and-b-recommendations",
  },
  {
    label: "Cardiovascular",
    title: "American Heart Association",
    text: "AHA frameworks such as Life's Essential 8 provide a recognised model for cardiovascular health behaviours and factors.",
    href: "https://www.heart.org/en/healthy-living/healthy-lifestyle/lifes-essential-8",
  },
];

export default function ScienceEvidencePage() {
  return (
    <main>
      <EditorialHero
        eyebrow="Science & evidence"
        title="Evidence should be visible, not implied."
        lead="MMS is designed to distinguish established care from emerging science, use recognised guidance where relevant and keep personal medical decisions under professional review."
        image="/ling-knowledge.png"
        imageAlt="Ling, the MMS virtual health spokesperson, introducing the MMS evidence framework."
        primaryLabel="Explore screening"
        primaryHref="/health-screening"
        secondaryLabel="Ask Ling"
        secondaryHref="/ling"
        imagePosition="70% center"
        spokespersonName="Ling"
        spokespersonMessage="I can help explain what the evidence says, what remains uncertain and which questions belong with your doctor."
      />

      <EvidenceStandard />

      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.68fr_1.32fr]">
          <div>
            <p className="editorial-kicker mb-4 text-deep-green">How MMS should use evidence</p>
            <h2 className="text-balance font-serif text-4xl leading-tight text-navy md:text-6xl">
              Scientific credibility comes from method, not decoration.
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {principles.map((item, index) => (
              <article key={item.title} className="rounded-[1.5rem] border border-gold/20 bg-white/85 p-5 shadow-[0_18px_52px_rgba(11,26,46,0.06)] md:p-6">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-deep-green/55">0{index + 1}</p>
                <h3 className="mt-3 font-serif text-2xl text-navy">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-warm-gray">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ScreeningEvidence />

      <ClinicalGovernance />

      <SourceHierarchy />

      <EvidenceLadder />

      <section className="bg-[#f7f3eb] px-4 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <p className="editorial-kicker text-deep-green">Reference organisations</p>
              <span className="rounded-full border border-gold/25 bg-white/70 px-3 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.14em] text-deep-green/70">
                Framework reviewed Sep 2026
              </span>
            </div>
            <h2 className="text-balance font-serif text-4xl leading-tight text-navy md:text-6xl">
              Sources patients can inspect for themselves.
            </h2>
            <p className="mt-6 text-lg leading-8 text-warm-gray">
              References are not endorsements of MMS or of every MMS service. They show the type of recognised guidance and evidence framework MMS should use when communicating preventive health.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {sourceGroups.map((source) => (
              <a
                key={source.title}
                href={source.href}
                target="_blank"
                rel="noreferrer"
                className="group rounded-[1.5rem] border border-gold/20 bg-white/88 p-6 transition hover:-translate-y-0.5 hover:border-gold/45 hover:shadow-[0_22px_64px_rgba(11,26,46,0.08)]"
              >
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-deep-green">{source.label}</p>
                <div className="mt-3 flex items-start justify-between gap-5">
                  <div>
                    <h3 className="font-serif text-3xl text-navy">{source.title}</h3>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-warm-gray">{source.text}</p>
                  </div>
                  <span className="text-gold transition group-hover:translate-x-0.5">↗</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <FinalInvitation
        title="Understand the evidence before deciding what is right for you."
        lead="Ling can explain the framework. Your doctor decides what applies to your health."
      />
    </main>
  );
}
