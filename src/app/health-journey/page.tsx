import { ButtonLink } from "@/components/ButtonLink";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { platformModules } from "@/data/platformModules";
import { journeyCards } from "@/lib/content";

const steps = [
  "Understand Your Health",
  "Health Screening",
  "Doctor Assessment",
  "Personalised Health Roadmap",
  "Membership",
  "Health For Life",
];

export default function HealthJourneyPage() {
  return (
    <main>
      <PageHero
        eyebrow="Your Health Journey"
        title="A calm, structured path from clarity to long-term care."
        lead="MMS guides visitors from understanding their health to screening, doctor assessment, personalised planning, membership, and health for life."
        primaryLabel="Book Health Screening"
      />

      <Section eyebrow="Journey Map" title="The MMS experience is designed in sequence.">
        <div className="grid gap-px overflow-hidden rounded-lg border border-stone-200 bg-stone-200 md:grid-cols-6">
          {steps.map((step, index) => (
            <div key={step} className="min-h-40 bg-white p-6">
              <p className="mb-10 text-xs font-bold uppercase tracking-[0.14em] text-teal-700">0{index + 1}</p>
              <h2 className="text-lg font-semibold leading-tight">{step}</h2>
            </div>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Personal Priorities"
        title="Choose the reason you are here."
        lead="Each path begins with education and health screening before doctor-led recommendations."
        className="bg-warm-white"
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {journeyCards.map((card) => (
            <article key={card.title} className="rounded-lg border border-gold-light/40 bg-white/[0.92] p-7 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-gold/70 hover:shadow-premium">
              <div className="mb-5 h-px w-12 bg-gold" />
              <h2 className="font-serif text-2xl text-navy">{card.title}</h2>
              <p className="mt-4 leading-7 text-warm-gray">{card.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Platform Support"
        title="Some journeys need better intelligence before the next decision."
        lead="Ling, medicine access intelligence and the SCF roadmap sit around the MMS journey as supporting capabilities, not shortcuts around professional review."
      >
        <div className="grid gap-5 md:grid-cols-3">
          {platformModules.map((module) => (
            <article key={module.href} className="rounded-lg border border-gold-light/40 bg-white/[0.92] p-7 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-gold/70 hover:shadow-premium">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">
                {module.eyebrow}
              </p>
              <h2 className="mt-3 font-serif text-2xl text-navy">{module.title}</h2>
              <p className="mt-4 leading-7 text-warm-gray">{module.text}</p>
              <ButtonLink href={module.href} variant="outline" className="mt-5">
                Learn More
              </ButtonLink>
            </article>
          ))}
        </div>
      </Section>

      <section className="px-4 py-20">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 rounded-lg border border-gold-light/50 bg-navy p-8 text-ivory shadow-premium md:flex-row md:items-center md:p-12">
          <h2 className="max-w-3xl font-serif text-4xl leading-tight md:text-5xl">
            Your next step is not treatment. It is understanding.
          </h2>
          <ButtonLink href="/contact" variant="light">Book Health Screening</ButtonLink>
        </div>
      </section>
    </main>
  );
}
