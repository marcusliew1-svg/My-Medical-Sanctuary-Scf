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
    <section className="relative isolate overflow-hidden bg-[#15383a] px-5 pb-20 pt-36 text-ivory md:px-8 md:pb-28 md:pt-44">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_80%_26%,rgba(232,193,157,.18),transparent_30%),radial-gradient(circle_at_20%_78%,rgba(103,150,132,.15),transparent_36%)]" />
      <div className="absolute right-[10%] top-[22%] -z-10 h-[46%] w-px bg-gradient-to-b from-transparent via-[#e6bc97]/45 to-transparent" />
      <div className="absolute right-[18%] top-[14%] -z-10 h-[60%] w-[60%] rounded-[50%] border border-[#e6bc97]/10" />
      <div className="mx-auto flex min-h-[56vh] max-w-7xl items-end lg:items-center">
        <div className="max-w-4xl">
          <p className="text-[10px] font-bold uppercase tracking-[.28em] text-[#eac5a3]">{eyebrow}</p>
          <h1 className="mt-6 max-w-4xl text-balance font-serif text-5xl leading-[.99] md:text-7xl xl:text-[5.4rem]">{title}</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-ivory/68">{lead}</p>
          <div className="mt-9 flex flex-wrap gap-3"><ButtonLink href={primaryHref}>{primaryLabel}</ButtonLink><ButtonLink href="/contact" variant="light">Contact MMS</ButtonLink></div>
        </div>
      </div>
    </section>
  );
}
