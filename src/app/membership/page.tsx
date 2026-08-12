import { ButtonLink } from "@/components/ButtonLink";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { membershipTiers } from "@/lib/content";

export default function MembershipPage() {
  return (
    <main>
      <PageHero
        eyebrow="Membership"
        title="Long-term preventive care for different stages of life."
        lead="Membership comes after doctor review, when your health baseline and goals are clearer."
        primaryLabel="Start With Screening"
      />

      <Section
        eyebrow="Four Tiers"
        title="A structured relationship, not a one-off transaction."
        lead="Each membership tier supports a different level of continuity, optimisation, and clinical oversight."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {membershipTiers.map((tier) => (
            <article key={tier.name} className="rounded-lg border border-gold-light/40 bg-white/[0.92] p-8 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-gold/70 hover:shadow-premium">
              <h2 className="font-serif text-4xl text-navy">{tier.name}</h2>
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-gold">
                {tier.promise}
              </p>
              <p className="mt-6 leading-7 text-warm-gray">{tier.text}</p>
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
