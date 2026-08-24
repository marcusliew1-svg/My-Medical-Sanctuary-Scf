import { EditorialHero, FinalInvitation, JourneyLine, SplitStory } from "@/components/Editorial";
import { metadataFor } from "@/components/PatientEditorialPage";

export const metadata = metadataFor(
  "Your Health Journey",
  "The MMS patient journey from understanding to screening, doctor assessment, roadmap and long-term care.",
);

const path = [
  { title: "Understand", text: "Begin with what you want to know about your health." },
  { title: "Screen", text: "Build a baseline that gives the conversation substance." },
  { title: "Assess", text: "Doctors review results and clinical context." },
  { title: "Roadmap", text: "Translate priorities into a practical health plan." },
  { title: "For life", text: "Continue with the right depth of relationship." },
];

export default function HealthJourneyPage() {
  return (
    <main>
      <EditorialHero
        eyebrow="Your health journey"
        title="The next step is not treatment. It is understanding."
        lead="MMS guides patients from health questions to screening, doctor assessment, personalised planning and long-term care."
        image="/mms-about-hero.png"
        imageAlt="Doctor and patient planning a health journey."
        primaryLabel="Book screening"
        primaryHref="/health-screening"
        secondaryLabel="Ask Ling"
        secondaryHref="/ling"
      />

      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 max-w-3xl">
            <p className="editorial-kicker mb-4 text-deep-green">MMS sequence</p>
            <h2 className="text-balance font-serif text-4xl leading-tight text-navy md:text-6xl">
              A journey designed in the order patients actually need.
            </h2>
          </div>
          <JourneyLine steps={path} />
        </div>
      </section>

      <SplitStory
        eyebrow="Care coordination"
        title="Good systems should make care feel human."
        lead="Ling supports learning. HRM coordination supports continuity. Doctors retain clinical judgement."
        image="/ling-guide.png"
        imageAlt="Ling as a health education guide."
        dark
        imagePosition="82% center"
      />

      <FinalInvitation />
    </main>
  );
}
