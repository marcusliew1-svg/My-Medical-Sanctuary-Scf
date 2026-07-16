import Image from "next/image";
import { CTAButton } from "@/components/CTAButton";

type HeroProps = {
  eyebrow?: string;
  title: string;
  subtitle: string;
  image?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export function Hero({
  eyebrow,
  title,
  subtitle,
  image = "/mms-health-screening-hero.png",
  primaryLabel = "Start With Discovery",
  primaryHref = "/contact",
  secondaryLabel = "Explore Memberships",
  secondaryHref = "/memberships",
}: HeroProps) {
  return (
    <section className="relative isolate min-h-[88vh] overflow-hidden bg-navy px-4 pt-32 text-ivory md:pt-40">
      <Image src={image} alt="" fill priority className="-z-20 object-cover object-[62%_center]" sizes="100vw" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(11,26,46,0.96),rgba(11,26,46,0.74)_48%,rgba(11,26,46,0.30)),linear-gradient(0deg,rgba(11,26,46,0.80),transparent_55%)]" />
      <div className="mx-auto flex min-h-[calc(88vh-8rem)] max-w-6xl items-end pb-16">
        <div className="max-w-4xl">
          {eyebrow ? (
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-gold-light">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="font-serif text-5xl leading-[0.98] md:text-7xl">{title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ivory/80">{subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <CTAButton href={primaryHref}>{primaryLabel}</CTAButton>
            <CTAButton href={secondaryHref} variant="outline">
              {secondaryLabel}
            </CTAButton>
          </div>
        </div>
      </div>
    </section>
  );
}
