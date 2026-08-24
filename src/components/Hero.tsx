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
    <section className="relative isolate min-h-[84vh] overflow-hidden bg-[#102f36] px-4 pb-12 pt-32 text-ivory md:pt-40">
      <Image src={image} alt="" fill priority className="-z-30 object-cover object-[66%_center] opacity-72" sizes="100vw" />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(10,31,38,.98)_0%,rgba(10,31,38,.91)_42%,rgba(10,31,38,.52)_70%,rgba(10,31,38,.18)_100%),linear-gradient(0deg,rgba(10,31,38,.72),transparent_50%)]" />
      <div className="absolute -right-24 top-28 -z-10 size-[34rem] rounded-full border border-[#e4bd97]/14" />
      <div className="absolute right-20 top-48 -z-10 size-[22rem] rounded-full border border-[#e4bd97]/14" />
      <div className="absolute bottom-0 left-0 right-0 -z-10 h-36 bg-gradient-to-t from-[#102f36] to-transparent" />

      <div className="mx-auto grid min-h-[70vh] max-w-7xl items-center gap-12 lg:grid-cols-[1fr_.8fr]">
        <div className="max-w-3xl py-8">
          {eyebrow ? (
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-[#e4bd97]/20 bg-white/[.055] px-4 py-2 backdrop-blur-xl">
              <span className="size-1.5 rounded-full bg-[#e4bd97]" />
              <p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#edcaa7]">{eyebrow}</p>
            </div>
          ) : null}
          <h1 className="text-balance font-serif text-5xl leading-[1.01] text-ivory md:text-7xl xl:text-[5rem]">{title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ivory/68 md:text-xl">{subtitle}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <CTAButton href={primaryHref}>{primaryLabel}</CTAButton>
            <CTAButton href={secondaryHref} variant="outline">{secondaryLabel}</CTAButton>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/10 pt-5 text-[10px] font-bold uppercase tracking-[.14em] text-ivory/48">
            <span>Physician guided</span><span>•</span><span>Private</span><span>•</span><span>Suitability first</span>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="relative ml-auto aspect-[4/5] w-[88%] overflow-hidden rounded-[2.5rem] border border-white/14 bg-white/5 shadow-[0_38px_110px_rgba(0,0,0,.34)]">
            <Image src={image} alt="" fill className="object-cover object-center" sizes="40vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#102f36]/88 via-transparent to-transparent" />
            <div className="absolute inset-x-5 bottom-5 rounded-[1.4rem] border border-white/12 bg-[#102f36]/76 p-5 backdrop-blur-xl">
              <p className="text-[9px] font-bold uppercase tracking-[.2em] text-[#e3b992]">The MMS approach</p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px] font-semibold text-ivory/68">
                <span className="rounded-xl bg-white/[.06] px-2 py-3">Understand</span>
                <span className="rounded-xl bg-white/[.06] px-2 py-3">Personalise</span>
                <span className="rounded-xl bg-white/[.06] px-2 py-3">Continue</span>
              </div>
            </div>
          </div>
          <div className="absolute -left-8 top-16 rounded-2xl border border-[#dcb48c]/30 bg-[#f5eadf]/95 px-5 py-4 text-navy shadow-2xl backdrop-blur-xl">
            <p className="text-[9px] font-bold uppercase tracking-[.18em] text-terracotta">Health first</p>
            <p className="mt-1 font-serif text-xl">Not a treatment menu.</p>
          </div>
          <div className="absolute -right-4 top-36 rounded-2xl border border-white/12 bg-[#173d43]/95 px-5 py-4 shadow-2xl backdrop-blur-xl">
            <p className="text-[9px] font-bold uppercase tracking-[.18em] text-[#e0b58c]">Medical boundary</p>
            <p className="mt-1 max-w-[170px] text-xs font-semibold leading-5 text-ivory/78">Clinical decisions remain human.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
