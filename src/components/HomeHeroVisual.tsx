import Image from "next/image";
import Link from "next/link";

export function HomeHeroVisual() {
  return (
    <section className="relative isolate overflow-hidden bg-[#102f36] px-4 pb-14 pt-32 text-ivory md:pb-20 md:pt-40">
      <Image
        src="/mms-health-screening-hero.png"
        alt=""
        fill
        priority
        className="-z-30 object-cover object-[67%_center] opacity-78"
        sizes="100vw"
      />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(11,34,40,.98)_0%,rgba(11,34,40,.95)_38%,rgba(11,34,40,.66)_63%,rgba(11,34,40,.2)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-[#102f36] to-transparent" />
      <div className="absolute -left-32 top-24 -z-10 size-[32rem] rounded-full bg-[#805d45]/20 blur-3xl" />

      <div className="mx-auto grid min-h-[76vh] max-w-7xl items-center gap-12 lg:grid-cols-[1.08fr_.92fr]">
        <div className="max-w-3xl py-8">
          <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-[#e3bea0]/25 bg-[#f5e5d4]/8 px-4 py-2 backdrop-blur-lg">
            <span className="size-1.5 rounded-full bg-[#e4bd99]" />
            <span className="text-[10px] font-bold uppercase tracking-[.24em] text-[#f0d6bd]">My Medical Sanctuary</span>
          </div>

          <h1 className="text-balance font-serif text-5xl leading-[.98] md:text-7xl xl:text-[5.6rem]">
            Preventive care.
            <span className="mt-1 block text-[#e7c3a2]">Personalised longevity.</span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-ivory/74 md:text-xl">
            Physician-guided preventive care, advanced health discovery and personalised wellness coordination for people who want to understand their health more deeply — and care for it for the years ahead.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/book-appointment"
              className="rounded-full bg-[#e3b98f] px-6 py-3.5 text-sm font-bold text-[#102f36] shadow-[0_14px_40px_rgba(226,185,143,.18)] transition hover:-translate-y-0.5 hover:bg-[#edcaa8]"
            >
              Book a consultation
            </Link>
            <Link
              href="/about-mms"
              className="rounded-full border border-white/22 bg-white/[.055] px-6 py-3.5 text-sm font-bold text-ivory backdrop-blur-md transition hover:bg-white/[.11]"
            >
              Explore MMS
            </Link>
          </div>

          <div className="mt-12 flex max-w-2xl flex-wrap gap-x-7 gap-y-4 border-t border-white/12 pt-6 text-[11px] font-semibold uppercase tracking-[.12em] text-ivory/58">
            <span>Physician guided</span>
            <span className="hidden text-[#dfb68e]/35 sm:inline">•</span>
            <span>Preventive focus</span>
            <span className="hidden text-[#dfb68e]/35 sm:inline">•</span>
            <span>Private care</span>
            <span className="hidden text-[#dfb68e]/35 sm:inline">•</span>
            <span>Malaysia + Thailand</span>
          </div>
        </div>

        <div className="relative mx-auto hidden w-full max-w-lg lg:block">
          <div className="relative aspect-[4/5] translate-y-8 overflow-hidden rounded-[2.5rem] border border-[#ebccb0]/18 bg-white/8 shadow-[0_40px_110px_rgba(0,0,0,.34)] backdrop-blur-sm">
            <Image
              src="/mms-about-hero.png"
              alt="A warm, private MMS health consultation"
              fill
              className="object-cover object-center"
              sizes="42vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#102f36]/82 via-transparent to-transparent" />
            <div className="absolute inset-x-6 bottom-6 rounded-[1.4rem] border border-white/14 bg-[#102f36]/72 p-5 backdrop-blur-xl">
              <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#e4bd98]">A more considered health journey</p>
              <p className="mt-2 font-serif text-2xl text-ivory">Understand first. Personalise carefully. Continue with confidence.</p>
            </div>
          </div>

          <div className="absolute -left-16 top-20 max-w-[210px] rounded-2xl border border-white/14 bg-[#f6eee4]/94 p-4 text-navy shadow-2xl backdrop-blur-xl">
            <p className="text-[9px] font-bold uppercase tracking-[.18em] text-terracotta">Health discovery</p>
            <p className="mt-1 font-serif text-xl">Start with the whole picture.</p>
          </div>

          <div className="absolute -right-9 top-44 max-w-[215px] rounded-2xl border border-[#e0b78e]/25 bg-[#173e43]/94 p-4 shadow-2xl backdrop-blur-xl">
            <p className="text-[9px] font-bold uppercase tracking-[.18em] text-[#e2b991]">Medical boundary</p>
            <p className="mt-1 text-sm font-semibold leading-5 text-ivory">Clinical decisions stay with qualified professionals.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
