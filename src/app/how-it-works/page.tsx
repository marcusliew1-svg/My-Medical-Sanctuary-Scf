import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/Hero";

export const metadata: Metadata = {
  title: "How It Works",
  description: "See how MMS connects discovery, Ling, coordination and doctor-led care.",
};

const moments = [["01", "Discover", "Start with your goals and health picture."],["02", "Organise", "Ling helps prepare context and questions."],["03", "Review", "MMS connects the right pathway and people."],["04", "Decide", "Qualified professionals assess suitability."],["05", "Continue", "Care stays connected over time."]];

export default function HowItWorksPage() {
  return (
    <main className="overflow-hidden bg-[#f7f1e8]">
      <Hero eyebrow="How MMS Works" title="One journey. Fewer disconnected decisions." subtitle="Ling organises. MMS coordinates. Doctors decide." image="/mms-membership-journey.webp" primaryLabel="Start with Ling" primaryHref="/ling" secondaryLabel="Explore memberships" secondaryHref="/memberships" />

      <section className="bg-[#f7f1e8] px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.08fr_.92fr] lg:items-center">
          <div className="relative min-h-[650px] overflow-hidden rounded-[48%_52%_46%_54%/43%_44%_56%_57%]">
            <Image src="/ling-mms-guide.png" alt="Ling supporting the MMS journey" fill className="object-cover object-[50%_18%]" sizes="(min-width:1024px) 55vw,100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#15383a]/40 to-transparent" />
          </div>
          <div className="lg:pl-8"><p className="text-[10px] font-bold uppercase tracking-[.26em] text-terracotta">Technology with boundaries</p><h2 className="mt-5 font-serif text-5xl leading-[1.02] text-navy md:text-7xl">Make the journey simpler.<br/><span className="text-[#b7795e]">Keep the judgement human.</span></h2><p className="mt-7 max-w-xl text-lg leading-8 text-warm-gray">MMS uses technology to organise information and make navigation easier. Medical decisions still belong to qualified professionals.</p></div>
        </div>
      </section>

      <section className="bg-[#15383a] px-5 py-24 text-ivory md:px-8 md:py-36">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-9 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><p className="text-[10px] font-bold uppercase tracking-[.26em] text-[#e4ba93]">The journey</p><h2 className="mt-5 font-serif text-5xl leading-[1.02] md:text-7xl">Five moments.<br/><span className="text-[#e8c4a3]">One connected story.</span></h2></div><p className="max-w-xl text-lg leading-8 text-ivory/64 lg:justify-self-end">Each stage has a clear role so you know who is organising, reviewing and deciding.</p></div>
          <div className="relative mt-20 grid gap-12 md:grid-cols-5 md:gap-5">
            <div className="absolute left-0 right-0 top-[17px] hidden h-px bg-gradient-to-r from-[#e5bc98]/20 via-[#e5bc98]/70 to-[#e5bc98]/20 md:block" />
            {moments.map(([number,title,text]) => <div key={number} className="relative"><span className="relative z-10 inline-grid size-9 place-items-center rounded-full border border-[#e5bc98]/55 bg-[#15383a] text-[9px] font-bold text-[#edc8a6]">{number}</span><h3 className="mt-7 font-serif text-3xl">{title}</h3><p className="mt-3 max-w-[210px] text-sm leading-7 text-ivory/58">{text}</p></div>)}
          </div>
        </div>
      </section>

      <section className="bg-[#eadccc] px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
            <div><p className="text-[10px] font-bold uppercase tracking-[.26em] text-terracotta">Who does what?</p><h2 className="mt-5 font-serif text-5xl leading-[1.02] text-navy md:text-7xl">Clear roles build trust.</h2><p className="mt-7 max-w-lg text-lg leading-8 text-warm-gray">You should always know who is helping you understand, who is coordinating the journey, and who is making the medical decision.</p><Link href="/about-mms" className="mt-8 inline-flex text-xs font-bold uppercase tracking-[.16em] text-deep-green">See the MMS model →</Link></div>
            <div className="divide-y divide-[#c7b29e] border-y border-[#c7b29e]">
              {["Ling · explains and organises", "MMS · coordinates the relationship", "Qualified professional · assesses and decides", "You · remain at the centre"].map((item,index)=><div key={item} className="grid grid-cols-[60px_1fr] items-center py-7"><span className="text-[10px] font-bold text-terracotta">0{index+1}</span><p className="font-serif text-2xl text-navy md:text-3xl">{item}</p></div>)}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
