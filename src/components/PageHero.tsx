import { ButtonLink } from "@/components/ButtonLink";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  lead: string;
  primaryHref?: string;
  primaryLabel?: string;
};

export function PageHero({
  eyebrow,
  title,
  lead,
  primaryHref = "/book-appointment",
  primaryLabel = "Book Appointment",
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-navy px-4 pb-16 pt-32 text-ivory md:pt-40">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-light/70 to-transparent" />
      <div className="mx-auto max-w-6xl">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-teal-200">
          {eyebrow}
        </p>
        <h1 className="max-w-4xl text-balance font-serif text-5xl leading-[1.04] md:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-ivory/72">{lead}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={primaryHref}>{primaryLabel}</ButtonLink>
          <ButtonLink href="/contact" variant="light">
            Contact MMS
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
