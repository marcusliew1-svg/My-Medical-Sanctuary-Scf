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
  image = "/mms-doctor-couple-consult.png",
  primaryLabel = "Start With Discovery",
  primaryHref = "/contact",
  secondaryLabel = "Explore Memberships",
  secondaryHref = "/memberships",
}: HeroProps) {
  return (
    <section className="relative isolate min-h-[82vh] overflow-hidden bg-[#07151d] px-4 pt-32 text-ivory md:pt-40">
      <Image src={image} alt="" fill priority className="-z-20 object-cover object-[64%_center] motion-safe:animate-[slowZoom_18s_ease-out_forwards]" sizes="100vw" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(7,21,29,0.97),rgba(7,21,29,0.76)_48%,rgba(7,21,29,0.26)),linear-gradient(0deg,rgba(7,21,29,0.88),rgba(7,21,29,0.08)_58%)]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-light/70 to-transparent" />
      <div className="mx-auto flex min-h-[calc(82vh-8rem)] max-w-6xl items-end pb-16 pt-10">
        <div className="max-w-3xl">
          {eyebrow ? (
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-gold-light">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-balance font-serif text-5xl leading-[0.98] text-ivory md:text-7xl">
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
