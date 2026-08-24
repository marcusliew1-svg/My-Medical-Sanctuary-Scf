import type { Metadata } from "next";
import { ButtonLink } from "@/components/ButtonLink";
import { EditorialHero } from "@/components/Editorial";
import { lingDisclaimer } from "@/lib/content";

export const metadata: Metadata = {
  title: "Terms of Use | My Medical Sanctuary",
  description:
    "Terms of use for My Medical Sanctuary website content, education, enquiries, Ling and professional review boundaries.",
};

const terms = [
  "This website provides general information about My Medical Sanctuary, preventive healthcare, health screening, membership and education.",
  "Information on this website is not a substitute for consultation with a qualified MMS doctor.",
  lingDisclaimer,
  "Membership and programme suitability may depend on screening, doctor assessment, clinical judgement and patient goals.",
  "Website content may be updated as MMS services, programmes and clinical workflows evolve.",
];

export default function TermsPage() {
  return (
    <main>
      <EditorialHero
        eyebrow="Terms of Use"
        title="Clear boundaries support better care."
        lead="Use this website for education and enquiry. Personalised healthcare decisions should be made through consultation, screening, doctor assessment and professional review."
        image="/mms-health-screening-hero.png"
        imageAlt="Doctor-led review supporting clear terms of use."
        primaryLabel="Book health screening"
        primaryHref="/contact"
        secondaryLabel="Privacy / PDPA"
        secondaryHref="/privacy-pdpa"
      />

      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <p className="editorial-kicker mb-4 text-deep-green">Website terms</p>
            <h2 className="text-balance font-serif text-4xl leading-tight text-navy md:text-6xl">
              Educational content should lead to better questions.
            </h2>
            <p className="mt-6 text-lg leading-8 text-warm-gray">
              MMS keeps public website content separate from personalised medical review. That
              distinction protects the patient and the professional standard of care.
            </p>
          </div>
          <div className="grid gap-5">
            {terms.map((term) => (
              <article key={term} className="border-t border-gold/40 pt-5">
                <p className="text-lg leading-8 text-charcoal">{term}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy px-4 py-16 text-ivory">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 border-y border-gold-light/30 py-10 md:flex-row md:items-center">
          <h2 className="max-w-2xl text-balance font-serif text-4xl leading-tight md:text-5xl">
            Start with doctor-led screening.
          </h2>
          <ButtonLink href="/contact">Book Health Screening</ButtonLink>
        </div>
      </section>
    </main>
  );
}
