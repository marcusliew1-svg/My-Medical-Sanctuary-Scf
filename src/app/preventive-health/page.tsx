import type { Metadata } from "next";
import { EditorialHero, FinalInvitation, ImagePanel } from "@/components/Editorial";

export const metadata: Metadata = {
  title: "Preventive Health | My Medical Sanctuary",
  description:
    "Understand why preventive health focuses on useful baselines, meaningful trends, appropriate screening and doctor-guided action before symptoms become the only signal.",
};

const quietChanges = [
  ["Blood pressure", "Hypertension can exist without obvious symptoms, so appropriate measurement matters."],
  ["Metabolic health", "Glucose regulation, insulin sensitivity and liver-related markers may change gradually over time."],
  ["Cardiovascular risk", "Lipids and other risk markers need interpretation in the context of age, history and overall risk."],
  ["Body composition", "Muscle, fat distribution and visceral fat can add context that body weight alone may miss."],
  ["Hormonal health", "Hormonal changes may affect energy, sleep, body composition and wellbeing, but require clinical interpretation."],
  ["Inflammation", "Inflammatory markers can be useful in selected situations, but are not a universal diagnosis on their own."],
];

export default function PreventiveHealthPage() {
  return (
    <main>
      <EditorialHero
        eyebrow="Preventive health"
        title="Know earlier. Understand better. Act with context."
        lead="Preventive healthcare is not about testing everything. It is about establishing useful baselines, watching meaningful change and reviewing the right signals with qualified medical professionals."
        image="/mms-silent-risk.webp"
        imageAlt="Preventive health visual showing subtle health changes before symptoms become obvious."
        primaryLabel="Start health discovery"
        primaryHref="/health-discovery"
        secondaryLabel="How MMS works"
        secondaryHref="/how-it-works"
        imagePosition="58% center"
      />

      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
            <div>
              <p className="editorial-kicker mb-5 text-deep-green">Silent change</p>
              <h2 className="text-balance font-serif text-5xl leading-[1.02] text-navy md:text-7xl">
                Feeling well is valuable. It is not the same as knowing your risk.
              </h2>
              <p className="mt-6 text-lg leading-8 text-warm-gray">
                Some risk factors and health changes can develop before symptoms appear. The purpose of preventive care is to decide what deserves measurement, what needs context and what should simply be monitored.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {quietChanges.map(([title, text]) => (
                <div key={title} className="rounded-[1.4rem] border border-gold/20 bg-white/70 p-5 shadow-[0_18px_50px_rgba(11,26,46,0.05)]">
                  <h3 className="font-serif text-2xl text-navy">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-warm-gray">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#07151d] px-4 py-20 text-ivory md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.18fr_0.82fr] lg:items-center">
          <ImagePanel
            src="/mms-early-vs-late.webp"
            alt="Visual comparison between earlier monitoring and later urgent treatment."
            className="min-h-[420px] rounded-[1.8rem] border border-white/10 shadow-[0_42px_120px_rgba(0,0,0,0.30)]"
            objectPosition="50% center"
          />
          <div>
            <p className="editorial-kicker mb-5 text-gold-light">Earlier versus later</p>
            <h2 className="text-balance font-serif text-5xl leading-[1.02] md:text-7xl">
              Earlier information can create more room to decide.
            </h2>
            <p className="mt-6 text-lg leading-8 text-ivory/66">
              When a meaningful change is recognised earlier, there may be more time to review lifestyle, monitoring, further investigation or clinical treatment where appropriate.
            </p>
            <p className="mt-4 text-sm leading-7 text-ivory/50">
              This does not mean screening prevents every illness or finds every condition early. The value is in reducing avoidable delay and improving the quality of the conversation around your health.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#f3eee5] px-4 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="editorial-kicker mb-5 text-deep-green">What should be checked?</p>
          <h2 className="max-w-4xl text-balance font-serif text-5xl leading-[1.02] text-navy md:text-7xl">
            Good prevention is selective, not excessive.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <div className="rounded-[1.6rem] border border-gold/20 bg-white/70 p-7">
              <h3 className="font-serif text-3xl text-navy">Your context matters</h3>
              <p className="mt-4 leading-7 text-warm-gray">
                Age, family history, symptoms, medication, lifestyle, prior results and individual risk should influence which screening or measurements are useful.
              </p>
            </div>
            <div className="rounded-[1.6rem] border border-gold/20 bg-white/70 p-7">
              <h3 className="font-serif text-3xl text-navy">One result is not the whole story</h3>
              <p className="mt-4 leading-7 text-warm-gray">
                A single number may be reassuring, concerning or simply incomplete. Trends and clinical interpretation often provide more useful context.
              </p>
            </div>
          </div>
        </div>
      </section>

      <FinalInvitation
        title="Start with your questions, then decide what deserves measurement."
        lead="MMS Health Discovery helps organise the first conversation before programmes or treatments are considered."
      />
    </main>
  );
}
