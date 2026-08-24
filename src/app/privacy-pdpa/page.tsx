import type { Metadata } from "next";
import { ButtonLink } from "@/components/ButtonLink";
import { EditorialHero } from "@/components/Editorial";

export const metadata: Metadata = {
  title: "Privacy / PDPA | My Medical Sanctuary",
  description:
    "How My Medical Sanctuary handles website enquiries, appointment requests and patient communication data.",
};

const privacyPoints = [
  "MMS collects information you provide through enquiry, booking and communication forms.",
  "Submitted information is used to respond to enquiries, coordinate appointments and support patient service workflows.",
  "Website form submissions may flow into MMS lead and service systems when the relevant integration is enabled.",
  "Medical advice, diagnosis and treatment decisions remain part of doctor-led clinical care, not website automation.",
  "You may contact MMS to request access, correction or withdrawal of consent where applicable.",
];

export default function PrivacyPdpaPage() {
  return (
    <main>
      <EditorialHero
        eyebrow="Privacy / PDPA"
        title="Respect for privacy is part of care."
        lead="MMS collects only the information needed to respond professionally, coordinate requested next steps and maintain appropriate patient communication."
        image="/mms-about-hero.png"
        imageAlt="Private healthcare consultation with patient confidentiality."
        primaryLabel="Contact MMS"
        primaryHref="/contact"
        secondaryLabel="Read terms"
        secondaryHref="/terms"
      />

      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <p className="editorial-kicker mb-4 text-deep-green">Data care</p>
            <h2 className="text-balance font-serif text-4xl leading-tight text-navy md:text-6xl">
              Website information should serve the patient&apos;s requested next step.
            </h2>
            <p className="mt-6 text-lg leading-8 text-warm-gray">
              This page sets out the practical privacy posture for enquiry and communication
              workflows. It should be read together with MMS clinical consent processes where applicable.
            </p>
          </div>
          <div className="grid gap-5">
            {privacyPoints.map((point) => (
              <article key={point} className="border-t border-gold/40 pt-5">
                <p className="text-lg leading-8 text-charcoal">{point}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy px-4 py-16 text-ivory">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 border-y border-gold-light/30 py-10 md:flex-row md:items-center">
          <h2 className="max-w-2xl text-balance font-serif text-4xl leading-tight md:text-5xl">
            Questions about your information?
          </h2>
          <ButtonLink href="/contact">Contact MMS</ButtonLink>
        </div>
      </section>
    </main>
  );
}
