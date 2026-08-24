import { EditorialHero, FinalInvitation, JourneyLine, SplitStory } from "@/components/Editorial";

const alliancePath = [
  {
    title: "Fit",
    text: "Confirm alignment with preventive care, patient education and professional boundaries.",
  },
  {
    title: "Standards",
    text: "Review collaboration expectations before any patient-facing referral pathway.",
  },
  {
    title: "Pathway",
    text: "Define how enquiries, education and follow-up should move between parties.",
  },
  {
    title: "Governance",
    text: "Keep clinical decisions and regulated activities within appropriate professional roles.",
  },
  {
    title: "Continuity",
    text: "Support patients with clearer handoffs instead of fragmented one-off recommendations.",
  },
];

export default function ProfessionalAllianceProgrammePage() {
  return (
    <main>
      <EditorialHero
        eyebrow="Professional Alliance Programme"
        title="Collaboration should make healthcare clearer."
        lead="MMS welcomes aligned professionals and organisations who share a patient-first approach to preventive care, education and responsible coordination."
        image="/mms-about-hero.png"
        imageAlt="Professional healthcare collaboration discussion."
        primaryLabel="Start alliance conversation"
        primaryHref="/contact"
        secondaryLabel="Why MMS"
        secondaryHref="/why-mms"
      />

      <SplitStory
        eyebrow="Alliance principle"
        title="Referrals should feel governed, not opportunistic."
        lead="The programme is designed for trust-based collaboration where patients understand why they are being referred, what happens next and where professional responsibilities sit."
        image="/mms-health-screening-hero.png"
        imageAlt="Clinical review supporting professional collaboration."
        reverse
      >
        <div className="grid gap-5 border-y border-gold/35 py-7">
          {[
            "Patient-first referral thinking",
            "Clear professional boundaries",
            "Education before recommendation",
            "Continuity after introduction",
          ].map((item) => (
            <p key={item} className="font-serif text-2xl leading-snug text-navy">
              {item}
            </p>
          ))}
        </div>
      </SplitStory>

      <section className="bg-navy px-4 py-20 text-ivory md:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="editorial-kicker mb-5 text-gold-light">Collaboration pathway</p>
          <h2 className="max-w-3xl text-balance font-serif text-4xl leading-tight md:text-6xl">
            Built around clarity before scale.
          </h2>
          <div className="mt-12">
            <JourneyLine dark steps={alliancePath} />
          </div>
        </div>
      </section>

      <FinalInvitation
        title="Build the alliance around patient trust."
        lead="Start with a professional conversation and define the right boundaries before any collaboration goes live."
      />
    </main>
  );
}
