import { ConversionPanel } from "@/components/ConversionPanel";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";

export default function WeightManagementPage() {
  return (
    <main>
      <PageHero
        eyebrow="Weight Management"
        title="Understand the health factors behind weight change."
        lead="MMS supports weight management through assessment, health screening, doctor review, and personalised planning."
      />
      <Section
        eyebrow="Personalised Planning"
        title="Weight is not treated as a cosmetic shortcut."
        lead="The MMS approach considers metabolic health, lifestyle, sleep, stress, body composition, and clinical suitability."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {["Body composition", "Metabolic review", "Sustainable follow-up"].map((item) => (
            <div key={item} className="rounded-lg border border-stone-200 bg-white p-7">
              <h2 className="text-2xl font-semibold">{item}</h2>
            </div>
          ))}
        </div>
      </Section>
      <ConversionPanel title="Plan weight management with clinical context." />
    </main>
  );
}
