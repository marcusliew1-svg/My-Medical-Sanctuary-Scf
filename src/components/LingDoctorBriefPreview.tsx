"use client";

import { useMemo, useState } from "react";
import { lingHealthKnowledge } from "@/lib/lingHealthRouter";
import { buildLingDoctorBrief, doctorBriefToPlainText } from "@/lib/lingDoctorBrief";

type Props = {
  concernHref: string;
  family: string;
  overlapTitles: string[];
  conversationContext: string[];
  onClose: () => void;
};

export function LingDoctorBriefPreview({ concernHref, family, overlapTitles, conversationContext, onClose }: Props) {
  const slug = concernHref.split("/").filter(Boolean).at(-1) ?? "";
  const concern = lingHealthKnowledge.find((item) => item.slug === slug);
  const [patientWords, setPatientWords] = useState(() => conversationContext.slice(-4));
  const [copied, setCopied] = useState(false);
  const [showClinicalDetail, setShowClinicalDetail] = useState(false);

  const brief = useMemo(() => {
    if (!concern) return null;
    return buildLingDoctorBrief({ concern, family, conversationContext: patientWords, overlapTitles });
  }, [concern, family, overlapTitles, patientWords]);

  if (!brief) return null;

  function updatePatientWord(index: number, value: string) {
    setPatientWords((current) => current.map((item, itemIndex) => (itemIndex === index ? value : item)));
    setCopied(false);
  }

  function removePatientWord(index: number) {
    setPatientWords((current) => current.filter((_, itemIndex) => itemIndex !== index));
    setCopied(false);
  }

  async function copyBrief() {
    if (!brief) return;
    try {
      await navigator.clipboard.writeText(doctorBriefToPlainText(brief));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mt-5 overflow-hidden rounded-[1.75rem] border border-[#c9b68e]/60 bg-[#fbf7ef] shadow-premium">
      <div className="border-b border-[#c9b68e]/35 bg-white px-5 py-5 md:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.16em] text-deep-green">Doctor handoff</p>
            <h4 className="mt-2 font-serif text-3xl text-navy">A short brief for your doctor</h4>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-warm-gray">Ling turns the conversation into a concise starting note. Review your own words, then copy the brief when you are comfortable with it.</p>
          </div>
          <button onClick={onClose} className="rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-semibold text-warm-gray">Close</button>
        </div>
      </div>

      <div className="grid gap-4 p-5 md:p-6">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-4"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-warm-gray">1 · Your words</p><p className="mt-2 text-sm leading-6 text-navy">Keep only what you want the doctor to see.</p></div>
          <div className="rounded-2xl bg-[#edf2ef] p-4"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-deep-green">2 · Ling organises</p><p className="mt-2 text-sm leading-6 text-navy">A concern pathway and useful discussion points.</p></div>
          <div className="rounded-2xl bg-deep-green p-4 text-white"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-white/70">3 · Doctor decides</p><p className="mt-2 text-sm leading-6">Diagnosis, testing and treatment remain with the clinician.</p></div>
        </div>

        <section className="rounded-2xl border border-stone-200 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.14em] text-deep-green">Your own words</p>
              <p className="mt-1 text-xs leading-5 text-warm-gray">Editable patient-reported notes. Nothing here is a clinician finding.</p>
            </div>
            <span className="rounded-full bg-ivory px-3 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-warm-gray">Not saved to a medical record</span>
          </div>
          <div className="mt-4 grid gap-3">
            {patientWords.length ? patientWords.map((item, index) => (
              <div key={`${index}-${item.slice(0, 24)}`} className="grid gap-2 rounded-xl bg-ivory p-3 sm:grid-cols-[1fr_auto] sm:items-start">
                <textarea value={item} onChange={(event) => updatePatientWord(index, event.target.value)} rows={2} className="w-full resize-y rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm leading-6 text-navy outline-none focus:border-deep-green/40" aria-label={`Patient note ${index + 1}`} />
                <button onClick={() => removePatientWord(index)} className="rounded-full border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-warm-gray">Remove</button>
              </div>
            )) : <p className="rounded-xl bg-ivory p-4 text-sm text-warm-gray">No patient wording is currently included.</p>}
          </div>
        </section>

        <section className="rounded-2xl border border-deep-green/15 bg-white p-5">
          <p className="text-[10px] font-bold uppercase tracking-[.14em] text-deep-green">What Ling has organised</p>
          <div className="mt-3 grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
            <div>
              <p className="font-serif text-2xl text-navy">{brief.primaryConcern}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[.12em] text-warm-gray">{brief.concernFamily}</p>
              {brief.possibleOverlaps.length ? <div className="mt-3 flex flex-wrap gap-2">{brief.possibleOverlaps.map((item) => <span key={item} className="rounded-full bg-[#edf2ef] px-3 py-2 text-xs font-semibold text-deep-green">Also consider: {item}</span>)}</div> : null}
            </div>
            <div className="rounded-xl bg-[#f4f8f6] p-4">
              <p className="text-[10px] font-bold uppercase tracking-[.14em] text-deep-green">Two things worth confirming</p>
              <ul className="mt-2 grid gap-2 text-sm leading-6 text-navy">{brief.relevantContext.slice(0, 2).map((item) => <li key={item} className="flex gap-2"><span className="font-bold text-deep-green">•</span><span>{item}</span></li>)}</ul>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[#c9b68e]/45 bg-white p-5">
          <p className="text-[10px] font-bold uppercase tracking-[.14em] text-deep-green">Three questions to take into the consultation</p>
          <div className="mt-3 grid gap-3">{brief.questionsForClinician.slice(0, 3).map((item, index) => <div key={item} className="flex gap-3 rounded-xl bg-ivory px-4 py-3 text-sm leading-6 text-navy"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#edf2ef] text-xs font-bold text-deep-green">{index + 1}</span><span>{item}</span></div>)}</div>
        </section>

        <button onClick={() => setShowClinicalDetail((value) => !value)} className="justify-self-start rounded-full border border-deep-green/20 bg-white px-4 py-2 text-xs font-semibold text-deep-green">{showClinicalDetail ? "Hide clinical detail" : "See clinical detail"}</button>

        {showClinicalDetail ? (
          <div className="grid gap-4 lg:grid-cols-2">
            <section className="rounded-2xl border border-stone-200 bg-white p-5">
              <p className="text-[10px] font-bold uppercase tracking-[.14em] text-deep-green">Assessment areas to discuss</p>
              <div className="mt-3 grid gap-2">{brief.assessmentDiscussion.slice(0, 6).map((item) => <div key={item} className="rounded-xl bg-ivory px-3 py-3 text-sm leading-6 text-navy">{item}</div>)}</div>
            </section>
            <section className="rounded-2xl border border-[#d8b9ad] bg-[#f5ece8] p-5">
              <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#8a5140]">Red flags for the clinician to review</p>
              <p className="mt-2 text-xs leading-5 text-warm-gray">These are not marked present unless you reported them and a clinician confirms the history.</p>
              <ul className="mt-3 grid gap-2 text-sm leading-6 text-navy">{brief.redFlagsToReview.map((item) => <li key={item} className="flex gap-2"><span className="font-bold text-[#8a5140]">!</span><span>{item}</span></li>)}</ul>
            </section>
          </div>
        ) : null}

        <div className="rounded-xl bg-deep-green p-4 text-sm leading-6 text-white"><strong>Doctor-led boundary:</strong> {brief.boundary}</div>

        <div className="flex flex-wrap items-center gap-3">
          <button onClick={copyBrief} className="inline-flex min-h-11 items-center justify-center rounded-full bg-deep-green px-5 text-sm font-semibold text-white">{copied ? "Brief copied" : "Copy brief for my doctor"}</button>
          <button onClick={onClose} className="inline-flex min-h-11 items-center justify-center rounded-full border border-stone-200 bg-white px-5 text-sm font-semibold text-warm-gray">Back to Ling</button>
          <span className="text-xs leading-5 text-warm-gray">Prototype only. Copying stays on your device; saving into My Sanctuary will require authenticated consent and audit controls.</span>
        </div>
      </div>
    </div>
  );
}
