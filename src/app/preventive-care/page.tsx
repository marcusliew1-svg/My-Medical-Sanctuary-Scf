import { ConversionPanel } from "@/components/ConversionPanel";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";

export default function PreventiveCarePage() {
  return (
    <main>
      <PageHero
        eyebrow="Preventive Care"
        title="Act before small health risks become larger concerns."
        lead="Preventive care at MMS focuses on early detection, health baselines, doctor assessment, and personalised follow-up."
      />
      <Section
        eyebrow="How MMS Helps"
        title="From health screening to practical next steps."
        lead="The goal is to reduce uncertainty and support better long-term decisions without exaggerated claims."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {["Understand risk", "Review with a doctor", "Plan ahead"].map((item) => (
            <div key={item} className="rounded-lg border border-stone-200 bg-white p-7">
              <h2 className="text-2xl font-semibold">{item}</h2>
              <p className="mt-4 leading-7 text-stone-600">
                Subject to doctor assessment. Suitable candidates only. Individual outcomes vary.
              </p>
            </div>
          ))}
        </div>
      </Section>
      <ConversionPanel title="Book a preventive health consultation." />
    </main>
  );
}
