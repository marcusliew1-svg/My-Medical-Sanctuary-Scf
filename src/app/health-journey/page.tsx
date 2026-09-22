import { EditorialHero, FinalInvitation, JourneyLine, SplitStory } from "@/components/Editorial";
import { metadataFor } from "@/components/PatientEditorialPage";

export const metadata = metadataFor(
  "Your Health Journey",
  "The MMS patient journey from understanding to screening, doctor assessment, roadmap and long-term care.",
);

const path = [
  { title: "Discover", text: "Begin with what changed, what matters and what you want to understand." },
  { title: "Measure", text: "Use selected screening and diagnostics to build a useful baseline." },
  { title: "Understand", text: "Doctors interpret results, history and risk in clinical context." },
  { title: "Optimise", text: "Translate what matters into practical, proportionate next steps." },
  { title: "Monitor", text: "Follow relevant trends over time and adjust when the evidence changes." },
];

export default function HealthJourneyPage() {
  return (
    <main>
      <EditorialHero
        eyebrow="Your health journey"
        title="The next step is not treatment. It is understanding."
        lead="MMS guides patients from health questions to screening, doctor assessment, personalised planning and long-term care."
        image="/ling-mms-guide.png"
        imageAlt="Ling, the MMS virtual health spokesperson, guiding the MMS health journey."
        primaryLabel="Start discovery"
        primaryHref="/health-discovery"
        secondaryLabel="Ask Ling"
        secondaryHref="/ling"
        imagePosition="72% center"
        spokespersonName="Ling"
        spokespersonMessage="I’ll help you understand where you are in the journey and what question should come before the next test or appointment."
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
        image="/ling-continuity.png"
        imageAlt="Ling supporting continuity between education and doctor-led care."
        dark
        imagePosition="82% center"
      />

      <FinalInvitation />
    </main>
  );
}
