import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CTAButton } from "@/components/CTAButton";
import { CorporateCTA } from "@/components/CorporateCTA";
import { EcosystemVisual } from "@/components/EcosystemVisual";
import { HomeHeroVisual } from "@/components/HomeHeroVisual";
import { JourneyVisual } from "@/components/JourneyVisual";
import { MMSStoryGrid } from "@/components/MMSStoryGrid";
import { ServiceExplorer } from "@/components/ServiceExplorer";
import { memberships } from "@/data/memberships";

export const metadata: Metadata = {
  title: "Preventive Care • Personalised Longevity",
  description:
    "A private preventive-health and longevity journey coordinated across Malaysia and Thailand with Ling and qualified doctors.",
};

const membershipStyles = [
  "from-deep-green to-navy",
  "from-sage to-deep-green",
  "from-charcoal to-navy",
  "from-terracotta to-navy",
];

export default function HomePage() {
  return (
    <main>
      <HomeHeroVisual />
      <MMSStoryGrid />

      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-deep-green">The MMS ecosystem</p>
              <h2 className="mt-3 max-w-3xl font-serif text-4xl leading-tight text-navy md:text-6xl">Everything revolves around one person: you.</h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-warm-gray">Intelligence, human coordination, doctors and future science — connected instead of scattered.</p>
          </div>
          <EcosystemVisual />
        </div>
      </section>

      <section className="bg-warm-white px-4 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 grid gap-6 md:grid-cols-[.75fr_1.25fr] md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-deep-green">Explore pathways</p>
              <h2 className="mt-3 font-serif text-4xl text-navy md:text-5xl">What can MMS coordinate?</h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-warm-gray">Explore the different areas visually. Ling can help explain what may be relevant, while qualified doctors decide what is medically appropriate.</p>
          </div>
          <ServiceExplorer />
        </div>
      </section>

      <section className="overflow-hidden bg-navy px-4 py-20 text-ivory md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 grid gap-6 md:grid-cols-[1fr_.7fr] md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-gold-light">Memberships</p>
              <h2 className="mt-3 max-w-3xl font-serif text-4xl leading-tight md:text-6xl">Different depths. The same philosophy of continuity.</h2>
            </div>
            <p className="text-sm leading-7 text-ivory/65">Ascend, Evolve, Eterna and Pinnacle are designed around different levels of access, depth and coordination.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {memberships.map((membership, index) => (
              <Link
                key={membership.name}
                href="/memberships"
                className={`group relative min-h-[330px] overflow-hidden rounded-[1.75rem] bg-gradient-to-br ${membershipStyles[index]} p-6 shadow-xl transition duration-500 hover:-translate-y-2`}
              >
                <div className="absolute -right-12 -top-12 size-40 rounded-full border border-white/10" />
                <div className="absolute -right-4 -top-4 size-24 rounded-full border border-white/10" />
                <p className="text-[10px] font-bold uppercase tracking-[.18em] text-gold-light">Level {index + 1}</p>
                <h3 className="mt-5 font-serif text-4xl">{membership.name}</h3>
                <p className="mt-3 text-sm font-semibold text-ivory/88">{membership.tagline}</p>
                <div className="absolute inset-x-6 bottom-6">
                  <p className="text-sm leading-6 text-ivory/62">{membership.accessNote}</p>
                  <div className="mt-5 flex items-center justify-between border-t border-white/12 pt-4 text-xs font-bold uppercase tracking-[.14em] text-gold-light"><span>Explore</span><span className="transition group-hover:translate-x-1">→</span></div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8"><CTAButton href="/memberships" variant="outline">Compare memberships</CTAButton></div>
        </div>
      </section>

      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-deep-green">Your journey</p>
            <h2 className="mt-3 font-serif text-4xl text-navy md:text-6xl">Five stages. One connected story.</h2>
          </div>
          <JourneyVisual />
        </div>
      </section>

      <section className="bg-warm-white px-4 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-deep-green">MMS + SCF</p>
            <h2 className="mt-3 max-w-4xl font-serif text-4xl leading-tight text-navy md:text-6xl">Care for today. Capability for tomorrow.</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Link href="/medicine-intelligence" className="group relative min-h-[410px] overflow-hidden rounded-[2rem] bg-navy shadow-premium">
              <Image src="/mms-medicine-intelligence.webp" alt="Medicine intelligence" fill className="object-cover opacity-60 transition duration-700 group-hover:scale-105" sizes="50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/55 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 text-ivory">
                <p className="text-xs font-bold uppercase tracking-[.18em] text-gold-light">Medicine Intelligence</p>
                <h3 className="mt-3 max-w-xl font-serif text-4xl">Understand the same medicine across different markets.</h3>
                <p className="mt-4 text-sm text-ivory/65">Malaysia · Thailand · global comparison</p>
              </div>
            </Link>

            <Link href="/scf-lab-roadmap" className="group relative min-h-[410px] overflow-hidden rounded-[2rem] bg-deep-green p-8 text-ivory shadow-premium">
              <div className="absolute -right-28 top-10 size-80 rounded-full border border-gold-light/14" />
              <div className="absolute -right-10 top-28 size-56 rounded-full border border-gold-light/14" />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-center justify-between gap-6">
                  <div><p className="text-xs font-bold uppercase tracking-[.18em] text-gold-light">SCF capability</p><h3 className="mt-3 max-w-lg font-serif text-4xl">Longevity pathways with a future-science roadmap.</h3></div>
                  <div className="relative h-20 w-32 shrink-0"><Image src="/scf-logo-new.png" alt="SCF" fill className="object-contain" sizes="128px" /></div>
                </div>
                <div className="mt-10 grid grid-cols-4 gap-2 text-center text-xs font-semibold text-ivory/72">
                  {['Discover','Review','Plan','Evolve'].map((step) => <span key={step} className="rounded-xl border border-white/12 bg-white/5 px-2 py-4">{step}</span>)}
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 grid gap-6 md:grid-cols-[.75fr_1.25fr] md:items-end">
            <div><p className="text-xs font-bold uppercase tracking-[.2em] text-deep-green">Access MMS</p><h2 className="mt-3 font-serif text-4xl text-navy md:text-5xl">Clinic. Online. Across borders.</h2></div>
            <p className="max-w-2xl text-base leading-7 text-warm-gray">Different entry points, one coordinated relationship.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            <Link href="/clinics" className="group overflow-hidden rounded-[1.75rem] bg-white shadow-soft"><div className="relative h-64"><Image src="/mms-health-screening-hero.png" alt="MMS clinic" fill className="object-cover transition duration-700 group-hover:scale-105" /></div><div className="p-6"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-deep-green">Clinic network</p><h3 className="mt-2 font-serif text-3xl text-navy">Visit MMS.</h3></div></Link>
            <Link href="/online-doctor" className="group relative overflow-hidden rounded-[1.75rem] bg-deep-green p-7 text-ivory shadow-soft"><div className="absolute -right-16 -top-16 size-52 rounded-full border border-white/10"/><span className="grid size-14 place-items-center rounded-full border border-gold-light/35 text-2xl text-gold-light">◉</span><p className="mt-20 text-[10px] font-bold uppercase tracking-[.18em] text-gold-light">Online doctor</p><h3 className="mt-2 font-serif text-3xl">Consult from anywhere.</h3><p className="mt-3 text-sm text-ivory/65">Ling prepares. A qualified doctor leads.</p></Link>
            <Link href="/medical-tourism" className="group overflow-hidden rounded-[1.75rem] bg-white shadow-soft"><div className="relative h-64"><Image src="/mms-membership-journey.webp" alt="Malaysia and Thailand coordinated care" fill className="object-cover transition duration-700 group-hover:scale-105" /></div><div className="p-6"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-deep-green">Cross-border care</p><h3 className="mt-2 font-serif text-3xl text-navy">Malaysia ↔ Thailand.</h3></div></Link>
          </div>
        </div>
      </section>

      <CorporateCTA />

      <section className="relative overflow-hidden bg-navy px-4 py-24 text-ivory md:py-32">
        <div className="absolute left-1/2 top-1/2 size-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold-light/10" />
        <div className="absolute left-1/2 top-1/2 size-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold-light/10" />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-gold-light">Begin simply</p>
          <h2 className="mt-4 font-serif text-5xl md:text-7xl">Start with a conversation.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-ivory/65">Ask Ling, explore your goals and decide the next step only when you are ready.</p>
          <div className="mt-8 flex justify-center"><CTAButton href="/ling">Ask Ling</CTAButton></div>
        </div>
      </section>
    </main>
  );
}
