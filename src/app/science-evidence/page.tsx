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

      <section className="relative overflow-hidden bg-[#f7f3eb] px-4 py-20 md:py-28">
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full border border-gold/15" />
        <div className="pointer-events-none absolute -right-20 bottom-4 h-80 w-80 rounded-full border border-gold/15" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-4xl text-center">
            <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
              <p className="editorial-kicker text-deep-green">Reference organisations</p>
              <span className="rounded-full border border-gold/25 bg-white/70 px-3 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.14em] text-deep-green/70">
                Framework reviewed Sep 2026
              </span>
            </div>
            <h2 className="text-balance font-serif text-4xl leading-tight text-navy md:text-6xl">
              Sources patients can inspect for themselves.
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-warm-gray">
              References are not endorsements of MMS or of every MMS service. They show the type of recognised guidance and evidence framework MMS should use when communicating preventive health.
            </p>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute left-1/2 top-[8.2rem] hidden h-[calc(100%-10rem)] w-px -translate-x-1/2 bg-gradient-to-b from-gold/40 via-gold/16 to-transparent lg:block" />
            <div className="pointer-events-none absolute left-[17%] right-[17%] top-[8.2rem] hidden h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent lg:block" />

            <div className="relative mx-auto mb-8 grid h-44 w-44 place-items-center rounded-full border border-gold/35 bg-[#fffdf7] text-center shadow-[0_24px_70px_rgba(11,26,46,0.08)]">
              <div className="absolute inset-3 rounded-full border border-gold/15" />
              <div className="relative px-5">
                <svg viewBox="0 0 48 48" className="mx-auto h-7 w-7 text-gold" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M8 11c6-2 11-1 16 3v25c-5-4-10-5-16-3V11ZM40 11c-6-2-11-1-16 3v25c5-4 10-5 16-3V11Z" />
                </svg>
                <p className="mt-3 font-serif text-2xl leading-tight text-navy">Recognised guidance</p>
                <p className="mt-2 text-[0.5rem] font-semibold uppercase tracking-[0.18em] text-deep-green/55">
                  Evidence framework
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {sourceGroups.map((source, index) => (
                <a
                  key={source.title}
                  href={source.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative overflow-hidden rounded-[1.8rem] border border-gold/20 bg-white/88 p-6 shadow-[0_20px_64px_rgba(11,26,46,0.06)] transition duration-500 hover:-translate-y-1 hover:border-gold/45 hover:shadow-[0_28px_74px_rgba(11,26,46,0.10)] md:p-7"
                >
                  <div className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-gold/20 bg-[#f8f1e4] text-gold transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    ↗
                  </div>

                  <div className="flex items-start gap-4 pr-12">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold/25 bg-[#fbf7ef] text-deep-green">
                      {index === 0 ? (
                        <svg viewBox="0 0 48 48" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M8 36h32M12 36V17h24v19M18 17v-5h12v5M18 24h4M26 24h4M18 30h4M26 30h4" />
                        </svg>
                      ) : index === 1 ? (
                        <svg viewBox="0 0 48 48" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <circle cx="24" cy="24" r="17" />
                          <path d="M7 24h34M24 7c5 5 7 10 7 17s-2 12-7 17c-5-5-7-10-7-17s2-12 7-17Z" />
                        </svg>
                      ) : index === 2 ? (
                        <svg viewBox="0 0 48 48" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M12 34c8-2 12-7 12-15 7 1 11 6 12 15" />
                          <path d="M24 19V9M17 15c-4-1-7-4-8-8 6 0 10 2 15 7" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 48 48" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M7 26h8l4-8 7 15 4-7h11" />
                          <path d="M24 41C12 35 7 28 7 19a9 9 0 0 1 16-5 9 9 0 0 1 18 5c0 9-5 16-17 22Z" />
                        </svg>
                      )}
                    </div>

                    <div>
                      <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-deep-green">{source.label}</p>
                      <h3 className="mt-2 font-serif text-3xl leading-tight text-navy">{source.title}</h3>
                    </div>
                  </div>

                  <p className="mt-5 max-w-xl text-sm leading-6 text-warm-gray">{source.text}</p>

                  <div className="mt-6 flex items-center gap-2 border-t border-gold/15 pt-4 text-[0.56rem] font-semibold uppercase tracking-[0.14em] text-deep-green/55">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                    Inspect source
                  </div>
                </a>
              ))}
            </div>
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
