import { ConversionPanel } from "@/components/ConversionPanel";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";

export default function MedicalTourismPage() {
  return (
    <main>
      <PageHero
        eyebrow="Medical Tourism"
        title="Malaysia-first, ASEAN-ready preventive healthcare."
        lead="This future-ready page prepares MMS for international patients seeking screening, doctor review, and wellness planning in Malaysia."
      />
      <Section
        eyebrow="Future Expansion"
        title="Built for coordinated patient journeys."
        lead="Future workflows may include travel coordination, multilingual content, concierge support, and clinic location selection."
      />
      <ConversionPanel title="Register interest for international patient support." />
    </main>
  );
}
