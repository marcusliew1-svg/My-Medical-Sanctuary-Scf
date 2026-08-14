"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LingDoctorBriefPreview } from "@/components/LingDoctorBriefPreview";
import { lingDisclaimer, lingOptions } from "@/lib/content";
import { buildLingHealthExplanation, matchHealthConcerns } from "@/lib/lingHealthRouter";
import { buildLingTreatmentExplanation, matchLingTreatment } from "@/lib/lingTreatmentRouter";
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
  const [treatmentAnswer, setTreatmentAnswer] = useState<ReturnType<typeof buildLingTreatmentExplanation> | null>(null);
  const [clarification, setClarification] = useState<LingClarification | null>(null);
  const [urgency, setUrgency] = useState<LingUrgencyMatch | null>(null);
  const [conversationContext, setConversationContext] = useState<string[]>([]);
  const [showDoctorBrief, setShowDoctorBrief] = useState(false);
  const [showHealthDetails, setShowHealthDetails] = useState(false);
  const [showTreatmentDetails, setShowTreatmentDetails] = useState(false);
  const selectedGuidance = selected ? guidance[selected] : null;

  function routeQuestion(clean: string, priorContext: string[] = conversationContext) {
    const nextContext = [...priorContext, clean].slice(-4);
    const combined = nextContext.join(" ");
    setShowDoctorBrief(false);
    setShowHealthDetails(false);
    setShowTreatmentDetails(false);

    const urgent = matchLingUrgency(combined) ?? matchLingUrgency(clean);
    if (urgent) {
      setUrgency(urgent);
      setHealthAnswer(null);
      setTreatmentAnswer(null);
      setClarification(null);
      setSelected(null);
      setConversationContext(nextContext);
      return;
    }

    const result = matchHealthConcerns(combined);
    if (result) {
      setUrgency(null);
      setHealthAnswer(buildLingHealthExplanation(result));
      setTreatmentAnswer(null);
      setClarification(null);
      setSelected(null);
      setConversationContext(nextContext);
      return;
    }

    const treatment = matchLingTreatment(combined) ?? matchLingTreatment(clean);
    if (treatment) {
      setUrgency(null);
      setHealthAnswer(null);
      setTreatmentAnswer(buildLingTreatmentExplanation(treatment));
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
      setTreatmentAnswer(null);
      setSelected(null);
      setConversationContext(nextContext);
      return;
    }

    setUrgency(null);
    setHealthAnswer(null);
    setTreatmentAnswer(null);
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

  function handleSuggestedPrompt(prompt: string) {
    setAskedQuestion(prompt);
    routeQuestion(prompt);
  }

  function reset() {
    setSelected(null);
    setAskedQuestion("");
    setHealthAnswer(null);
    setTreatmentAnswer(null);
    setClarification(null);
    setUrgency(null);
    setConversationContext([]);
    setShowDoctorBrief(false);
    setShowHealthDetails(false);
    setShowTreatmentDetails(false);
  }

  const hasActiveJourney = Boolean(clarification || healthAnswer || treatmentAnswer || selectedGuidance);

  return (
    <div className="rounded-[28px] border border-gold-light/45 bg-white/[0.96] p-5 shadow-premium md:p-8">
      <div className="flex items-start justify-between gap-5">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Ling · Your MMS health guide</p>
          <h3 className="mt-2 font-serif text-3xl text-navy md:text-4xl">Tell me what is bothering you.</h3>
          <p className="mt-3 text-sm leading-6 text-warm-gray">Use normal words. I’ll help organise what you tell me, explain what may be worth checking and show when a clinician should take over.</p>
        </div>
        <span className="relative size-16 shrink-0 overflow-hidden rounded-full border-2 border-gold-light bg-ivory shadow-soft md:size-20">
          <Image src="/ling-mms-guide.png" alt="Ling, the MMS intelligent health guide" fill className="object-cover object-[50%_24%]" sizes="80px" />
        </span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl bg-[#f4f6f4] p-2 text-center text-[10px] font-bold uppercase tracking-[.1em] text-warm-gray">
        <div className="rounded-xl bg-white px-2 py-2 text-deep-green shadow-sm">1 · Tell Ling</div>
        <div className={`rounded-xl px-2 py-2 ${hasActiveJourney || urgency ? "bg-white text-deep-green shadow-sm" : ""}`}>2 · Understand</div>
        <div className={`rounded-xl px-2 py-2 ${healthAnswer || treatmentAnswer || urgency ? "bg-white text-deep-green shadow-sm" : ""}`}>3 · Next step</div>
      </div>

      {!urgency ? (
        <>
          {!hasActiveJourney && conversationContext.length === 0 ? (
            <div className="mt-5">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[.14em] text-warm-gray">Quick starts</p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {lingOptions.slice(0, 4).map((option) => (
                  <button
                    key={option}
                    onClick={() => { setSelected(option); setHealthAnswer(null); setTreatmentAnswer(null); setClarification(null); setUrgency(null); setAskedQuestion(""); setConversationContext([]); setShowDoctorBrief(false); }}
                    className="rounded-xl border border-stone-200 bg-white px-4 py-3 text-left text-sm font-medium text-stone-700 transition hover:border-gold-light hover:bg-ivory"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {conversationContext.length > 1 ? (
            <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-stone-200 bg-[#faf9f6] px-4 py-2.5">
              <p className="text-xs text-warm-gray"><span className="font-semibold text-deep-green">Using your earlier answers</span> · {conversationContext.length} recent details in this conversation</p>
              <button onClick={reset} className="shrink-0 text-xs font-semibold text-warm-gray underline">Start over</button>
            </div>
          ) : null}

          <div className="mt-5 flex gap-2 rounded-2xl border border-stone-200 bg-white p-2 shadow-soft focus-within:border-deep-green/35">
            <input
              value={question}
              onChange={(event)=>setQuestion(event.target.value)}
              onKeyDown={(event)=>{if(event.key==="Enter") askLing();}}
              aria-label="Ask Ling a health journey question"
              placeholder={hasActiveJourney ? "Add the next detail…" : "For example: ‘I’ve been tired for months and gaining weight.’"}
              className="min-w-0 flex-1 bg-transparent px-3 text-sm text-navy outline-none"
            />
            <button onClick={askLing} className="shrink-0 rounded-xl bg-deep-green px-4 py-3 text-sm font-semibold text-white">{hasActiveJourney ? "Tell Ling" : "Ask Ling"}</button>
          </div>
        </>
      ) : null}

      {urgency ? (
        <div className="mt-5 overflow-hidden rounded-2xl border border-[#a94a3d]/40 bg-[#fff4f1] shadow-soft">
          {askedQuestion ? <p className="border-b border-[#a94a3d]/20 bg-white px-5 py-4 text-sm italic text-warm-gray">“{askedQuestion}”</p> : null}
          <div className="p-5 md:p-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-[#8f382e]"><span className="grid size-7 place-items-center rounded-full bg-[#8f382e] text-sm text-white">!</span>Urgent medical priority</div>
            <h4 className="mt-4 font-serif text-3xl text-[#57231d]">{urgency.title}</h4>
            <p className="mt-4 text-sm leading-7 text-navy">{urgency.message}</p>
            <div className="mt-4 rounded-xl bg-[#8f382e] p-4 text-sm font-semibold leading-6 text-white">{urgency.action}</div>
            <p className="mt-4 text-xs leading-5 text-warm-gray">Ling will not continue into treatment, wellness, screening or routine booking while this warning pattern is present.</p>
            <button onClick={reset} className="mt-5 inline-flex min-h-10 items-center justify-center rounded-full border border-[#8f382e]/30 bg-white px-4 text-sm font-semibold text-[#8f382e]">Start a new conversation</button>
          </div>
        </div>
      ) : null}

      {clarification ? (
        <div className="mt-5 overflow-hidden rounded-2xl border border-[#c9b68e]/55 bg-[#fbf7ef]">
          {askedQuestion ? <p className="border-b border-[#c9b68e]/30 bg-white px-5 py-4 text-sm italic text-warm-gray">“{askedQuestion}”</p> : null}
          <div className="p-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-deep-green"><span className="size-2 rounded-full bg-[#b89b63]" />A little more context will help</div>
            <p className="mt-3 text-sm leading-6 text-navy">{clarification.intro}</p>

            <div className="mt-4 rounded-xl bg-white p-4">
              <p className="text-[10px] font-bold uppercase tracking-[.14em] text-deep-green">Tell me whichever is easiest</p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">{clarification.questions.slice(0, 4).map((item,index)=><div key={item} className="flex gap-3 text-sm leading-6 text-navy"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#edf2ef] text-[10px] font-bold text-deep-green">{index+1}</span><span>{item}</span></div>)}</div>
            </div>

            <div className="mt-4">
              <p className="text-[10px] font-bold uppercase tracking-[.14em] text-warm-gray">Or tap the closest description</p>
              <div className="mt-3 flex flex-wrap gap-2">{clarification.suggestedPrompts.slice(0, 4).map((prompt)=><button key={prompt} onClick={()=>handleSuggestedPrompt(prompt)} className="rounded-full border border-deep-green/15 bg-white px-3 py-2 text-xs font-semibold text-deep-green transition hover:border-deep-green">{prompt}</button>)}</div>
            </div>

            <p className="mt-4 text-xs leading-5 text-warm-gray">Ling keeps only the recent details needed for this prototype conversation. This step helps choose a useful health pathway; it is not a diagnosis.</p>
          </div>
        </div>
      ) : null}

      {healthAnswer ? (
        <div className="mt-5 overflow-hidden rounded-2xl border border-deep-green/20 bg-ivory">
          {askedQuestion ? <p className="border-b border-deep-green/10 bg-white px-5 py-4 text-sm italic text-warm-gray">“{askedQuestion}”</p> : null}
          <div className="p-5 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-deep-green"><span className="size-2 rounded-full bg-deep-green" />A useful place to start</div>
              <span className="rounded-full bg-[#dfe9e3] px-3 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-deep-green">{healthAnswer.family}</span>
            </div>
            <h4 className="mt-3 font-serif text-3xl text-navy">{healthAnswer.title}</h4>
            <p className="mt-3 text-sm leading-7 text-navy">{healthAnswer.conversationLead}</p>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <div className="rounded-xl bg-white p-4"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-deep-green">What this may mean</p><p className="mt-2 text-sm leading-6 text-navy">{healthAnswer.directAnswer}</p><p className="mt-2 text-xs leading-5 text-warm-gray">{healthAnswer.whatItMeans}</p></div>
              <div className="rounded-xl border border-deep-green/15 bg-[#eef4f1] p-4"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-deep-green">Best starting route</p><p className="mt-2 text-sm leading-6 text-navy">{healthAnswer.routeLabel}</p></div>
            </div>

            <div className="mt-3 rounded-xl bg-white p-4"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-deep-green">What may be worth checking first</p><ul className="mt-3 grid gap-2 text-sm leading-6 text-navy md:grid-cols-2">{healthAnswer.worthChecking.slice(0, 6).map((item)=><li key={item} className="flex gap-2"><span className="font-bold text-deep-green">•</span><span>{item}</span></li>)}</ul></div>

            <div className="mt-3 rounded-xl border border-[#c9b68e]/45 bg-[#fbf7ef] p-4">
              <p className="text-[10px] font-bold uppercase tracking-[.14em] text-deep-green">If you want to continue with Ling</p>
              <p className="mt-2 text-xs leading-5 text-warm-gray">Add whichever detail matters most in the box above.</p>
              <div className="mt-3 flex flex-wrap gap-2">{healthAnswer.followUpQuestions.slice(0, 3).map((item)=><button key={item} onClick={()=>{setQuestion(item);}} className="rounded-full border border-deep-green/15 bg-white px-3 py-2 text-left text-xs font-semibold text-deep-green">{item}</button>)}</div>
            </div>

            <div className="mt-4 rounded-xl bg-[#f5ece8] px-4 py-3 text-xs leading-5 text-navy"><strong className="text-[#8a5140]">Get prompt medical care if relevant:</strong> {healthAnswer.redFlags.join(" · ")}</div>

            <button onClick={()=>setShowHealthDetails((value)=>!value)} className="mt-4 text-sm font-semibold text-deep-green underline underline-offset-4">{showHealthDetails ? "Hide extra detail" : "See treatment topics and related concerns"}</button>

            {showHealthDetails ? (
              <div className="mt-4 grid gap-3">
                <div className="rounded-xl border border-stone-200 bg-white p-4"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-warm-gray">Treatment topics people may discuss</p><div className="mt-3 grid gap-2 md:grid-cols-2">{healthAnswer.possibleTopics.map((topic)=><div key={topic.label} className="rounded-lg bg-ivory px-3 py-3"><p className="text-sm font-semibold text-navy">{topic.label}</p><p className="mt-1 text-xs leading-5 text-warm-gray">{topic.note}</p></div>)}</div></div>
                {healthAnswer.overlaps.length ? <div className="rounded-xl border border-stone-200 bg-white p-4"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-warm-gray">Related concerns that can overlap</p><div className="mt-3 flex flex-wrap gap-2">{healthAnswer.overlaps.map((item)=><Link key={item.href} href={item.href} className="rounded-full border border-deep-green/15 bg-ivory px-3 py-2 text-xs font-semibold text-deep-green">{item.title} →</Link>)}</div></div> : null}
                <div className="rounded-xl bg-deep-green px-4 py-4 text-sm leading-6 text-white"><strong>Where Ling stops:</strong> a qualified healthcare professional still needs to review your personal history, examination, tests and treatment suitability.</div>
              </div>
            ) : null}

            <div className="mt-5 flex flex-wrap gap-2">
              <button onClick={()=>setShowDoctorBrief(true)} className="inline-flex min-h-10 items-center justify-center rounded-full bg-deep-green px-4 text-sm font-semibold text-white">Prepare my doctor brief</button>
              <Link href={healthAnswer.concernHref} className="inline-flex min-h-10 items-center justify-center rounded-full border border-deep-green/20 bg-white px-4 text-sm font-semibold text-deep-green">Read the concern guide</Link>
              <Link href="/online-doctor" className="inline-flex min-h-10 items-center justify-center rounded-full border border-gold px-4 text-sm font-semibold text-navy">Ask a doctor</Link>
              <button onClick={reset} className="px-3 text-sm text-warm-gray underline">Start again</button>
            </div>
          </div>
        </div>
      ) : null}

      {healthAnswer && showDoctorBrief && !urgency ? <LingDoctorBriefPreview concernHref={healthAnswer.concernHref} family={healthAnswer.family} overlapTitles={healthAnswer.overlaps.map((item)=>item.title)} conversationContext={conversationContext} onClose={()=>setShowDoctorBrief(false)} /> : null}

      {treatmentAnswer ? (
        <div className="mt-5 overflow-hidden rounded-2xl border border-[#c9b68e]/55 bg-[#fbf7ef]">
          {askedQuestion ? <p className="border-b border-[#c9b68e]/30 bg-white px-5 py-4 text-sm italic text-warm-gray">“{askedQuestion}”</p> : null}
          <div className="p-5 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2"><div className="text-xs font-bold uppercase tracking-[.14em] text-deep-green">Treatment explained</div><span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-deep-green">{treatmentAnswer.evidence}</span></div>
            <h4 className="mt-3 font-serif text-3xl text-navy">{treatmentAnswer.name}</h4>
            <p className="mt-2 text-xs font-bold uppercase tracking-[.14em] text-warm-gray">{treatmentAnswer.eyebrow}</p>

            <div className="mt-4 rounded-xl bg-white p-4"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-deep-green">In plain English</p><p className="mt-2 text-sm leading-6 text-navy">{treatmentAnswer.plainEnglish}</p></div>
            <div className="mt-3 rounded-xl bg-[#edf2ef] p-4"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-deep-green">What the evidence means</p><p className="mt-2 text-sm leading-6 text-navy">{treatmentAnswer.evidenceNote}</p></div>
            <div className="mt-3 rounded-xl bg-[#f5ece8] p-4"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#8a5140]">What to be cautious about</p><ul className="mt-3 grid gap-2 text-sm leading-6 text-navy md:grid-cols-2">{treatmentAnswer.caution.map(item=><li key={item} className="flex gap-2"><span className="text-[#8a5140]">!</span><span>{item}</span></li>)}</ul></div>

            {treatmentAnswer.relatedConcerns.length ? <div className="mt-3 rounded-xl border border-stone-200 bg-white p-4"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-warm-gray">Is there a symptom behind your treatment question?</p><p className="mt-2 text-xs leading-5 text-warm-gray">If so, start with the health concern rather than assuming the treatment is the answer.</p><div className="mt-3 flex flex-wrap gap-2">{treatmentAnswer.relatedConcerns.map(item=><Link key={item.href} href={item.href} className="rounded-full border border-deep-green/15 bg-ivory px-3 py-2 text-xs font-semibold text-deep-green">{item.label} →</Link>)}</div></div> : null}

            <button onClick={()=>setShowTreatmentDetails((value)=>!value)} className="mt-4 text-sm font-semibold text-deep-green underline underline-offset-4">{showTreatmentDetails ? "Hide extra detail" : "Why people ask about this + questions for a clinician"}</button>

            {showTreatmentDetails ? <div className="mt-4 grid gap-3 md:grid-cols-2"><div className="rounded-xl bg-white p-4"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-deep-green">Why people ask about it</p><ul className="mt-3 grid gap-2 text-sm leading-6 text-navy">{treatmentAnswer.whyPeopleAsk.map(item=><li key={item} className="flex gap-2"><span className="text-deep-green">•</span><span>{item}</span></li>)}</ul></div><div className="rounded-xl border border-[#c9b68e]/45 bg-white p-4"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-deep-green">Questions worth taking to a clinician</p><div className="mt-3 grid gap-2">{treatmentAnswer.doctorQuestions.map((item,index)=><div key={item} className="flex gap-3 text-sm leading-6 text-navy"><span className="font-serif text-lg text-deep-green">0{index+1}</span><span>{item}</span></div>)}</div></div></div> : null}

            <div className="mt-4 rounded-xl bg-deep-green px-4 py-4 text-sm leading-6 text-white"><strong>Ling is not deciding suitability:</strong> understanding a treatment is different from deciding whether it is appropriate for you. A qualified professional must make that decision.</div>
            <div className="mt-5 flex flex-wrap gap-2"><Link href={treatmentAnswer.href} className="inline-flex min-h-10 items-center justify-center rounded-full bg-deep-green px-4 text-sm font-semibold text-white">Read the full treatment guide</Link><Link href="/online-doctor" className="inline-flex min-h-10 items-center justify-center rounded-full border border-gold px-4 text-sm font-semibold text-navy">Ask a doctor</Link><Link href="/treatments/research" className="inline-flex min-h-10 items-center justify-center rounded-full border border-stone-200 bg-white px-4 text-sm font-semibold text-deep-green">Research library</Link><button onClick={reset} className="px-3 text-sm text-warm-gray underline">Start again</button></div>
          </div>
        </div>
      ) : null}

      {selectedGuidance ? (
        <div className="mt-5 rounded-2xl border border-gold-light/50 bg-ivory p-5">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-deep-green"><span className="size-2 rounded-full bg-deep-green" />A simple next step</div>
          <p className="text-sm leading-6 text-stone-600">{selectedGuidance.text}</p>
          <div className="mt-4 flex flex-wrap gap-2"><Link href={selectedGuidance.href} className="inline-flex min-h-10 items-center justify-center rounded-full bg-deep-green px-4 text-sm font-semibold text-white">{selectedGuidance.label}</Link><Link href="/online-doctor" className="inline-flex min-h-10 items-center justify-center rounded-full border border-gold px-4 text-sm font-semibold text-navy">Ask a doctor</Link><button onClick={reset} className="px-3 text-sm text-warm-gray underline">Start again</button></div>
        </div>
      ) : null}

      <p className="mt-5 text-xs leading-6 text-stone-500">{lingDisclaimer}</p>
    </div>
  );
}
