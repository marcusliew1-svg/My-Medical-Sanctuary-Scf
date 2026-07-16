import { ButtonLink } from "@/components/ButtonLink";
import { lingDisclaimer } from "@/lib/content";
import { Section } from "@/components/Section";

const terms = [
  "This website provides general information about My Medical Sanctuary, preventive healthcare, health screening, membership, and education.",
  "Information on this website is not a substitute for consultation with a qualified MMS doctor.",
  lingDisclaimer,
  "Membership and programme suitability may depend on screening, doctor assessment, clinical judgement, and patient goals.",
  "Website content may be updated as MMS services, programmes, and clinical workflows evolve.",
];

export default function TermsPage() {
  return (
    <main>
      <section className="bg-stone-950 px-4 pb-20 pt-36 text-white md:pt-44">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-teal-200">Terms</p>
          <h1 className="max-w-5xl text-balance text-5xl font-semibold leading-tight md:text-7xl">
            Clear boundaries support better care.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/[0.72]">
            This placeholder Terms page should be reviewed by legal counsel before the public
            launch.
          </p>
        </div>
      </section>

      <Section
        eyebrow="Website Terms"
        title="Use this website for education and enquiry."
        lead="Clinical decisions should be made through consultation, screening, doctor assessment, and personalised medical review."
      >
        <div className="grid gap-4">
          {terms.map((term) => (
            <div key={term} className="rounded-lg border border-stone-200 bg-white p-6 leading-7 text-stone-700">
              {term}
            </div>
          ))}
        </div>
      </Section>

      <section className="px-4 pb-20">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 rounded-lg bg-[#eef6f3] p-8 md:flex-row md:items-center md:p-12">
          <h2 className="max-w-2xl text-3xl font-semibold md:text-5xl">
            Start with doctor-led screening.
          </h2>
          <ButtonLink href="/contact">Book Health Screening</ButtonLink>
        </div>
      </section>
    </main>
  );
}
