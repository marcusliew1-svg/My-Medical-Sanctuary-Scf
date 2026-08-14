import Image from "next/image";
import Link from "next/link";
import { CTAButton } from "@/components/CTAButton";
import { LingPanel } from "@/components/LingPanel";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { lingBoundaries } from "@/data/platformModules";
import { lingDisclaimer } from "@/lib/content";

const modes = [
  { number: "01", title: "Ask", text: "Explore general health and MMS questions without registration." },
  { number: "02", title: "Organise", text: "With permission, structure preferences, records and next actions." },
  { number: "03", title: "Coordinate", text: "Prepare the journey for MMS teams and qualified doctors." },
];

const examples = ["What should I ask at my health screening?", "How are Ascend and Evolve different?", "Can MMS coordinate care in Thailand?", "Help me prepare for a doctor discussion."];

export default function LingPage() {
  return (
    <main>
      <section className="relative isolate overflow-hidden bg-[#062e29] px-4 pb-14 pt-28 text-ivory md:pb-20 md:pt-36">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_72%_32%,rgba(212,190,133,.18),transparent_28%),radial-gradient(circle_at_15%_70%,rgba(126,163,143,.22),transparent_34%)]" />
        <div className="mx-auto grid min-h-[650px] max-w-6xl items-center gap-10 lg:grid-cols-[.92fr_1.08fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.22em] text-gold-light">Meet Ling · MMS intelligent guide</p>
            <h1 className="mt-5 text-balance font-serif text-5xl leading-[1.03] md:text-7xl">A calmer way to navigate your health journey.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-ivory/72">Ask first. Organise what matters. Move to human care when it is time.</p>
            <div className="mt-8 flex flex-wrap gap-3"><CTAButton href="#try-ling">Ask Ling now</CTAButton><CTAButton href="/how-it-works" variant="outline">See the MMS journey</CTAButton></div>
            <p className="mt-3 text-xs leading-5 text-ivory/58">No registration is needed to start asking general questions.</p>
            <div className="mt-10 grid max-w-xl grid-cols-3 gap-2">{modes.map(mode => <div key={mode.number} className="rounded-2xl border border-white/10 bg-white/5 p-4"><span className="text-xs text-gold-light">{mode.number}</span><p className="mt-2 font-serif text-xl">{mode.title}</p></div>)}</div>
          </div>
          <div className="relative min-h-[560px]">
            <div className="absolute inset-x-4 bottom-0 top-0 overflow-hidden rounded-[2.4rem] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-sm">
              <Image src="/ling-mms-guide.png" alt="Ling, My Medical Sanctuary intelligent guide" fill priority className="object-cover object-[50%_18%]" sizes="(min-width: 1024px) 50vw, 100vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#062e29] via-transparent to-transparent" />
            </div>
            <div className="absolute bottom-7 left-0 max-w-[300px] rounded-2xl border border-white/15 bg-[#0b1f27]/88 p-5 shadow-xl backdrop-blur-md"><p className="text-xs font-bold uppercase tracking-[.16em] text-gold-light">Ling can help now</p><p className="mt-2 font-serif text-2xl">“Tell me what you want to understand.”</p></div>
            <div className="absolute right-0 top-10 rounded-2xl bg-ivory px-5 py-4 text-navy shadow-xl"><p className="text-xs font-bold uppercase tracking-[.14em] text-deep-green">Doctor-led</p><p className="mt-1 text-sm">Medical decisions remain human.</p></div>
          </div>
        </div>
      </section>

      <section id="try-ling" className="scroll-mt-24 bg-ivory px-4 py-20"><div className="mx-auto max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-[.72fr_1.28fr] lg:items-start">
          <div className="lg:sticky lg:top-28"><p className="text-xs font-bold uppercase tracking-[.18em] text-gold">Try Ling</p><h2 className="mt-3 font-serif text-4xl leading-tight text-navy md:text-5xl">Start with a question, not a form.</h2><p className="mt-4 leading-7 text-warm-gray">{lingDisclaimer}</p><div className="mt-6 grid gap-2">{examples.map(example => <div key={example} className="rounded-xl bg-white px-4 py-3 text-sm text-navy shadow-soft">“{example}”</div>)}</div></div>
          <LingPanel />
        </div>
      </div></section>

      <section className="bg-warm-white px-4 py-20"><div className="mx-auto max-w-6xl">
        <div className="mb-12 grid overflow-hidden rounded-[2rem] bg-deep-green text-ivory shadow-premium md:grid-cols-3">{modes.map((mode,index)=><article key={mode.number} className="relative border-white/10 p-7 md:border-l first:border-l-0"><span className="text-xs font-bold text-gold-light">{mode.number}</span><h2 className="mt-3 font-serif text-3xl">{mode.title}</h2><p className="mt-3 text-sm leading-6 text-ivory/68">{mode.text}</p>{index<2?<span className="absolute -right-3 top-1/2 z-10 hidden size-6 place-items-center rounded-full bg-gold text-navy md:grid">→</span>:null}</article>)}</div>
        <div className="grid gap-5 md:grid-cols-2">
          <article className="rounded-[2rem] bg-[#dfe9e3] p-8"><p className="text-xs font-bold uppercase tracking-[.16em] text-deep-green">What Ling does</p><div className="mt-5 grid gap-3">{["Educates and clarifies","Organises non-clinical context","Supports onboarding and coordination","Escalates to the right human team"].map(item=><div key={item} className="flex items-center gap-3 rounded-xl bg-white/70 p-4"><span className="grid size-8 place-items-center rounded-full bg-deep-green text-white">✓</span><p className="font-semibold text-navy">{item}</p></div>)}</div></article>
          <article className="rounded-[2rem] bg-navy p-8 text-ivory"><p className="text-xs font-bold uppercase tracking-[.16em] text-gold-light">What Ling never replaces</p><div className="mt-5 grid gap-3">{lingBoundaries.slice(0,4).map(item=><div key={item} className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-ivory/75">{item}</div>)}</div></article>
        </div>
        <div className="mt-8"><DisclaimerBox title="Human review remains central"><p>A personalised medical recommendation, diagnosis, prescription or treatment decision must come from an appropriately qualified professional. Ling supports the journey; she does not become the clinician.</p></DisclaimerBox></div>
        <div className="mt-10 text-center"><Link href="/register" className="font-semibold text-deep-green underline decoration-gold underline-offset-4">Create a secure account when you want Ling to remember your journey →</Link></div>
      </div></section>
    </main>
  );
}
