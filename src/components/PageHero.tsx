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
    <section className="bg-stone-950 px-4 pb-20 pt-36 text-white md:pt-44">
      <div className="mx-auto max-w-6xl">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-teal-200">
          {eyebrow}
        </p>
        <h1 className="max-w-5xl text-balance text-5xl font-semibold leading-tight md:text-7xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/[0.72]">{lead}</p>
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
