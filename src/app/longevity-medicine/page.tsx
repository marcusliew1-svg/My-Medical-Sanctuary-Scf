import { ConversionPanel } from "@/components/ConversionPanel";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";

export default function LongevityMedicinePage() {
  return (
    <main>
      <PageHero
        eyebrow="Longevity Medicine"
        title="Personalised health optimisation for healthy ageing."
        lead="MMS approaches longevity through screening, doctor review, lifestyle context, and evidence-informed planning."
      />
      <Section
        eyebrow="Longevity"
        title="Support resilience, performance, and ageing well."
        lead="Longevity programmes should be personalised to health status, goals, and clinical suitability."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {["Biological age indicators", "Metabolic health", "Long-term monitoring"].map((item) => (
            <div key={item} className="rounded-lg border border-stone-200 bg-white p-7">
              <h2 className="text-2xl font-semibold">{item}</h2>
              <p className="mt-4 leading-7 text-stone-600">Individual outcomes vary and must be reviewed with a doctor.</p>
            </div>
          ))}
        </div>
      </Section>
      <ConversionPanel title="Start your longevity journey with screening." />
    </main>
  );
}
