import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CorporateCTA } from "@/components/CorporateCTA";
import { CTAButton } from "@/components/CTAButton";
import { Hero } from "@/components/Hero";
import { MembershipCard } from "@/components/MembershipCard";
import { SectionHeader } from "@/components/SectionHeader";
import { EcosystemVisual } from "@/components/EcosystemVisual";
import { JourneyVisual } from "@/components/JourneyVisual";
import { memberships } from "@/data/memberships";

export const metadata: Metadata = {
  title: "Preventive Care • Personalised Longevity",
  description:
    "Start your structured wellness journey with My Medical Sanctuary through discovery, HRM coordination and professional review.",
};

export default function HomePage() {
  return (
    <main>
      <Hero
        eyebrow="My Medical Sanctuary"
        title="Preventive Care. Personalised Longevity."
        subtitle="A private, intelligently coordinated health journey across Malaysia and Thailand—with every medical decision led by a qualified doctor."
        primaryLabel="Start with Ling"
        primaryHref="/register"
        secondaryLabel="See how MMS works"
        secondaryHref="/how-it-works"
      />

      <section className="bg-warm-white px-4 py-20">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-gold-light/45 bg-white shadow-premium md:grid-cols-[0.82fr_1.18fr]">
          <div className="relative min-h-[420px] bg-ivory md:min-h-[560px]">
            <Image src="/ling-mms-guide.png" alt="Ling, MMS intelligent health guide" fill priority className="object-cover object-[50%_22%]" sizes="(min-width: 768px) 42vw, 100vw" />
          </div>
          <div className="flex flex-col justify-center p-8 md:p-14">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Meet Ling</p>
            <h2 className="mt-4 text-balance font-serif text-4xl leading-tight text-navy md:text-5xl">Your intelligent guide through every stage of the MMS journey.</h2>
            <p className="mt-6 text-lg leading-8 text-warm-gray">Ask general questions without registering. When you want Ling to remember your preferences, organise records or support care coordination, create a secure patient account.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CTAButton href="/ling">Chat with Ling</CTAButton>
              <CTAButton href="/login" variant="outline">Patient login</CTAButton>
            </div>
            <p className="mt-6 border-l-2 border-gold-light pl-4 text-sm leading-6 text-warm-gray">Ling may develop potential options internally. Medical recommendations reach patients only after review and approval by a qualified doctor.</p>
          </div>
        </div>
      </section>

      <section className="bg-warm-white px-4 py-20"><div className="mx-auto max-w-6xl"><SectionHeader eyebrow="The MMS Ecosystem" title="Everything connected around you." description="Intelligence, coordination, clinical authority and future science." /><EcosystemVisual /></div></section>

      <section className="bg-warm-white px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeader eyebrow="Memberships" title="Four levels of continuity." description="No public pricing. Choose by need, depth and coordination." />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {memberships.map((membership) => (
              <MembershipCard key={membership.name} membership={membership} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ivory px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="How It Works"
            title="Five stages. One continuous journey."
            description="See who supports you at every step."
          />
          <JourneyVisual />
        </div>
      </section>

      <section className="bg-ivory px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeader eyebrow="Platform Strategy" title="Care today. Capability tomorrow." description="Two strategic engines extend the MMS patient relationship." />
          <div className="grid gap-5 md:grid-cols-2">
            <Link href="/medicine-intelligence" className="rounded-[1.5rem] border border-gold-light/40 bg-white p-8 shadow-soft transition hover:-translate-y-1"><p className="text-xs font-bold uppercase tracking-[.16em] text-gold">Medicine Intelligence</p><h3 className="mt-3 font-serif text-3xl text-navy">Compare markets responsibly.</h3><p className="mt-3 text-warm-gray">Like-for-like intelligence with licensed professional clearance.</p></Link>
            <Link href="/scf-lab-roadmap" className="rounded-[1.5rem] border border-gold-light/40 bg-deep-green p-8 text-ivory shadow-soft transition hover:-translate-y-1"><p className="text-xs font-bold uppercase tracking-[.16em] text-gold-light">SCF</p><h3 className="mt-3 font-serif text-3xl">Build future capability.</h3><p className="mt-3 text-ivory/70">The science and laboratory roadmap behind tomorrow’s MMS.</p></Link>
          </div>
        </div>
      </section>

      <CorporateCTA />

      <section className="bg-navy px-4 py-20 text-ivory">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-gold-light">Final CTA</p>
          <h2 className="font-serif text-4xl md:text-6xl">Start With Discovery</h2>
          <p className="mt-5 text-lg leading-8 text-ivory/72">
            Begin with a calm discovery discussion before choosing a membership or wellness pathway.
          </p>
        </div>
      </section>
    </main>
  );
}
