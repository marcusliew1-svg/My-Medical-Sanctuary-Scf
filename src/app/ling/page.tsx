import Image from "next/image";
import Link from "next/link";
import { CTAButton } from "@/components/CTAButton";
import { LingPanel } from "@/components/LingPanel";
import { DisclaimerBox } from "@/components/DisclaimerBox";

const modes = [
  ["01", "Ask", "Begin with a question."],
  ["02", "Understand", "Make sense of the options."],
  ["03", "Prepare", "Arrive ready for human care."],
];

const examples = ["What should I ask at screening?", "Which membership fits me?", "Can MMS coordinate Thailand care?"];

export default function LingPage() {
  return (
    <main className="overflow-hidden bg-[#f6efe6]">
      <section className="relative isolate min-h-[86vh] overflow-hidden bg-[#0b3035] px-4 pb-16 pt-32 text-ivory md:pt-40">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_72%_32%,rgba(218,182,143,.17),transparent_30%),radial-gradient(circle_at_18%_70%,rgba(103,149,132,.18),transparent_36%)]" />
        <div className="mms-kinetic-ring -right-24 top-24 -z-10 size-[34rem]" />
        <div className="mx-auto grid min-h-[72vh] max-w-7xl items-center gap-12 lg:grid-cols-[.88fr_1.12fr]">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#e2ba92]">Meet Ling</p>
            <h1 className="mt-5 font-serif text-6xl leading-[.98] md:text-8xl">Ask first.<span className="block text-[#e8c7a7]">Feel clearer.</span></h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-ivory/64">A calm digital guide for exploring MMS before you speak with the team.</p>
            <div className="mt-9 flex flex-wrap gap-3"><CTAButton href="#try-ling">Ask Ling now</CTAButton><CTAButton href="/how-it-works" variant="outline">See the journey</CTAButton></div>
            <div className="mt-10 grid max-w-xl grid-cols-3 gap-2">{modes.map(([number,title]) => <div key={number} className="rounded-2xl border border-white/10 bg-white/[.05] p-4"><span className="text-[9px] font-bold text-[#dfb68e]">{number}</span><p className="mt-3 font-serif text-xl">{title}</p></div>)}</div>
          </div>

          <div className="relative mx-auto min-h-[590px] w-full max-w-xl">
            <div className="absolute inset-4 overflow-hidden rounded-[2.7rem] border border-white/12 bg-white/5 shadow-[0_40px_120px_rgba(0,0,0,.34)]">
              <Image src="/ling-mms-guide.png" alt="Ling, MMS intelligent health guide" fill priority className="object-cover object-[50%_18%]" sizes="(min-width:1024px) 50vw,100vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b3035]/96 via-transparent to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 max-w-[300px] rounded-[1.7rem] border border-white/12 bg-[#102f36]/90 p-5 shadow-2xl backdrop-blur-xl"><p className="text-[9px] font-bold uppercase tracking-[.18em] text-[#dfb78f]">Ling starts here</p><p className="mt-2 font-serif text-2xl">“What would you like to understand?”</p></div>
            <div className="absolute right-0 top-14 rounded-[1.5rem] border border-[#d8b18c]/35 bg-[#f3e8dc]/95 px-5 py-4 text-navy shadow-2xl"><p className="text-[9px] font-bold uppercase tracking-[.16em] text-terracotta">Human boundary</p><p className="mt-1 text-xs font-semibold">Medical decisions stay human.</p></div>
          </div>
        </div>
      </section>

      <section id="try-ling" className="scroll-mt-24 bg-[#f8f3eb] px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.58fr_1.42fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="text-[10px] font-bold uppercase tracking-[.24em] text-terracotta">Try Ling</p>
            <h2 className="mt-4 font-serif text-5xl leading-tight text-navy md:text-6xl">Start with a question.<br/>Not a form.</h2>
            <div className="mt-7 grid gap-2">{examples.map(example => <div key={example} className="rounded-2xl border border-[#d8c8b8] bg-white px-4 py-3 text-sm text-navy shadow-sm">“{example}”</div>)}</div>
          </div>
          <div className="rounded-[2.4rem] border border-[#d7c4b2] bg-white p-2 shadow-[0_30px_90px_rgba(40,45,44,.11)]"><LingPanel /></div>
        </div>
      </section>

      <section className="bg-[#173d43] px-4 py-24 text-ivory md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-px overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 md:grid-cols-3">
            {modes.map(([number,title,text]) => <article key={number} className="relative min-h-[280px] bg-[#173d43] p-7"><span className="text-[10px] font-bold text-[#dfb78f]">{number}</span><div className="mt-20 h-px w-12 bg-[#dfb78f]/35"/><h3 className="mt-6 font-serif text-3xl">{title}</h3><p className="mt-3 text-sm text-ivory/56">{text}</p></article>)}
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-[2rem] bg-[#e6c39f] p-7 text-navy"><p className="text-[9px] font-bold uppercase tracking-[.18em] text-[#7c4f35]">Ling can</p><h3 className="mt-4 font-serif text-4xl">Explain. Organise. Prepare.</h3></div>
            <div className="rounded-[2rem] border border-white/12 bg-white/[.045] p-7"><p className="text-[9px] font-bold uppercase tracking-[.18em] text-[#dfb78f]">Ling cannot</p><h3 className="mt-4 font-serif text-4xl">Diagnose. Prescribe. Replace a clinician.</h3></div>
          </div>
        </div>
      </section>

      <section className="bg-[#f8f3eb] px-4 py-10"><div className="mx-auto max-w-5xl"><DisclaimerBox title="Human review remains central"><p>Personalised diagnosis, prescription and treatment decisions must come from an appropriately qualified professional.</p></DisclaimerBox><div className="mt-8 text-center"><Link href="/register" className="text-sm font-semibold text-deep-green underline decoration-gold underline-offset-4">Create a secure account when you want Ling to remember your journey →</Link></div></div></section>
    </main>
  );
}
