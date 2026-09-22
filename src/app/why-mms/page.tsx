import { EditorialHero, EditorialStatement, FinalInvitation, SplitStory } from "@/components/Editorial";
import { metadataFor } from "@/components/PatientEditorialPage";
import { EvidenceStandard } from "@/components/EvidenceStandard";

export const metadata = metadataFor(
  "Why MMS",
  "Why My Medical Sanctuary is built around earlier understanding, medical judgement and continuity.",
);

export default function WhyMmsPage() {
  return (
    <main>
      <EditorialHero
        eyebrow="Why MMS"
        title="Trust is built before a recommendation is made."
        lead="MMS is designed for patients who want serious preventive health guidance with clearer evidence boundaries, physician judgement and continuity."
        image="/ling-mms-guide.png"
        imageAlt="Ling, the MMS virtual health spokesperson, introducing why MMS exists."
        primaryLabel="Start with clarity"
        secondaryLabel="How MMS works"
        secondaryHref="/how-it-works"
        imagePosition="72% center"
        spokespersonName="Ling"
        spokespersonMessage="I’ll help you understand how MMS is different: earlier insight, physician judgement and continuity rather than one-off health purchases."
      />

      <EditorialStatement
        eyebrow="Trust"
        title="A patient should feel understood, informed and protected from rushed decisions."
        lead="That is why MMS begins with screening, education, doctor assessment and continuity."
      />

      <SplitStory
        eyebrow="What makes it different"
        title="MMS is not trying to look like a normal clinic."
        lead="The experience combines medical judgement, private care coordination and health education for people thinking about the next decade, not only the next appointment."
        image="/mms-health-screening-hero.png"
        imageAlt="Doctor and patient reviewing health results."
        dark
      >
        <div className="grid gap-5 text-ivory/74">
          <p>Medical decisions remain with qualified professionals.</p>
          <p>Technology supports learning and preparation.</p>
          <p>Membership follows understanding, not pressure.</p>
        </div>
      </SplitStory>

      <EvidenceStandard />

      <FinalInvitation title="Start with understanding. Trust can grow from there." />
    </main>
  );
}
