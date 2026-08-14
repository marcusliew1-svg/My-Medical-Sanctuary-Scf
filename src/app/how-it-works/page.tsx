import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { JourneyVisual } from "@/components/JourneyVisual";
import { EcosystemVisual } from "@/components/EcosystemVisual";

export const metadata: Metadata = {
  title: "How It Works",
  description: "See how MMS connects discovery, Ling, coordination and doctor-led care.",
};

const moments = [
  ["01", "Discover", "Start with your priorities—not a treatment menu."],
  ["02", "Organise", "Ling structures the questions, records and context that matter."],
  ["03", "Review", "MMS prepares the pathway for qualified professional review."],
  ["04", "Decide", "A doctor leads medical decisions and suitability."],
  ["05", "Continue", "Follow-up stays connected across Malaysia and Thailand."],
];

export default function HowItWorksPage() {
  return (
    <main>
      <Hero
        eyebrow="How MMS Works"
        title="One journey. Fewer disconnected decisions."
        subtitle="Ling organises. MMS coordinates. Doctors decide."
        image="/mms-membership-journey.webp"
        primaryLabel="Start with Ling"
        primaryHref="/register"
        secondaryLabel="Explore memberships"
        secondaryHref="/memberships"
      />

      <section className="bg-warm-white px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid overflow-hidden rounded-[2rem] bg-deep-green text-ivory shadow-premium lg:grid-cols-[1.05fr_.95fr]">
            <div className="relative min-h-[430px]">
              <Image src="/ling-mms-guide.png" alt="Ling supporting the MMS journey" fill className="object-cover object-[50%_18%]" sizes="(min-width: 1024px) 52vw, 100vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-green/75 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 grid grid-cols-3 gap-2 text-center text-xs font-semibold text-ivory/85">
                <span className="rounded-xl bg-black/25 px-3 py-3 backdrop-blur">Ask</span>
                <span className="rounded-xl bg-black/25 px-3 py-3 backdrop-blur">Organise</span>
                <span className="rounded-xl bg-black/25 px-3 py-3 backdrop-blur">Coordinate</span>
              </div>
            </div>
            <div className="flex flex-col justify-center p-8 md:p-12">
              <p className="text-xs font-bold uppercase tracking-[.2em] text-gold-light">The principle</p>
              <h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">Technology should make care feel simpler, not colder.</h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-ivory/72">Ling keeps the journey organised while human professionals remain responsible for medical judgement.</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {["Private", "Continuous", "Doctor-led"].map(item => <div key={item} className="rounded-2xl border border-white/12 bg-white/7 p-4 text-center text-sm font-semibold">{item}</div>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ivory px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-gold">Your journey</p>
            <h2 className="mt-3 font-serif text-4xl text-navy md:text-5xl">Five moments that move care forward.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-5">
            {moments.map(([number, title, text]) => (
              <article key={number} className="relative overflow-hidden rounded-[1.5rem] border border-stone-200 bg-white p-5 shadow-soft">
                <span className="font-serif text-5xl text-deep-green/12">{number}</span>
                <h3 className="-mt-2 font-serif text-2xl text-navy">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-warm-gray">{text}</p>
                <div className="absolute inset-x-5 bottom-0 h-1 rounded-full bg-gradient-to-r from-deep-green via-sage to-gold-light" />
              </article>
            ))}
          </div>
          <div className="mt-14"><JourneyVisual /></div>
        </div>
      </section>

      <section className="bg-warm-white px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[.82fr_1.18fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-gold">The MMS ecosystem</p>
              <h2 className="mt-3 font-serif text-4xl leading-tight text-navy md:text-5xl">Four roles. One connected relationship.</h2>
              <p className="mt-4 max-w-xl text-lg leading-8 text-warm-gray">You should always know who is guiding, coordinating and making the medical decision.</p>
              <Link href="/about" className="mt-7 inline-flex items-center gap-2 font-semibold text-deep-green">See the MMS model <span>→</span></Link>
            </div>
            <EcosystemVisual />
          </div>
        </div>
      </section>
    </main>
  );
}
