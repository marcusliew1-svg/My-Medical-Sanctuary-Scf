"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { lingDisclaimer, lingOptions } from "@/lib/content";
import { buildLingHealthExplanation, matchHealthConcerns } from "@/lib/lingHealthRouter";
import { getLingClarification, type LingClarification } from "@/lib/lingClarification";
import { matchLingUrgency, type LingUrgencyMatch } from "@/lib/lingUrgency";

const guidance: Record<string, { text: string; href: string; label: string }> = {
  "I want a health screening": {
    text: "A health screening is usually the clearest first step because it gives your MMS doctor a baseline before any wellness plan is discussed.",
    href: "/health-screening",
    label: "View Health Screening",
  },
  "I want to improve my energy": {
    text: "Energy concerns can involve sleep, nutrition, stress, metabolic health and lifestyle patterns. MMS starts with discovery and screening before personalised recommendations.",
    href: "/health-concerns/unexplained-fatigue-low-energy",
    label: "Understand Low Energy",
  },
  "I want to manage my weight": {
    text: "Weight management works best as a structured journey that considers body composition, blood pressure, glucose, liver health, sleep, habits and professional suitability review.",
    href: "/health-concerns/weight-gain-metabolic-health",
    label: "Understand Metabolic Health",
  },
  "I want to learn about longevity": {
    text: "Longevity at MMS is positioned around prevention, measurable baselines, doctor-led review and long-term planning rather than random purchases.",
    href: "/longevity-medicine",
    label: "View Longevity Medicine",
  },
  "I want to understand medicine access": {
    text: "Medicine access can vary between countries because of registration, supply, currency, tax and pharmacy rules. MMS can help frame the access discussion safely.",
    href: "/international-medicine-access",
    label: "View Medicine Access",
  },
  "I want to understand the SCF lab roadmap": {
    text: "SCF is best understood as a future capability roadmap. Public information should stay careful until regulatory, licensing and professional requirements are confirmed.",
    href: "/scf-lab-roadmap",
    label: "View Lab Roadmap",
  },
  "I'm looking for regenerative medicine": {
    text: "Regenerative medicine is not one treatment. The exact problem, product, procedure, evidence and regulatory status matter, so Ling can help you understand the options before a qualified professional assesses suitability.",
    href: "/treatments/research",
    label: "Research Treatment Options",
  },
  "I'm not sure where to start": {
    text: "Start with discovery. MMS can help you organise your health goals, identify which concerns deserve assessment and decide the next step with a qualified professional.",
    href: "/health-discovery",
    label: "Start Discovery",
  },
};

export function LingPanel() {
  const [selected, setSelected] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [askedQuestion, setAskedQuestion] = useState("");
  const [healthAnswer, setHealthAnswer] = useState<ReturnType<typeof buildLingHealthExplanation> | null>(null);
  const [clarification, setClarification] = useState<LingClarification | null>(null);
  const [urgency, setUrgency] = useState<LingUrgencyMatch | null>(null);
  const [conversationContext, setConversationContext] = useState<string[]>([]);
  const selectedGuidance = selected ? guidance[selected] : null;

  function routeQuestion(clean: string, priorContext: string[] = conversationContext) {
    const nextContext = [...priorContext, clean].slice(-4);
    const combined = nextContext.join(" ");

    // Urgency always wins. When a conservative emergency rule matches, suppress normal
    // concern, treatment, screening and promotional routing until the patient starts over.
    const urgent = matchLingUrgency(combined) ?? matchLingUrgency(clean);
    if (urgent) {
      setUrgency(urgent);
      setHealthAnswer(null);
      setClarification(null);
      setSelected(null);
      setConversationContext(nextContext);
      return;
    }

    const result = matchHealthConcerns(combined);
    if (result) {
      setUrgency(null);
      setHealthAnswer(buildLingHealthExplanation(result));
      setClarification(null);
      setSelected(null);
      setConversationContext(nextContext);
      return;
    }

    const followUp = getLingClarification(combined) ?? getLingClarification(clean);
    if (followUp) {
      setUrgency(null);
      setClarification(followUp);
      setHealthAnswer(null);
      setSelected(null);
      setConversationContext(nextContext);
      return;
    }

    setUrgency(null);
    setHealthAnswer(null);
    setClarification(null);
    setSelected("I'm not sure where to start");
    setConversationContext(nextContext);
  }

  function askLing() {
    const clean = question.trim();
    if (!clean) return;
    setAskedQuestion(clean);
    routeQuestion(clean);
    setQuestion("");
  }

  function useSuggestedPrompt(prompt: string) {
    setAskedQuestion(prompt);
    routeQuestion(prompt);
  }

  function reset() {
    setSelected(null);
    setAskedQuestion("");
    setHealthAnswer(null);
    setClarification(null);
    setUrgency(null);
    setConversationContext([]);
  }

  return (
    <div className="rounded-lg border border-gold-light/50 bg-white/[0.94] p-6 shadow-premium md:p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Ling</p>
          <h3 className="mt-2 font-serif text-3xl text-navy">What brings you here today?</h3>
        </div>
        <span className="relative size-16 overflow-hidden rounded-full border-2 border-gold-light bg-ivory shadow-soft">
          <Image src="/ling-mms-guide.png" alt="Ling, the MMS intelligent health guide" fill className="object-cover object-[50%_24%]" sizes="64px" />
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {lingOptions.map((option) => (
          <button
            key={option}
            onClick={() => { setSelected(option); setHealthAnswer(null); setClarification(null); setUrgency(null); setAskedQuestion(""); setConversationContext([]); }}
            className={`rounded-lg border px-4 py-3 text-left text-sm font-medium transition duration-300 ${selected === option ? "border-gold bg-ivory text-navy shadow-soft" : "border-stone-200 bg-white text-stone-700 hover:border-gold-light hover:bg-ivory"}`}
          >
            {option}
          </button>
        ))}
      </div>

      {conversationContext.length > 0 ? (
        <div className="mt-5 rounded-2xl border border-stone-200 bg-[#faf9f6] px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-[.14em] text-warm-gray">Ling is keeping this conversation in context</p>
          <div className="mt-2 flex flex-wrap gap-2">{conversationContext.map((item,index)=><span key={`${item}-${index}`} className="rounded-full bg-white px-3 py-1.5 text-xs text-navy shadow-sm">{item}</span>)}</div>
        </div>
      ) : null}

      <div className="mt-5 flex gap-2 rounded-2xl border border-stone-200 bg-white p-2 shadow-soft">
        <input value={question} onChange={(event)=>setQuestion(event.target.value)} onKeyDown={(event)=>{if(event.key==="Enter") askLing();}} aria-label="Ask Ling a health journey question" placeholder={clarification ? "Add the next detail — Ling will keep your earlier answer in context…" : "Or ask in your own words — e.g. ‘Why am I always tired?’"} className="min-w-0 flex-1 bg-transparent px-3 text-sm text-navy outline-none" />
        <button onClick={askLing} className="shrink-0 rounded-xl bg-deep-green px-4 py-3 text-sm font-semibold text-white">{clarification ? "Add detail" : "Ask Ling"}</button>
      </div>

      {urgency ? (
        <div className="mt-5 overflow-hidden rounded-2xl border border-[#a94a3d]/40 bg-[#fff4f1] shadow-soft">
          {askedQuestion ? <p className="border-b border-[#a94a3d]/20 bg-white px-5 py-4 text-sm italic text-warm-gray">“{askedQuestion}”</p> : null}
          <div className="p-5 md:p-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-[#8f382e]"><span className="grid size-6 place-items-center rounded-full bg-[#8f382e] text-xs text-white">!</span>Urgent medical priority</div>
            <h4 className="mt-4 font-serif text-3xl text-[#57231d]">{urgency.title}</h4>
            <p className="mt-4 text-sm leading-7 text-navy">{urgency.message}</p>
            <div className="mt-4 rounded-xl bg-[#8f382e] p-4 text-sm font-semibold leading-6 text-white">{urgency.action}</div>
            <p className="mt-4 text-xs leading-5 text-warm-gray">Ling is intentionally not showing treatments, wellness options, screening packages or routine booking pathways here. In a possible emergency, urgent assessment takes priority.</p>
            <button onClick={reset} className="mt-5 inline-flex min-h-10 items-center justify-center rounded-full border border-[#8f382e]/30 bg-white px-4 text-sm font-semibold text-[#8f382e]">Start a new Ling conversation</button>
          </div>
        </div>
      ) : null}

      {clarification ? (
        <div className="mt-5 overflow-hidden rounded-2xl border border-[#c9b68e]/55 bg-[#fbf7ef]">
          {askedQuestion ? <p className="border-b border-[#c9b68e]/30 bg-white px-5 py-4 text-sm italic text-warm-gray">“{askedQuestion}”</p> : null}
          <div className="p-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-deep-green"><span className="size-2 rounded-full bg-[#b89b63]" />Ling needs a little more context</div>
            <p className="mt-3 text-sm leading-6 text-navy">{clarification.intro}</p>

            <div className="mt-4 rounded-xl bg-white p-4">
              <p className="text-[10px] font-bold uppercase tracking-[.14em] text-deep-green">Useful things to tell Ling</p>
              <div className="mt-3 grid gap-3">{clarification.questions.map((item,index)=><div key={item} className="flex gap-3 text-sm leading-6 text-navy"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#edf2ef] text-[10px] font-bold text-deep-green">{index+1}</span><span>{item}</span></div>)}</div>
            </div>

            <div className="mt-4">
              <p className="text-[10px] font-bold uppercase tracking-[.14em] text-warm-gray">Or choose the closest description</p>
              <div className="mt-3 flex flex-wrap gap-2">{clarification.suggestedPrompts.map((prompt)=><button key={prompt} onClick={()=>useSuggestedPrompt(prompt)} className="rounded-full border border-deep-green/15 bg-white px-3 py-2 text-xs font-semibold text-deep-green transition hover:border-deep-green">{prompt}</button>)}</div>
            </div>

            <div className="mt-4 rounded-xl bg-[#edf2ef] px-4 py-3 text-xs leading-5 text-warm-gray">Ling will combine what you tell her across the next few messages. The goal is to find a useful concern pathway, not to turn the conversation into a diagnosis.</div>
            <div className="mt-4 flex flex-wrap gap-2"><Link href="/health-discovery" className="inline-flex min-h-10 items-center justify-center rounded-full bg-deep-green px-4 text-sm font-semibold text-white">Start health discovery</Link><Link href="/online-doctor" className="inline-flex min-h-10 items-center justify-center rounded-full border border-gold px-4 text-sm font-semibold text-navy">Ask a doctor</Link><button onClick={reset} className="px-3 text-sm text-warm-gray underline">Start again</button></div>
          </div>
        </div>
      ) : null}

      {healthAnswer ? (
        <div className="mt-5 overflow-hidden rounded-2xl border border-deep-green/20 bg-ivory">
          {askedQuestion ? <p className="border-b border-deep-green/10 bg-white px-5 py-4 text-sm italic text-warm-gray">“{askedQuestion}”</p> : null}
          <div className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-deep-green"><span className="size-2 animate-pulse rounded-full bg-deep-green" />Ling found a relevant health-concern pathway</div>
              <span className="rounded-full bg-[#dfe9e3] px-3 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-deep-green">{healthAnswer.family}</span>
            </div>
            <h4 className="mt-3 font-serif text-2xl text-navy">{healthAnswer.title}</h4>

            <div className="mt-5 grid gap-3">
              <div className="rounded-xl bg-white p-4"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-deep-green">The short answer</p><p className="mt-2 text-sm leading-6 text-navy">{healthAnswer.directAnswer}</p></div>
              <div className="rounded-xl bg-[#edf2ef] p-4"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-deep-green">What that actually means</p><p className="mt-2 text-sm leading-6 text-navy">{healthAnswer.whatItMeans}</p></div>
              <div className="rounded-xl bg-white p-4"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-deep-green">What may be worth checking</p><ul className="mt-2 grid gap-2 text-sm leading-6 text-navy">{healthAnswer.worthChecking.map((item)=><li key={item} className="flex gap-2"><span className="font-bold text-deep-green">•</span><span>{item}</span></li>)}</ul></div>
              <div className="rounded-xl border border-deep-green/15 bg-[#eef4f1] p-4"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-deep-green">A sensible starting route</p><p className="mt-2 text-sm leading-6 text-navy">{healthAnswer.routeLabel}</p></div>
              <div className="rounded-xl border border-stone-200 bg-white p-4"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-warm-gray">Treatment topics people may discuss</p><div className="mt-3 grid gap-2">{healthAnswer.possibleTopics.map((topic)=><div key={topic.label} className="rounded-lg bg-ivory px-3 py-3"><p className="text-sm font-semibold text-navy">{topic.label}</p><p className="mt-1 text-xs leading-5 text-warm-gray">{topic.note}</p></div>)}</div></div>
              {healthAnswer.overlaps.length ? <div className="rounded-xl border border-stone-200 bg-white p-4"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-warm-gray">This can overlap with other health concerns</p><p className="mt-2 text-xs leading-5 text-warm-gray">Symptoms do not always belong to one category. These related guides may also be useful to discuss, depending on your history.</p><div className="mt-3 flex flex-wrap gap-2">{healthAnswer.overlaps.map((item)=><Link key={item.href} href={item.href} className="rounded-full border border-deep-green/15 bg-ivory px-3 py-2 text-xs font-semibold text-deep-green">{item.title} →</Link>)}</div></div> : null}
            </div>

            <div className="mt-4 rounded-xl bg-[#f5ece8] px-4 py-3 text-xs leading-5 text-navy"><strong className="text-[#8a5140]">Seek prompt medical care if relevant:</strong> {healthAnswer.redFlags.join(" · ")}</div>
            <div className="mt-4 rounded-xl bg-deep-green px-4 py-4 text-sm leading-6 text-white"><strong>Where Ling stops:</strong> I can help you understand the possibilities, show where concerns may overlap and prepare better questions. A qualified healthcare professional needs to review your personal history, examination, tests and treatment suitability.</div>

            <div className="mt-4 flex flex-wrap gap-2"><Link href={healthAnswer.concernHref} className="inline-flex min-h-10 items-center justify-center rounded-full bg-deep-green px-4 text-sm font-semibold text-white">Read the full concern guide</Link><Link href="/online-doctor" className="inline-flex min-h-10 items-center justify-center rounded-full border border-gold px-4 text-sm font-semibold text-navy">Ask a doctor</Link><button onClick={reset} className="px-3 text-sm text-warm-gray underline">Start again</button></div>
          </div>
        </div>
      ) : null}

      {selectedGuidance ? (
        <div className="mt-5 rounded-lg border border-gold-light/50 bg-ivory p-5">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-deep-green"><span className="size-2 animate-pulse rounded-full bg-deep-green" />Ling has prepared a next step</div>
          {askedQuestion ? <p className="mb-3 rounded-xl bg-white px-4 py-3 text-sm italic text-warm-gray">“{askedQuestion}”</p> : null}
          <p className="text-sm leading-6 text-stone-600">{selectedGuidance.text}</p>
          <div className="mt-4 flex flex-wrap gap-2"><Link href={selectedGuidance.href} className="inline-flex min-h-10 items-center justify-center rounded-full bg-deep-green px-4 text-sm font-semibold text-white">{selectedGuidance.label}</Link><Link href="/online-doctor" className="inline-flex min-h-10 items-center justify-center rounded-full border border-gold px-4 text-sm font-semibold text-navy">Ask a doctor</Link><button onClick={reset} className="px-3 text-sm text-warm-gray underline">Start again</button></div>
        </div>
      ) : null}
      <p className="mt-5 text-xs leading-6 text-stone-500">{lingDisclaimer}</p>
    </div>
  );
}
