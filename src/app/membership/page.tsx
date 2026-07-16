import { ButtonLink } from "@/components/ButtonLink";
import { Section } from "@/components/Section";
import { membershipTiers } from "@/lib/content";

export default function MembershipPage() {
  return (
    <main>
      <section className="bg-stone-950 px-4 pb-20 pt-36 text-white md:pt-44">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-teal-200">Membership</p>
          <h1 className="max-w-5xl text-balance text-5xl font-semibold leading-tight md:text-7xl">
            Long-term preventive care for different stages of life.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/[0.72]">
            Membership comes after doctor review, when your health baseline and goals are clearer.
          </p>
        </div>
      </section>

      <Section
        eyebrow="Four Tiers"
        title="A structured relationship, not a one-off transaction."
        lead="Each membership tier supports a different level of continuity, optimisation, and clinical oversight."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {membershipTiers.map((tier) => (
            <article key={tier.name} className="rounded-lg border border-stone-200 bg-white p-8 shadow-[0_18px_46px_rgba(20,42,48,0.06)]">
              <h2 className="text-3xl font-semibold">{tier.name}</h2>
              <p className="mt-2 text-sm font-bold uppercase tracking-[0.12em] text-teal-700">
                {tier.promise}
              </p>
              <p className="mt-6 leading-7 text-stone-600">{tier.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Clinical Suitability"
        title="Membership follows screening and doctor assessment."
        lead="This protects patients from jumping into programmes before MMS understands their health profile, risks, goals, and suitability."
        dark
      >
        <ButtonLink href="/contact" variant="light">Start With Screening</ButtonLink>
      </Section>
    </main>
  );
}
