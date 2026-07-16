import { ConversionPanel } from "@/components/ConversionPanel";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";

export default function CorporateWellnessPage() {
  return (
    <main>
      <PageHero
        eyebrow="Corporate Wellness"
        title="Preventive healthcare for leadership teams and employees."
        lead="MMS can support corporate wellness through executive screening, education, preventive health programmes, and structured follow-up."
      />
      <Section
        eyebrow="For Organisations"
        title="Build a healthier, more informed workforce."
        lead="Corporate programmes can be tailored by company size, executive needs, employee demographics, and wellness goals."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {["Executive health screening", "Employee wellness education", "Long-term programme design"].map((item) => (
            <div key={item} className="rounded-lg border border-stone-200 bg-white p-7">
              <h2 className="text-2xl font-semibold">{item}</h2>
            </div>
          ))}
        </div>
      </Section>
      <ConversionPanel title="Discuss a corporate wellness programme." />
    </main>
  );
}
