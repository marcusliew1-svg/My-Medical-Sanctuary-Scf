import type { Membership } from "@/data/memberships";
import { CTAButton } from "@/components/CTAButton";

type MembershipCardProps = {
  membership: Membership;
};

export function MembershipCard({ membership }: MembershipCardProps) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-gold-light/70 bg-white/[0.92] p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-premium">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">{membership.tagline}</p>
      <h3 className="mt-4 font-serif text-4xl leading-tight text-navy">{membership.name}</h3>
      <p className="mt-3 text-base font-semibold text-deep-green">{membership.accessNote}</p>
      <p className="mt-5 leading-7 text-warm-gray">{membership.whoItSuits}</p>
      <p className="mt-4 leading-7 text-charcoal">{membership.coordination}</p>
      <ul className="mt-5 grid gap-2 text-sm text-warm-gray">
        {membership.firstThirtyDays.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 size-1.5 rounded-full bg-gold" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-xs leading-6 text-warm-gray">
        No outcome promises. Services are subject to professional review and suitability assessment.
      </p>
      <CTAButton href="/contact" className="mt-6">
        Enquire
      </CTAButton>
    </article>
  );
}
