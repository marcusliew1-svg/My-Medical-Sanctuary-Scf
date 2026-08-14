import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CTAButton } from "@/components/CTAButton";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { memberships } from "@/data/memberships";

export const metadata: Metadata = {
  title: "Memberships",
  description:
    "Explore MMS memberships including Ascend, Evolve, Eterna and Pinnacle for structured wellness coordination.",
};

const levels = [
  { name: "Ascend", icon: "△", promise: "Discover", signal: "Baseline", forWhom: "Starting preventive care", tone: "from-deep-green to-navy", decision: "Preventive baseline", coordination: "Guided coordination" },
  { name: "Evolve", icon: "◇", promise: "Optimise", signal: "Momentum", forWhom: "Improving energy or metabolism", tone: "from-sage to-deep-green", decision: "Active optimisation", coordination: "Structured check-ins" },
  { name: "Eterna", icon: "♧", promise: "Protect", signal: "Continuity", forWhom: "Long-term health oversight", tone: "from-charcoal to-navy", decision: "Long-term prevention", coordination: "Priority continuity" },
  { name: "Pinnacle", icon: "♛", promise: "Coordinate", signal: "Concierge", forWhom: "Executives and families", tone: "from-terracotta to-navy", decision: "Private high-touch support", coordination: "Dedicated coordination" },
];

const chooseSteps = [
  { number: "01", title: "Start with your goals", text: "Think about whether you need a baseline, closer optimisation support, long-term continuity or private high-touch coordination." },
  { number: "02", title: "Choose the depth", text: "Compare how much coordination and continuity you want around your health journey." },
  { number: "03", title: "Discuss with MMS", text: "Use Ling or speak with the MMS team to clarify the most suitable membership pathway." },
  { number: "04", title: "Keep clinical decisions separate", text: "Membership selection does not decide diagnosis, tests or treatment suitability; those remain with qualified professionals." },
];

export default function MembershipsPage() {
  return (
    <main>
      <section className="relative isolate overflow-hidden bg-navy px-4 pb-16 pt-32 text-ivory md:pb-24 md:pt-40">
        <Image src="/mms-membership-journey.webp" alt="" fill priority className="-z-20 object-cover opacity-55" sizes="100vw" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(9,25,38,.98),rgba(9,25,38,.82)_52%,rgba(9,25,38,.5))]" />
        <div className="mx-auto grid min-h-[60vh] max-w-7xl items-center gap-10 lg:grid-cols-[1fr_.8fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-gold-light">MMS Memberships</p>
            <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-[1.04] md:text-7xl">Choose the depth of support that fits your life.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ivory/72">Four levels of continuity — from a preventive baseline to private, high-touch coordination.</p>
            <div className="mt-8 flex flex-wrap gap-3"><CTAButton href="/ling">Ask Ling</CTAButton><CTAButton href="/contact" variant="outline">Speak with MMS</CTAButton></div>
            <div className="mt-5 grid max-w-2xl gap-2 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-gold-light">What happens next</p><p className="mt-1 text-xs leading-5 text-ivory/68">Ling or MMS helps clarify the membership pathway.</p></div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-gold-light">Not a treatment bundle</p><p className="mt-1 text-xs leading-5 text-ivory/68">Membership does not automatically select or guarantee treatment.</p></div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-gold-light">Doctor-led</p><p className="mt-1 text-xs leading-5 text-ivory/68">Clinical suitability remains with qualified professionals.</p></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {levels.map((level, index) => (
              <div key={level.name} className={`relative min-h-[170px] overflow-hidden rounded-[1.5rem] bg-gradient-to-br ${level.tone} p-5 shadow-xl`}>
                <div className="absolute -right-8 -top-8 size-28 rounded-full border border-white/10" />
                <div className="flex items-center justify-between"><span className="grid size-10 place-items-center rounded-full border border-white/15 text-gold-light">{level.icon}</span><span className="text-[10px] font-bold uppercase tracking-[.16em] text-ivory/50">0{index + 1}</span></div>
                <p className="mt-8 font-serif text-2xl">{level.name}</p><p className="text-xs uppercase tracking-[.14em] text-gold-light">{level.promise}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 grid gap-5 md:grid-cols-[.7fr_1.3fr] md:items-end">
            <div><p className="text-xs font-bold uppercase tracking-[.2em] text-deep-green">Compare simply</p><h2 className="mt-3 font-serif text-4xl text-navy md:text-5xl">The difference is the relationship around you.</h2></div>
            <p className="max-w-2xl text-base leading-7 text-warm-gray">Use this as a quick orientation. It describes the depth of coordination, not an automatic list of treatments or clinical entitlements.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {memberships.map((membership, index) => (
              <article key={membership.name} className="rounded-[1.75rem] border border-black/5 bg-white p-6 shadow-soft">
                <div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-gold">{levels[index].decision}</p><h3 className="mt-2 font-serif text-3xl text-navy">{membership.name}</h3></div><span className="grid size-10 place-items-center rounded-full bg-ivory font-serif text-xl text-deep-green">{levels[index].icon}</span></div>
                <div className="mt-5 grid gap-4">
                  <div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-deep-green">Best for</p><p className="mt-1 text-sm leading-6 text-warm-gray">{membership.whoItSuits}</p></div>
                  <div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-deep-green">Coordination style</p><p className="mt-1 text-sm font-semibold text-navy">{levels[index].coordination}</p><p className="mt-1 text-xs leading-5 text-warm-gray">{membership.coordination}</p></div>
                  <div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-deep-green">Opening journey</p><p className="mt-1 text-xs leading-5 text-warm-gray">{membership.firstThirtyDays.slice(0, 2).join(" → ")}</p></div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-gold/25 bg-[#fbf7ef] p-5 md:flex md:items-center md:justify-between md:gap-6">
            <div><p className="text-xs font-bold uppercase tracking-[.16em] text-deep-green">Important distinction</p><p className="mt-2 max-w-3xl text-sm leading-6 text-navy">A membership creates a level of access, continuity and coordination. It does not by itself determine what treatment you should receive. Clinical assessment and treatment suitability are separate decisions.</p></div>
            <Link href="/ling" className="mt-4 inline-flex min-h-10 shrink-0 items-center justify-center rounded-full bg-deep-green px-5 text-sm font-semibold text-white md:mt-0">Help me compare</Link>
          </div>
        </div>
      </section>

      <section className="bg-warm-white px-4 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 grid gap-5 md:grid-cols-[.7fr_1.3fr] md:items-end"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-deep-green">See the journeys</p><h2 className="mt-3 font-serif text-4xl text-navy md:text-5xl">Four memberships. Four different rhythms.</h2></div><p className="max-w-2xl text-base leading-7 text-warm-gray">The difference is not simply “more items”. It is the amount of continuity, access and coordination around you.</p></div>

          <div className="grid gap-6 md:grid-cols-2">
            {memberships.map((membership, index) => (
              <article key={membership.name} className="group overflow-hidden rounded-[2rem] bg-white shadow-soft">
                <div className={`relative h-48 bg-gradient-to-br ${levels[index].tone} p-7 text-ivory`}>
                  <div className="absolute -right-10 -top-10 size-40 rounded-full border border-white/10" />
                  <div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-gold-light">{membership.accessNote}</p><h3 className="mt-3 font-serif text-4xl">{membership.name}</h3><p className="mt-2 text-sm font-semibold text-ivory/75">{membership.tagline}</p></div><span className="font-serif text-5xl text-white/15">0{index + 1}</span></div>
                </div>
                <div className="p-7">
                  <div className="grid gap-5 sm:grid-cols-2"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-deep-green">Best for</p><p className="mt-2 text-sm leading-6 text-warm-gray">{membership.whoItSuits}</p></div><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-deep-green">Coordination</p><p className="mt-2 text-sm leading-6 text-warm-gray">{membership.coordination}</p></div></div>
                  <div className="mt-6 border-t border-black/5 pt-5"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-gold">Opening journey</p><div className="mt-3 flex flex-wrap gap-2">{membership.firstThirtyDays.slice(0,4).map(item => <span key={item} className="rounded-full bg-ivory px-3 py-2 text-xs text-navy">{item}</span>)}</div></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ivory px-4 py-20 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center"><p className="text-xs font-bold uppercase tracking-[.2em] text-deep-green">How to choose</p><h2 className="mt-3 font-serif text-4xl text-navy md:text-5xl">Choose the support level first. Keep treatment decisions separate.</h2></div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{chooseSteps.map((step,index)=><article key={step.number} className="relative rounded-[1.5rem] bg-white p-6 shadow-soft"><span className="text-xs font-bold text-gold">{step.number}</span><h3 className="mt-3 font-serif text-2xl text-navy">{step.title}</h3><p className="mt-3 text-sm leading-6 text-warm-gray">{step.text}</p>{index<chooseSteps.length-1?<span className="absolute -right-3 top-1/2 z-10 hidden size-6 place-items-center rounded-full bg-deep-green text-white xl:grid">→</span>:null}</article>)}</div>
        </div>
      </section>

      <section className="bg-deep-green px-4 py-20 text-ivory md:py-24">
        <div className="mx-auto max-w-6xl text-center"><p className="text-xs font-bold uppercase tracking-[.2em] text-gold-light">Not sure where you fit?</p><h2 className="mt-3 font-serif text-4xl md:text-6xl">Start with your goals, not a package.</h2><p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-ivory/68">Ling can help you understand the differences before you speak with the MMS team.</p><div className="mt-8 flex justify-center"><CTAButton href="/ling">Ask Ling</CTAButton></div></div>
      </section>

      <section className="bg-warm-white px-4 py-12"><div className="mx-auto max-w-5xl"><DisclaimerBox><p>Membership does not promise specific outcomes. Any wellness pathway is subject to discovery discussion, professional review and suitability assessment.</p></DisclaimerBox></div></section>
    </main>
  );
}
