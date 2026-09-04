import type { Metadata } from "next";
import { ButtonLink } from "@/components/ButtonLink";
import { EditorialHero } from "@/components/Editorial";

export const metadata: Metadata = {
  title: "Privacy / PDPA | My Medical Sanctuary",
  description:
    "How My Medical Sanctuary handles website enquiries, appointment requests and patient communication data.",
};

const currentPractices = [
  "The enquiry form accepts contact details, location, language, broad service or membership interest, contact preference, a bounded message, consent and limited referral or campaign attribution.",
  "The form tells visitors not to submit identity numbers, medical records, prescriptions, laboratory results or detailed medical history.",
  "Server controls validate fields and consent, reject unsupported data, limit request size, apply origin and abuse checks, and derive consent time and referral identity on the server.",
  "The reviewed Production baseline does not persist booking enquiries. Any future destination must remain server-side and return a truthful failure when storage is unavailable.",
  "Medical advice, diagnosis, prescription and treatment decisions remain outside the website enquiry workflow.",
];

const launchBlockers = [
  "Verified data-controller/legal-entity name, company or registration details and registered/contact address",
  "Privacy contact and documented process for access, correction, withdrawal, deletion and complaints",
  "Approved purposes, legal basis, retention periods, recipients/processors and cross-border transfer safeguards",
  "Approved security, incident, child/minor, direct-marketing and regulator/complaint disclosures",
  "Effective date, version owner and legal-counsel publication approval",
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
            {currentPractices.map((point) => (
              <article key={point} className="border-t border-gold/40 pt-5">
                <p className="text-lg leading-8 text-charcoal">{point}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-warm-white px-4 py-20 md:py-24">
        <div className="mx-auto max-w-5xl border-y border-gold/35 py-10">
          <p className="editorial-kicker text-deep-green">Publication blocker</p>
          <h2 className="mt-4 font-serif text-4xl text-navy md:text-5xl">Owner and legal approval is still required.</h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-warm-gray">
            This interim structure records verified website behavior. It is not a final privacy notice and must not be treated as launch-ready until the following facts are supplied and approved.
          </p>
          <ul className="mt-8 grid gap-4 text-base leading-7 text-charcoal">
            {launchBlockers.map((item) => <li key={item} className="border-t border-gold-light/60 pt-4">{item}</li>)}
          </ul>
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
