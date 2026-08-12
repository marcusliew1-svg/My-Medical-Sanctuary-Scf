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
    <section className="relative isolate min-h-[86vh] overflow-hidden bg-navy px-4 pt-32 text-ivory md:pt-40">
      <Image src={image} alt="" fill priority className="-z-20 object-cover object-[64%_center]" sizes="100vw" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(11,26,46,0.98),rgba(11,26,46,0.80)_48%,rgba(11,26,46,0.36)),linear-gradient(0deg,rgba(11,26,46,0.86),rgba(11,26,46,0.08)_58%)]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-light/70 to-transparent" />
      <div className="mx-auto flex min-h-[calc(86vh-8rem)] max-w-6xl items-center pb-12 pt-10">
        <div className="max-w-3xl">
          {eyebrow ? (
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-gold-light">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-balance font-serif text-5xl leading-[1.04] text-ivory md:text-7xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ivory/78 md:text-xl">{subtitle}</p>
          <div className="mt-9 flex flex-wrap gap-3">
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
