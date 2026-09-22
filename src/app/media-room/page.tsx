import type { Metadata } from "next";
import Image from "next/image";
import { CapabilityStatus } from "@/components/CapabilityStatus";
import { EditorialHero, FinalInvitation } from "@/components/Editorial";

export const metadata: Metadata = {
  title: "Video & Media Room",
  description: "MMS films, doctor-led education, Ling explainers, partner stories and future SCF progress.",
};

const channels = [
  ["Ask a Doctor", "Human-led clinical education", "/mms-health-screening-hero.png", "Doctor review"],
  ["Ling Explains", "Clear, governed health learning", "/ling-mms-guide.png", "With Ling"],
  ["SCF Progress", "Future science and laboratory updates", "/mms-about-hero.png", "Roadmap"],
];

export default function MediaRoomPage() {
  return (
    <main>
      <EditorialHero
        eyebrow="Video & Media Room"
        title="Science, care and the MMS journey—in motion."
        lead="Short films, doctor-led education and Ling explainers should make complex health ideas easier to understand without losing evidence boundaries."
        image="/ling-knowledge.png"
        imageAlt="Ling, the MMS virtual health spokesperson, introducing MMS health education media."
        primaryLabel="Explore Health Intelligence"
        primaryHref="/insights"
        secondaryLabel="Ask Ling"
        secondaryHref="/ling"
        imagePosition="70% center"
        spokespersonName="Ling"
        spokespersonMessage="I’ll help turn complex health topics into clearer questions while keeping the medical boundary visible."
      />

      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="editorial-kicker mb-4 text-deep-green">Featured film</p>
          <h2 className="max-w-3xl text-balance font-serif text-4xl leading-tight text-navy md:text-6xl">
            The patient journey, explained visually.
          </h2>
          <div className="relative mt-10 min-h-[430px] overflow-hidden rounded-[2rem] bg-navy shadow-[0_30px_90px_rgba(11,26,46,0.16)]">
            <Image src="/mms-membership-journey.webp" alt="The MMS patient journey" fill className="object-cover opacity-75" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-navy/92 via-navy/40 to-transparent" />
            <div className="relative flex min-h-[430px] max-w-xl flex-col justify-end p-7 text-ivory md:p-12">
              <CapabilityStatus status="development" />
              <p className="mt-6 text-xs font-bold uppercase tracking-[.16em] text-gold-light">MMS Explained · Film 01</p>
              <h3 className="mt-3 font-serif text-4xl">From discovery to continuing care.</h3>
              <p className="mt-4 leading-7 text-ivory/75">Meet Ling, the coordination team and the doctor—and see where each role supports the journey.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#07151d] px-4 py-20 text-ivory md:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="editorial-kicker mb-4 text-gold-light">Coming channels</p>
          <h2 className="max-w-3xl text-balance font-serif text-4xl leading-tight md:text-6xl">Stories with evidence boundaries.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {channels.map(([title,text,image,label],i)=>(
              <article key={title} className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.035]">
                <div className="relative aspect-[4/3]"><Image src={image} alt="" fill className="object-cover" sizes="(min-width: 768px) 33vw, 100vw" /><div className="absolute inset-0 bg-gradient-to-t from-navy/65 to-transparent"/><span className="absolute bottom-4 left-4 rounded-full bg-ivory/95 px-3 py-1 text-xs font-bold text-navy">{label}</span></div>
                <div className="p-6"><p className="text-xs font-bold uppercase tracking-[.16em] text-gold-light">Channel 0{i+2}</p><h3 className="mt-2 font-serif text-2xl">{title}</h3><p className="mt-2 text-ivory/58">{text}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <FinalInvitation title="Learn visually. Decide with professional guidance." />
    </main>
  );
}
