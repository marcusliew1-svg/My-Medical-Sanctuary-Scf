import type { Metadata } from "next";
import Image from "next/image";
import { CapabilityStatus } from "@/components/CapabilityStatus";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "Video & Media Room",
  description: "MMS films, doctor-led education, Ling explainers, partner stories and future SCF progress.",
};

const channels = [
  ["Ask a Doctor", "Human-led clinical education", "/mms-health-screening-hero.png", "Doctor review"],
  ["Ling Explains", "Clear, governed health learning", "/ling-mms-guide.png", "With Ling"],
  ["SCF Progress", "Future science and laboratory updates", "/mms-about-hero.png", "Roadmap"],
];

export default function MediaRoomPage(){return <main>
  <PageHero eyebrow="Video & Media Room" title="See the MMS ecosystem in motion." lead="Short films, expert conversations and progress stories—made easy to explore." primaryHref="/contact" primaryLabel="Media enquiries" />
  <Section eyebrow="Featured film" title="The patient journey, explained visually." lead="The media room will make complex care pathways warmer, clearer and easier to share.">
    <div className="relative min-h-[430px] overflow-hidden rounded-3xl bg-navy shadow-soft">
      <Image src="/mms-membership-journey.webp" alt="The MMS patient journey" fill className="object-cover opacity-75" sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/35 to-transparent" />
      <div className="relative flex min-h-[430px] max-w-xl flex-col justify-end p-7 text-ivory md:p-12">
        <CapabilityStatus status="development" />
        <p className="mt-6 text-xs font-bold uppercase tracking-[.16em] text-gold-light">MMS Explained · Film 01</p>
        <h2 className="mt-3 font-serif text-4xl">From discovery to continuing care.</h2>
        <p className="mt-4 leading-7 text-ivory/75">Meet Ling, the coordination team and the doctor—and see where each person supports your journey.</p>
        <span className="mt-7 grid size-14 place-items-center rounded-full border border-white/40 bg-white/10 text-xl">▶</span>
      </div>
    </div>
  </Section>
  <Section eyebrow="Coming channels" title="Stories with a human face." className="bg-warm-white">
    <div className="grid gap-5 md:grid-cols-3">{channels.map(([title,text,image,label],i)=><article key={title} className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-soft">
      <div className="relative aspect-[4/3]"><Image src={image} alt="" fill className="object-cover" sizes="(min-width: 768px) 33vw, 100vw" /><div className="absolute inset-0 bg-gradient-to-t from-navy/65 to-transparent"/><span className="absolute bottom-4 left-4 rounded-full bg-ivory/95 px-3 py-1 text-xs font-bold text-navy">{label}</span></div>
      <div className="p-6"><p className="text-xs font-bold uppercase tracking-[.16em] text-gold">Channel 0{i+2}</p><h2 className="mt-2 font-serif text-2xl text-navy">{title}</h2><p className="mt-2 text-warm-gray">{text}</p></div>
    </article>)}</div>
  </Section>
 </main>}
