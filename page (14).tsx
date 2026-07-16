import { ConversionPanel } from "@/components/ConversionPanel";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";

export default function IvTherapyPage() {
  return (
    <main>
      <PageHero
        eyebrow="IV Therapy"
        title="Supportive wellness therapy, reviewed responsibly."
        lead="MMS presents IV therapy as a doctor-assessed wellness support option, not a promised solution."
      />
      <Section
        eyebrow="Clinical Boundary"
        title="No exaggerated claims. No one-size-fits-all treatment."
        lead="Suitability depends on patient history, screening context, doctor review, and programme goals."
      >
        <div className="rounded-lg border border-stone-200 bg-white p-8 leading-8 text-stone-600">
          Subject to doctor assessment. Suitable candidates only. Individual outcomes vary.
        </div>
      </Section>
      <ConversionPanel title="Ask whether IV therapy is suitable for you." />
    </main>
  );
}
