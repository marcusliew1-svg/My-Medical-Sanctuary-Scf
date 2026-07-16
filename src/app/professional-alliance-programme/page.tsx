import { ConversionPanel } from "@/components/ConversionPanel";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";

export default function ProfessionalAllianceProgrammePage() {
  return (
    <main>
      <PageHero
        eyebrow="Professional Alliance Programme"
        title="Partner with MMS to advance preventive healthcare."
        lead="The alliance programme is for professionals and organisations aligned with credible, ethical, and doctor-led health journeys."
      />
      <Section
        eyebrow="Alliance Partners"
        title="Designed for trust-based referral and collaboration."
        lead="Future workflows can support professional onboarding, referral tracking, CRM segmentation, and partner education."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {["Professional standards", "Patient-first referrals", "CRM-ready workflows"].map((item) => (
            <div key={item} className="rounded-lg border border-stone-200 bg-white p-7">
              <h2 className="text-2xl font-semibold">{item}</h2>
            </div>
          ))}
        </div>
      </Section>
      <ConversionPanel title="Start a professional alliance conversation." />
    </main>
  );
}
