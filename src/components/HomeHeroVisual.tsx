import Image from "next/image";
import Link from "next/link";

export function HomeHeroVisual() {
  return (
    <section className="relative isolate min-h-[94vh] overflow-hidden bg-[#15373a] text-ivory">
      <Image
        src="/mms-about-hero.png"
        alt="A warm, private MMS health consultation"
        fill
        priority
        className="-z-30 object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(18,48,50,.94)_0%,rgba(18,48,50,.77)_38%,rgba(18,48,50,.28)_68%,rgba(18,48,50,.08)_100%)]" />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(0deg,rgba(17,44,46,.72)_0%,transparent_42%)]" />
      <div className="absolute -left-28 top-24 -z-10 size-[34rem] rounded-full bg-[#d6a782]/15 blur-[90px]" />
      <div className="absolute bottom-0 left-0 right-0 h-28 -z-10 bg-gradient-to-t from-[#f6efe6] to-transparent" />

      <div className="mx-auto flex min-h-[94vh] max-w-7xl items-end px-5 pb-20 pt-36 md:px-8 md:pb-28 lg:items-center lg:pb-20">
        <div className="max-w-[780px]">
          <p className="text-[10px] font-bold uppercase tracking-[.28em] text-[#f0d2b4]">My Medical Sanctuary</p>
          <h1 className="mt-5 text-balance font-serif text-[3.45rem] leading-[.96] md:text-[5.6rem] xl:text-[6.4rem]">
            Your health deserves
            <span className="block text-[#edc9a8]">a longer view.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-ivory/78 md:text-xl">
            Preventive care. Personalised longevity. Physician-guided.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/health-discovery" className="rounded-full bg-[#e4ba93] px-6 py-3.5 text-sm font-bold text-[#15373a] shadow-[0_16px_44px_rgba(209,164,123,.2)] transition hover:-translate-y-0.5 hover:bg-[#efccb0]">
              Begin your health journey
            </Link>
            <Link href="/how-it-works" className="rounded-full border border-white/30 bg-white/[.06] px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/[.12]">
              Understand how MMS works
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/18 pt-5 text-[10px] font-semibold uppercase tracking-[.15em] text-ivory/62">
            <span>Medical judgement first</span><span>•</span><span>Private & personal</span><span>•</span><span>Continuity over transactions</span>
          </div>
        </div>
      </div>
    </section>
  );
}
