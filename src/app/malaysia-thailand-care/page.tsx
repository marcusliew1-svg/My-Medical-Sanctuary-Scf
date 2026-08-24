import type { Metadata } from "next";
import { EditorialHero, FinalInvitation } from "@/components/Editorial";

export const metadata: Metadata = {
  title: "Malaysia Thailand Care",
  description:
    "Regional care coordination for patients considering preventive health continuity across Malaysia and Thailand.",
};

const regions = [
  ["Malaysia", "Preventive health, MMS continuity and structured patient relationship management."],
  ["Thailand", "Selected specialist, recovery and regional access discussions where appropriate."],
  ["MMS coordination", "A single thread so the patient understands what happens before, during and after travel."],
];

export default function MalaysiaThailandCarePage() {
  return (
    <main>
      <EditorialHero
        eyebrow="Regional care"
        title="Your care can travel with you."
        lead="Malaysia and Thailand should not feel like generic medical tourism. MMS frames regional care around clarity, suitability and coordination."
        image="/mms-health-screening-hero.png"
        imageAlt="Doctor-led care coordination conversation."
        primaryLabel="Discuss regional care"
        secondaryLabel="Ask Ling"
        secondaryHref="/ling"
      />

      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="editorial-kicker mb-4 text-deep-green">Care continuity</p>
            <h2 className="text-balance font-serif text-4xl leading-tight text-navy md:text-6xl">
              Regional access needs a human coordinator.
            </h2>
          </div>
          <div className="grid gap-8">
            {regions.map(([title, text]) => (
              <div key={title} className="border-t border-gold/45 pt-5">
                <h3 className="font-serif text-3xl text-navy">{title}</h3>
                <p className="mt-3 leading-7 text-warm-gray">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FinalInvitation title="If care involves travel, clarity matters even more." />
    </main>
  );
}
