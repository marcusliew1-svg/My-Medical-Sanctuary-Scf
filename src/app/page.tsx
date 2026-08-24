import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CTAButton } from "@/components/CTAButton";
import { HomeHeroVisual } from "@/components/HomeHeroVisual";
import { ServiceExplorer } from "@/components/ServiceExplorer";
import { JourneyVisual } from "@/components/JourneyVisual";
import { memberships } from "@/data/memberships";

export const metadata: Metadata = {
  title: "Preventive Care • Personalised Longevity",
  description: "A private, physician-guided preventive health and personalised longevity journey across Malaysia and Thailand.",
};

export default function HomePage() {
  return (
    <main className="overflow-hidden bg-[#f4efe7]">
      <HomeHeroVisual />

      <section className="border-y border-[#d9cdbf]/70 bg-[#efe7dc] px-4 py-6">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden rounded-[1.5rem] border border-[#d4c3b3] bg-[#d4c3b3] lg:grid-cols-4">
          {["Physician guided","Preventive focus","Personalised","Malaysia + Thailand"].map((item,index)=><div key={item} className="bg-[#f5ede4] px-5 py-5 text-center"><span className="text-[9px] font-bold text-terracotta">0{index+1}</span><p className="mt-2 font-serif text-xl text-navy">{item}</p></div>)}
        </div>
      </section>

      <section className="bg-[#f8f3eb] px-4 py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.82fr_1.18fr] lg:items-center">
          <div><p className="text-[10px] font-bold uppercase tracking-[.24em] text-terracotta">The MMS idea</p><h2 className="mt-4 font-serif text-5xl leading-[1.02] text-navy md:text-7xl">Understand.<br/>Personalise.<br/><span className="text-[#b7795e]">Continue.</span></h2><div className="mt-8 flex flex-wrap gap-3"><CTAButton href="/about-mms">Discover MMS</CTAButton><CTAButton href="/how-it-works" variant="outline">See the journey</CTAButton></div></div>
          <div className="relative min-h-[620px] overflow-hidden rounded-[2.5rem] shadow-[0_35px_100px_rgba(45,44,40,.14)]"><Image src="/mms-about-hero.png" alt="Private MMS health consultation" fill className="object-cover" sizes="(min-width:1024px) 58vw,100vw"/><div className="absolute inset-0 bg-gradient-to-t from-[#102f36]/90 via-transparent to-transparent"/><div className="absolute inset-x-7 bottom-7 grid gap-3 sm:grid-cols-3">{["Discover","Review","Evolve"].map((item,index)=><div key={item} className="rounded-2xl border border-white/12 bg-[#102f36]/72 p-4 text-center text-ivory backdrop-blur-xl"><span className="text-[9px] font-bold text-[#dfb78f]">0{index+1}</span><p className="mt-2 font-serif text-xl">{item}</p></div>)}</div></div>
        </div>
      </section>

      <section className="bg-[#efe4d7] px-4 py-24 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 grid gap-7 lg:grid-cols-[.7fr_1.3fr] lg:items-end"><div><p className="text-[10px] font-bold uppercase tracking-[.24em] text-terracotta">Explore by goal</p><h2 className="mt-4 font-serif text-5xl leading-tight text-navy md:text-6xl">Start with the health question.</h2></div><p className="max-w-lg text-base leading-8 text-warm-gray lg:justify-self-end">Browse. Learn. Then let a qualified professional decide what is appropriate.</p></div>
          <ServiceExplorer />
        </div>
      </section>

      <section className="relative min-h-[660px] overflow-hidden bg-[#102f36]">
        <Image src="/mms-membership-journey.webp" alt="Healthy ageing and quality of life" fill className="object-cover opacity-62" sizes="100vw"/>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,31,42,.96),rgba(10,31,42,.70)_46%,rgba(10,31,42,.14))]"/>
        <div className="relative mx-auto flex min-h-[660px] max-w-7xl items-center px-4 py-20"><div className="max-w-3xl text-ivory"><p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#dfb78f]">The long view</p><blockquote className="mt-6 font-serif text-5xl leading-[1.02] md:text-7xl">Protect the quality<br/>of the years ahead.</blockquote></div></div>
      </section>

      <section className="bg-[#11343b] px-4 py-24 text-ivory md:py-32">
        <div className="mx-auto max-w-7xl"><div className="mb-12 grid gap-6 lg:grid-cols-[.7fr_1.3fr] lg:items-end"><div><p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#dfb78f]">The MMS Method</p><h2 className="mt-4 font-serif text-5xl md:text-6xl">A clearer path.</h2></div><p className="max-w-lg text-base leading-8 text-ivory/56 lg:justify-self-end">Technology organises. People care. Doctors decide.</p></div><JourneyVisual /></div>
      </section>

      <section className="bg-[#f7f1e8] px-4 py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div className="relative min-h-[650px] overflow-hidden rounded-[2.5rem] shadow-[0_35px_90px_rgba(50,40,30,.16)]"><Image src="/mms-health-screening-hero.png" alt="MMS physician-led care" fill className="object-cover" sizes="(min-width:1024px) 52vw,100vw"/><div className="absolute inset-0 bg-gradient-to-t from-[#102f36]/88 via-transparent to-transparent"/><div className="absolute inset-x-7 bottom-7 text-ivory"><p className="text-[9px] font-bold uppercase tracking-[.2em] text-[#dfb78f]">Medical trust</p><p className="mt-3 max-w-2xl font-serif text-4xl">Advanced options never replace careful assessment.</p></div></div>
          <div className="lg:pl-8"><p className="text-[10px] font-bold uppercase tracking-[.24em] text-terracotta">Medicine at the centre</p><h2 className="mt-4 font-serif text-5xl leading-[1.03] text-navy md:text-6xl">Qualified professionals keep the clinical authority.</h2><div className="mt-8 grid grid-cols-2 gap-3">{["Assessment first","Suitability before treatment","Clear roles","Human review"].map(item=><div key={item} className="rounded-2xl border border-[#d3c0ae] bg-white p-4 font-serif text-xl text-navy">{item}</div>)}</div><div className="mt-8"><CTAButton href="/about-mms">Our care philosophy</CTAButton></div></div>
        </div>
      </section>

      <section className="bg-[#e9dfd2] px-4 py-24 md:py-32">
        <div className="mx-auto max-w-7xl"><div className="mb-10"><p className="text-[10px] font-bold uppercase tracking-[.24em] text-terracotta">Memberships</p><h2 className="mt-4 font-serif text-5xl text-navy md:text-6xl">Four levels of continuity.</h2></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{memberships.map((membership,index)=><Link key={membership.name} href="/memberships" className={`group min-h-[360px] rounded-[2rem] border p-7 transition duration-500 hover:-translate-y-2 ${index===3?"border-[#d3a77e] bg-[#e4c09b] text-navy":"border-[#cdbbaa] bg-[#173d43] text-ivory"}`}><span className={`text-[9px] font-bold ${index===3?"text-[#7c4f35]":"text-[#dfb78f]"}`}>0{index+1}</span><h3 className="mt-10 font-serif text-4xl">{membership.name}</h3><p className={`mt-3 text-sm ${index===3?"text-navy/62":"text-ivory/58"}`}>{membership.tagline}</p><div className={`mt-24 border-t pt-5 text-[9px] font-bold uppercase tracking-[.16em] ${index===3?"border-navy/15 text-[#7c4f35]":"border-white/10 text-[#dfb78f]"}`}>Explore →</div></Link>)}</div></div>
      </section>

      <section className="relative overflow-hidden bg-[#173b42] px-4 py-24 text-ivory md:py-32">
        <div className="mms-kinetic-ring -right-20 top-1/2 size-[30rem] -translate-y-1/2"/><div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center"><div><p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#dfb78f]">Ling</p><h2 className="mt-4 font-serif text-5xl md:text-6xl">Ask first.<br/><span className="text-[#e4c09c]">Feel clearer.</span></h2><div className="mt-8"><CTAButton href="/ling">Start with Ling</CTAButton></div></div><div className="relative mx-auto aspect-[4/5] w-full max-w-xl overflow-hidden rounded-[2.5rem] border border-white/12"><Image src="/ling-mms-guide.png" alt="Ling, MMS intelligent health guide" fill className="object-cover object-[50%_18%]" sizes="(min-width:1024px) 46vw,100vw"/><div className="absolute inset-0 bg-gradient-to-t from-[#173b42]/95 via-transparent to-transparent"/><div className="absolute inset-x-6 bottom-6 rounded-[1.4rem] border border-white/12 bg-[#102f36]/82 p-5 backdrop-blur-xl"><p className="font-serif text-2xl">Technology organises. People care.</p></div></div></div>
      </section>

      <section className="bg-[#eee4d7] px-4 py-24 md:py-32"><div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2"><Link href="/clinics" className="group relative min-h-[520px] overflow-hidden rounded-[2.4rem]"><Image src="/mms-health-screening-hero.png" alt="MMS Malaysia care" fill className="object-cover transition duration-1000 group-hover:scale-[1.04]" sizes="50vw"/><div className="absolute inset-0 bg-gradient-to-t from-[#102f36]/88 via-transparent to-transparent"/><div className="absolute bottom-7 left-7 text-ivory"><p className="text-[9px] font-bold uppercase tracking-[.2em] text-[#dfb78f]">Malaysia</p><h3 className="mt-2 font-serif text-4xl">Wellness & medical care</h3></div></Link><Link href="/medical-tourism" className="group relative min-h-[520px] overflow-hidden rounded-[2.4rem]"><Image src="/mms-about-hero.png" alt="Thailand care coordination" fill className="object-cover transition duration-1000 group-hover:scale-[1.04]" sizes="50vw"/><div className="absolute inset-0 bg-gradient-to-t from-[#102f36]/88 via-transparent to-transparent"/><div className="absolute bottom-7 left-7 text-ivory"><p className="text-[9px] font-bold uppercase tracking-[.2em] text-[#dfb78f]">Thailand</p><h3 className="mt-2 font-serif text-4xl">Recovery & specialist access</h3></div></Link></div></section>

      <section className="bg-[#f8f3eb] px-4 py-24 md:py-28"><div className="mx-auto max-w-5xl text-center"><p className="text-[10px] font-bold uppercase tracking-[.24em] text-terracotta">Begin simply</p><h2 className="mt-5 font-serif text-5xl leading-[1.02] text-navy md:text-7xl">Start with a conversation.</h2><div className="mt-9 flex flex-wrap justify-center gap-3"><CTAButton href="/book-appointment">Book a consultation</CTAButton><CTAButton href="/ling" variant="outline">Start with Ling</CTAButton></div></div></section>
    </main>
  );
}
