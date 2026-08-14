import Image from "next/image";
import Link from "next/link";

const signals = [
  { label: "Discover", value: "Screen" },
  { label: "Understand", value: "Review" },
  { label: "Personalise", value: "Plan" },
  { label: "Continue", value: "Track" },
];

export function HomeHeroVisual() {
  return (
    <section className="relative isolate overflow-hidden bg-navy px-4 pb-12 pt-32 text-ivory md:pb-16 md:pt-40">
      <Image
        src="/mms-health-screening-hero.png"
        alt=""
        fill
        priority
        className="-z-30 object-cover object-[68%_center] opacity-70"
        sizes="100vw"
      />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(9,25,38,.98)_0%,rgba(9,25,38,.92)_38%,rgba(9,25,38,.54)_72%,rgba(9,25,38,.68)_100%)]" />
      <div className="absolute -left-32 top-32 -z-10 size-[28rem] rounded-full bg-deep-green/25 blur-3xl" />
      <div className="absolute -right-20 bottom-0 -z-10 size-[24rem] rounded-full bg-terracotta/20 blur-3xl" />

      <div className="mx-auto grid min-h-[72vh] max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/8 px-4 py-2 backdrop-blur-md">
            <span className="size-2 rounded-full bg-gold-light" />
            <span className="text-[11px] font-bold uppercase tracking-[.2em] text-ivory/80">My Medical Sanctuary</span>
          </div>
          <h1 className="text-balance font-serif text-5xl leading-[1.02] md:text-7xl xl:text-[5.4rem]">
            Live better.
            <span className="block text-gold-light">Live longer.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ivory/76 md:text-xl">
            Preventive health, personalised longevity and intelligent coordination — brought together in one private health journey.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/ling" className="rounded-full bg-gold-light px-6 py-3 text-sm font-bold text-navy transition hover:-translate-y-0.5 hover:shadow-xl">Start with Ling</Link>
            <Link href="/how-it-works" className="rounded-full border border-white/25 bg-white/8 px-6 py-3 text-sm font-bold text-ivory backdrop-blur-sm transition hover:bg-white/14">See the journey</Link>
          </div>

          <Link href="/ling" className="mt-8 flex items-center gap-4 rounded-2xl border border-white/12 bg-navy/55 p-3 backdrop-blur-md lg:hidden">
            <span className="relative size-16 shrink-0 overflow-hidden rounded-2xl border border-gold-light/25 bg-white/10">
              <Image src="/ling-mms-guide.png" alt="Ling, MMS intelligent health guide" fill className="object-cover object-[50%_18%]" sizes="64px" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] font-bold uppercase tracking-[.18em] text-gold-light">Meet Ling</span>
              <span className="mt-1 block font-serif text-xl text-ivory">Ask first. No registration required.</span>
              <span className="mt-1 block text-xs leading-5 text-ivory/60">Create an account only when you want a secure, remembered journey.</span>
            </span>
            <span className="text-gold-light">→</span>
          </Link>

          <div className="mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            {signals.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/12 bg-white/7 px-4 py-4 backdrop-blur-md">
                <p className="text-[10px] font-bold uppercase tracking-[.16em] text-gold-light">{item.label}</p>
                <p className="mt-1 font-serif text-xl text-ivory">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto hidden w-full max-w-xl lg:block">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.4rem] border border-white/15 bg-white/10 shadow-2xl backdrop-blur-xl">
            <Image src="/ling-mms-guide.png" alt="Ling, MMS intelligent health guide" fill className="object-cover object-[50%_20%]" sizes="40vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-transparent to-transparent" />
            <div className="absolute inset-x-5 bottom-5 rounded-[1.5rem] border border-white/12 bg-navy/74 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.18em] text-gold-light">Ling</p>
                  <h2 className="mt-1 font-serif text-2xl">Your intelligent health guide</h2>
                </div>
                <span className="grid size-11 shrink-0 place-items-center rounded-full border border-gold-light/40 text-gold-light">✦</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-ivory/74">
                <span className="rounded-full bg-white/8 px-3 py-1.5">Ask</span>
                <span className="rounded-full bg-white/8 px-3 py-1.5">Organise</span>
                <span className="rounded-full bg-white/8 px-3 py-1.5">Coordinate</span>
                <span className="rounded-full bg-white/8 px-3 py-1.5">Escalate to humans</span>
              </div>
            </div>
          </div>

          <div className="absolute -left-14 top-16 rounded-2xl border border-white/15 bg-white/12 p-4 shadow-xl backdrop-blur-xl">
            <p className="text-[10px] font-bold uppercase tracking-[.15em] text-gold-light">Malaysia ↔ Thailand</p>
            <p className="mt-1 font-serif text-xl">One journey</p>
          </div>
          <div className="absolute -right-8 top-36 rounded-2xl border border-white/15 bg-deep-green/85 p-4 shadow-xl backdrop-blur-xl">
            <p className="text-[10px] uppercase tracking-[.15em] text-gold-light">Doctor-led</p>
            <p className="mt-1 text-sm font-semibold">Clinical decisions stay human.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
