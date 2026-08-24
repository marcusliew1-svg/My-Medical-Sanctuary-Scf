import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { EcosystemVisual } from "@/components/EcosystemVisual";
import { ServiceExplorer } from "@/components/ServiceExplorer";
import { DisclaimerBox } from "@/components/DisclaimerBox";

export const metadata: Metadata = {
  title: "About MMS",
  description: "See how My Medical Sanctuary connects preventive care, Ling, coordination and professional review.",
};

export default function AboutMMSPage() {
  return (
    <main className="overflow-hidden bg-[#f7f1e8]">
      <Hero eyebrow="About MMS" title="Health should feel connected." subtitle="One relationship across discovery, coordination, professional review and long-term continuity." image="/mms-about-hero.png" primaryLabel="Start your journey" primaryHref="/ling" secondaryLabel="How MMS works" secondaryHref="/how-it-works" />

      <section className="bg-[#f8f3eb] px-4 py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.12fr_.88fr] lg:items-stretch">
          <div className="relative min-h-[620px] overflow-hidden rounded-[2.5rem] shadow-[0_35px_100px_rgba(45,44,40,.14)]">
            <Image src="/mms-service-collage.webp" alt="MMS preventive care and longevity experience" fill className="object-cover" sizes="(min-width:1024px) 56vw,100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#102f36]/92 via-transparent to-transparent" />
            <div className="absolute inset-x-7 bottom-7 text-ivory"><p className="text-[9px] font-bold uppercase tracking-[.2em] text-[#dfb78f]">Why MMS exists</p><h2 className="mt-3 max-w-3xl font-serif text-4xl leading-tight md:text-5xl">From disconnected appointments to one continuous health relationship.</h2></div>
          </div>
          <div className="grid gap-4">
            {[["01","Prevent"],["02","Personalise"],["03","Coordinate"],["04","Continue"]].map(([number,title],index)=><div key={number} className={`relative overflow-hidden rounded-[2rem] p-7 ${index===1?"bg-[#e3bd98] text-navy":"bg-[#173d43] text-ivory"}`}><span className={`text-[9px] font-bold ${index===1?"text-[#7c4f35]":"text-[#dfb78f]"}`}>{number}</span><h3 className="mt-10 font-serif text-4xl">{title}</h3><div className={`absolute -right-12 -top-12 size-40 rounded-full border ${index===1?"border-navy/10":"border-white/10"}`} /></div>)}
          </div>
        </div>
      </section>

      <section className="bg-[#eee4d7] px-4 py-24 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 grid gap-7 lg:grid-cols-[.7fr_1.3fr] lg:items-end"><div><p className="text-[10px] font-bold uppercase tracking-[.24em] text-terracotta">What MMS can coordinate</p><h2 className="mt-4 font-serif text-5xl leading-tight text-navy md:text-6xl">Different needs.<br/>One organised pathway.</h2></div><p className="max-w-lg text-base leading-8 text-warm-gray lg:justify-self-end">Explore by health goal. Suitability stays with qualified professionals.</p></div>
          <ServiceExplorer />
        </div>
      </section>

      <section className="bg-[#102f36] px-4 py-24 text-ivory md:py-32">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.62fr_1.38fr] lg:items-center">
          <div><p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#dfb78f]">The operating model</p><h2 className="mt-4 font-serif text-5xl leading-tight md:text-6xl">Clear roles.<br/><span className="text-[#e5c19f]">Clear trust.</span></h2><p className="mt-5 max-w-lg text-base leading-8 text-ivory/58">Technology helps organise. MMS coordinates. Qualified professionals retain clinical authority.</p></div>
          <EcosystemVisual />
        </div>
      </section>

      <section className="bg-[#f8f3eb] px-4 py-24 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              ["/medicine-intelligence","/mms-medicine-intelligence.webp","Intelligence","See more clearly"],
              ["/medical-tourism","/mms-membership-journey.webp","Regional care","Stay connected across borders"],
              ["/scf-lab-roadmap","/mms-about-hero.png","Future science","Capability for tomorrow"],
            ].map(([href,image,eyebrow,title])=><Link key={href} href={href} className="group overflow-hidden rounded-[2rem] border border-[#d5c3b2] bg-white shadow-[0_24px_70px_rgba(40,43,41,.08)]"><div className="relative h-72 overflow-hidden"><Image src={image} alt="" fill className="object-cover transition duration-1000 group-hover:scale-[1.04]" sizes="(min-width:768px) 33vw,100vw"/><div className="absolute inset-0 bg-gradient-to-t from-[#102f36]/78 via-transparent to-transparent"/><div className="absolute bottom-5 left-5 text-ivory"><p className="text-[9px] font-bold uppercase tracking-[.18em] text-[#dfb78f]">{eyebrow}</p><h3 className="mt-2 font-serif text-3xl">{title}</h3></div></div></Link>)}
          </div>
          <div className="mt-8"><DisclaimerBox title="Future capability"><p>Future clinical and lab capability remains subject to regulatory, licensing, funding, technical and professional requirements.</p></DisclaimerBox></div>
        </div>
      </section>
    </main>
  );
}
