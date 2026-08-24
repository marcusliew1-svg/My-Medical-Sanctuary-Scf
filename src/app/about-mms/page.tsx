import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { DisclaimerBox } from "@/components/DisclaimerBox";

export const metadata: Metadata = {
  title: "About MMS",
  description: "See how My Medical Sanctuary connects preventive care, Ling, coordination and professional review.",
};

const principles = [["01", "Prevent", "Look earlier, not only when something goes wrong."],["02", "Personalise", "Use context and professional judgement rather than a generic protocol."],["03", "Coordinate", "Make the journey easier to understand and navigate."],["04", "Continue", "Build a relationship that can evolve with your health."]];

export default function AboutMMSPage() {
  return (
    <main className="overflow-hidden bg-[#f7f1e8]">
      <Hero eyebrow="About MMS" title="Health should feel connected." subtitle="One relationship across discovery, coordination, professional review and long-term continuity." image="/mms-about-hero.png" primaryLabel="Start your journey" primaryHref="/health-discovery" secondaryLabel="How MMS works" secondaryHref="/how-it-works" />

      <section className="bg-[#f7f1e8] px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.12fr_.88fr] lg:items-center">
          <div className="relative min-h-[680px] overflow-hidden rounded-[46%_54%_48%_52%/43%_44%_56%_57%]">
            <Image src="/mms-service-collage.webp" alt="MMS preventive care and longevity experience" fill className="object-cover" sizes="(min-width:1024px) 56vw,100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#15383a]/38 to-transparent" />
          </div>
          <div className="lg:pl-8"><p className="text-[10px] font-bold uppercase tracking-[.26em] text-terracotta">Why MMS exists</p><h2 className="mt-5 font-serif text-5xl leading-[1.02] text-navy md:text-7xl">From disconnected appointments to one continuous health relationship.</h2><p className="mt-7 max-w-xl text-lg leading-8 text-warm-gray">The aim is not to sell more interventions. It is to help people understand their health earlier, navigate choices more clearly and stay connected to appropriate professional care.</p></div>
        </div>
      </section>

      <section className="bg-[#eadccc] px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-9 lg:grid-cols-[.78fr_1.22fr] lg:items-end"><div><p className="text-[10px] font-bold uppercase tracking-[.26em] text-terracotta">Our principles</p><h2 className="mt-5 font-serif text-5xl leading-[1.02] text-navy md:text-7xl">A quieter, more considered approach to health.</h2></div><p className="max-w-xl text-lg leading-8 text-warm-gray lg:justify-self-end">These principles shape the patient experience across screening, wellness, longevity, regional care and ongoing coordination.</p></div>
          <div className="mt-16 divide-y divide-[#c6b19d] border-y border-[#c6b19d]">{principles.map(([number,title,text])=><div key={number} className="grid gap-5 py-8 md:grid-cols-[70px_.7fr_1.3fr] md:items-center"><span className="text-[10px] font-bold tracking-[.18em] text-terracotta">{number}</span><h3 className="font-serif text-3xl text-navy md:text-4xl">{title}</h3><p className="max-w-xl text-sm leading-7 text-warm-gray">{text}</p></div>)}</div>
        </div>
      </section>

      <section className="relative min-h-[720px] overflow-hidden bg-[#15383a] text-ivory">
        <Image src="/mms-health-screening-hero.png" alt="MMS medical trust" fill className="object-cover opacity-60" sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,55,58,.96),rgba(20,55,58,.68)_48%,rgba(20,55,58,.18))]" />
        <div className="relative mx-auto flex min-h-[720px] max-w-7xl items-center px-5 py-24 md:px-8">
          <div className="max-w-2xl"><p className="text-[10px] font-bold uppercase tracking-[.26em] text-[#e4ba93]">The operating model</p><h2 className="mt-5 font-serif text-5xl leading-[1.02] md:text-7xl">Technology organises.<br/><span className="text-[#e9c6a5]">People care.<br/>Doctors decide.</span></h2><p className="mt-7 max-w-xl text-lg leading-8 text-ivory/68">Ling can help you understand and prepare. MMS can coordinate the journey. Qualified professionals retain clinical authority.</p></div>
        </div>
      </section>

      <section className="bg-[#f7f1e8] px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl"><p className="text-[10px] font-bold uppercase tracking-[.26em] text-terracotta">Where the journey can go</p><h2 className="mt-5 font-serif text-5xl leading-[1.02] text-navy md:text-7xl">Understand locally. Stay connected regionally.</h2></div>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {[
              ["/insights","/mms-medicine-intelligence.webp","Health Intelligence","Learn before deciding"],
              ["/medical-tourism","/mms-membership-journey.webp","Regional care","Stay connected across borders"],
              ["/scf-lab-roadmap","/mms-about-hero.png","Future science","Capability for tomorrow"],
            ].map(([href,image,eyebrow,title])=><Link key={href} href={href} className="group"><div className="relative aspect-[4/5] overflow-hidden"><Image src={image} alt="" fill className="object-cover transition duration-1000 group-hover:scale-[1.03]" sizes="(min-width:768px) 33vw,100vw"/><div className="absolute inset-0 bg-gradient-to-t from-[#15383a]/65 via-transparent to-transparent"/></div><p className="mt-5 text-[9px] font-bold uppercase tracking-[.18em] text-terracotta">{eyebrow}</p><h3 className="mt-2 font-serif text-3xl text-navy">{title}</h3></Link>)}
          </div>
          <div className="mt-10"><DisclaimerBox title="Future capability"><p>Future clinical and lab capability remains subject to regulatory, licensing, funding, technical and professional requirements.</p></DisclaimerBox></div>
        </div>
      </section>
    </main>
  );
}
