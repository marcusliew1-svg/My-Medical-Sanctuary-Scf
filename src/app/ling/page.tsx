import Image from "next/image";
import Link from "next/link";
import { CTAButton } from "@/components/CTAButton";
import { LingPanel } from "@/components/LingPanel";
import { DisclaimerBox } from "@/components/DisclaimerBox";

const modes = [["01", "Ask", "Begin with a question."],["02", "Understand", "Make sense of the options."],["03", "Prepare", "Arrive ready for human care."]];
const examples = ["What should I ask at screening?", "Which membership fits me?", "Can MMS coordinate Thailand care?"];

export default function LingPage() {
  return (
    <main className="overflow-hidden bg-[#f7f1e8]">
      <section className="relative isolate min-h-[88vh] overflow-hidden bg-[#15383a] text-ivory">
        <Image src="/ling-mms-guide.png" alt="Ling, MMS intelligent health guide" fill priority className="-z-30 object-cover object-[68%_18%]" sizes="100vw" />
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(20,55,58,.97),rgba(20,55,58,.82)_45%,rgba(20,55,58,.24))]" />
        <div className="mx-auto flex min-h-[88vh] max-w-7xl items-center px-5 pb-20 pt-36 md:px-8 md:pt-44">
          <div className="max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[.28em] text-[#e8c19d]">Meet Ling</p>
            <h1 className="mt-5 font-serif text-6xl leading-[.98] md:text-8xl">You do not need to know<span className="block text-[#edc8a6]">where to begin.</span></h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-ivory/72">Ask a question. Understand your options. Prepare for the right human conversation.</p>
            <div className="mt-9 flex flex-wrap gap-3"><CTAButton href="#try-ling">Ask Ling now</CTAButton><CTAButton href="/how-it-works" variant="outline">See the MMS journey</CTAButton></div>
            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/18 pt-6 text-[10px] font-semibold uppercase tracking-[.14em] text-ivory/62"><span>Education</span><span>Organisation</span><span>Human handoff</span></div>
          </div>
        </div>
      </section>

      <section id="try-ling" className="scroll-mt-24 bg-[#f7f1e8] px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[.7fr_1.3fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="text-[10px] font-bold uppercase tracking-[.26em] text-terracotta">A simple first step</p>
            <h2 className="mt-5 font-serif text-5xl leading-[1.02] text-navy md:text-7xl">Start with a question.<br/><span className="text-[#b7795e]">Not a form.</span></h2>
            <p className="mt-7 max-w-md text-base leading-8 text-warm-gray">Ling is there to help you orient yourself before you decide whether you need a programme, a treatment guide or a conversation with the team.</p>
            <div className="mt-8 divide-y divide-[#d0bdab] border-y border-[#d0bdab]">{examples.map(example => <p key={example} className="py-4 font-serif text-xl text-navy">“{example}”</p>)}</div>
          </div>
          <div className="border-y border-[#cfbba8] py-4"><LingPanel /></div>
        </div>
      </section>

      <section className="bg-[#eadccc] px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr] lg:items-end"><div><p className="text-[10px] font-bold uppercase tracking-[.26em] text-terracotta">How Ling helps</p><h2 className="mt-5 font-serif text-5xl leading-[1.02] text-navy md:text-7xl">Digital guidance should lead toward better human care.</h2></div><p className="max-w-xl text-lg leading-8 text-warm-gray lg:justify-self-end">Ling can explain general information and organise your questions. She does not cross the medical boundary.</p></div>
          <div className="relative mt-16 grid gap-12 md:grid-cols-3 md:gap-5">
            <div className="absolute left-0 right-0 top-[17px] hidden h-px bg-gradient-to-r from-[#b7795e]/20 via-[#b7795e]/65 to-[#b7795e]/20 md:block" />
            {modes.map(([number, title, text]) => <div key={number} className="relative"><span className="relative z-10 inline-grid size-9 place-items-center rounded-full border border-[#b7795e]/50 bg-[#eadccc] text-[9px] font-bold text-terracotta">{number}</span><h3 className="mt-7 font-serif text-3xl text-navy">{title}</h3><p className="mt-3 max-w-[220px] text-sm leading-7 text-warm-gray">{text}</p></div>)}
          </div>
        </div>
      </section>

      <section className="bg-[#15383a] px-5 py-24 text-ivory md:px-8 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-start">
          <div><p className="text-[10px] font-bold uppercase tracking-[.26em] text-[#e5bc98]">What Ling can do</p><h2 className="mt-5 font-serif text-5xl leading-[1.03] md:text-6xl">Explain.<br/>Organise.<br/>Prepare.</h2></div>
          <div className="border-l border-white/16 pl-0 lg:pl-10"><p className="text-[10px] font-bold uppercase tracking-[.26em] text-[#e5bc98]">What Ling will not do</p><h2 className="mt-5 font-serif text-5xl leading-[1.03] md:text-6xl">Diagnose.<br/>Prescribe.<br/>Replace a clinician.</h2></div>
        </div>
      </section>

      <section className="bg-[#f8f3eb] px-5 py-10 md:px-8"><div className="mx-auto max-w-5xl"><DisclaimerBox title="Human review remains central"><p>Personalised diagnosis, prescription and treatment decisions must come from an appropriately qualified professional.</p></DisclaimerBox><div className="mt-8 text-center"><Link href="/register" className="text-sm font-semibold text-deep-green underline decoration-gold underline-offset-4">Create a secure account when you want Ling to remember your journey →</Link></div></div></section>
    </main>
  );
}
