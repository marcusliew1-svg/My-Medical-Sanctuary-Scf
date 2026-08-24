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
    <section className="relative isolate min-h-[88vh] overflow-hidden bg-[#15383a] text-ivory">
      <Image src={image} alt="" fill priority className="-z-30 object-cover object-center" sizes="100vw" />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(20,55,58,.97),rgba(20,55,58,.78)_48%,rgba(20,55,58,.16)),linear-gradient(0deg,rgba(20,55,58,.42),transparent_45%)]" />
      <div className="absolute -left-28 top-24 -z-10 size-[34rem] rounded-full bg-[#d6a782]/13 blur-[90px]" />
      <div className="mx-auto flex min-h-[88vh] max-w-7xl items-center px-5 pb-20 pt-36 md:px-8 md:pt-44">
        <div className="max-w-4xl">
          {eyebrow ? <p className="text-[10px] font-bold uppercase tracking-[.28em] text-[#e9c3a0]">{eyebrow}</p> : null}
          <h1 className="mt-5 text-balance font-serif text-6xl leading-[.98] md:text-8xl">{title}</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-ivory/72 md:text-xl">{subtitle}</p>
          <div className="mt-9 flex flex-wrap gap-3"><CTAButton href={primaryHref}>{primaryLabel}</CTAButton><CTAButton href={secondaryHref} variant="outline">{secondaryLabel}</CTAButton></div>
          <div className="mt-12 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/18 pt-5 text-[10px] font-semibold uppercase tracking-[.14em] text-ivory/60"><span>Physician guided</span><span>•</span><span>Private & personal</span><span>•</span><span>Suitability first</span></div>
        </div>
      </div>
    </section>
  );
}
