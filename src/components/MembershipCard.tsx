import type { Membership } from "@/data/memberships";
import { CTAButton } from "@/components/CTAButton";

type MembershipCardProps = {
  membership: Membership;
};

export function MembershipCard({ membership }: MembershipCardProps) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-gold-light/60 bg-ivory p-6 shadow-premium">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold">{membership.tagline}</p>
      <h3 className="mt-3 font-serif text-3xl text-navy">{membership.name}</h3>
      <p className="mt-2 text-lg font-semibold text-deep-green">{membership.accessNote}</p>
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
