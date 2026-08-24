import Image from "next/image";
import { ButtonLink } from "@/components/ButtonLink";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  lead: string;
  primaryHref?: string;
  primaryLabel?: string;
  image?: string;
};

export function PageHero({
  eyebrow,
  title,
  lead,
  primaryHref = "/book-appointment",
  primaryLabel = "Book Appointment",
  image = "/mms-doctor-couple-consult.png",
}: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-navy px-4 pb-20 pt-36 text-ivory md:pt-44">
      <Image src={image} alt="" fill priority className="-z-20 object-cover object-[62%_center] opacity-70 motion-safe:animate-[slowZoom_18s_ease-out_forwards]" sizes="100vw" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(7,21,29,0.96),rgba(7,21,29,0.72)_54%,rgba(7,21,29,0.32)),linear-gradient(0deg,rgba(7,21,29,0.86),transparent_58%)]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-light/70 to-transparent" />
      <div className="mx-auto max-w-6xl">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-gold-light">
          {eyebrow}
        </p>
        <h1 className="max-w-5xl text-balance font-serif text-5xl leading-tight md:text-7xl">
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
