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

  const brief = useMemo(() => {
    if (!concern) return null;
    return buildLingDoctorBrief({
      concern,
      family,
      conversationContext: patientWords,
      overlapTitles,
    });
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
            <p className="text-[10px] font-bold uppercase tracking-[.16em] text-deep-green">Preview before sharing</p>
            <h4 className="mt-2 font-serif text-3xl text-navy">Your Ling Doctor Brief</h4>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-warm-gray">Review the wording below. You can edit or remove your own conversation lines before copying the brief. Nothing here is being saved to a medical record.</p>
          </div>
          <button onClick={onClose} className="rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-semibold text-warm-gray">Close preview</button>
        </div>
      </div>

      <div className="grid gap-4 p-5 md:p-6">
        <section className="rounded-2xl border border-stone-200 bg-white p-5">
          <p className="text-[10px] font-bold uppercase tracking-[.14em] text-deep-green">1. Your own words</p>
          <p className="mt-2 text-xs leading-5 text-warm-gray">These are patient-reported notes, not clinician findings.</p>
          <div className="mt-4 grid gap-3">
            {patientWords.length ? patientWords.map((item, index) => (
              <div key={`${index}-${item.slice(0, 24)}`} className="grid gap-2 rounded-xl bg-ivory p-3 sm:grid-cols-[1fr_auto] sm:items-start">
                <textarea value={item} onChange={(event) => updatePatientWord(index, event.target.value)} rows={2} className="w-full resize-y rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm leading-6 text-navy outline-none focus:border-deep-green/40" aria-label={`Patient note ${index + 1}`} />
                <button onClick={() => removePatientWord(index)} className="rounded-full border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-warm-gray">Remove</button>
              </div>
            )) : <p className="rounded-xl bg-ivory p-4 text-sm text-warm-gray">No patient wording is currently included.</p>}
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-2xl border border-stone-200 bg-white p-5">
            <p className="text-[10px] font-bold uppercase tracking-[.14em] text-deep-green">2. Ling-organised pathway</p>
            <p className="mt-3 font-serif text-2xl text-navy">{brief.primaryConcern}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[.12em] text-warm-gray">{brief.concernFamily}</p>
            {brief.possibleOverlaps.length ? <div className="mt-4 flex flex-wrap gap-2">{brief.possibleOverlaps.map((item) => <span key={item} className="rounded-full bg-[#edf2ef] px-3 py-2 text-xs font-semibold text-deep-green">{item}</span>)}</div> : null}
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-5">
            <p className="text-[10px] font-bold uppercase tracking-[.14em] text-deep-green">3. Context to confirm</p>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-navy">{brief.relevantContext.map((item) => <li key={item} className="flex gap-2"><span className="font-bold text-deep-green">•</span><span>{item}</span></li>)}</ul>
          </section>
        </div>

        <section className="rounded-2xl border border-stone-200 bg-white p-5">
          <p className="text-[10px] font-bold uppercase tracking-[.14em] text-deep-green">4. Assessment areas to discuss</p>
          <div className="mt-3 grid gap-2 md:grid-cols-2">{brief.assessmentDiscussion.map((item) => <div key={item} className="rounded-xl bg-ivory px-3 py-3 text-sm leading-6 text-navy">{item}</div>)}</div>
        </section>

        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-2xl border border-[#c9b68e]/45 bg-white p-5">
            <p className="text-[10px] font-bold uppercase tracking-[.14em] text-deep-green">Questions for the clinician</p>
            <div className="mt-3 grid gap-2">{brief.questionsForClinician.map((item, index) => <div key={item} className="flex gap-3 text-sm leading-6 text-navy"><span className="font-serif text-lg text-deep-green">0{index + 1}</span><span>{item}</span></div>)}</div>
          </section>

          <section className="rounded-2xl border border-[#d8b9ad] bg-[#f5ece8] p-5">
            <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#8a5140]">Red flags for the clinician to review</p>
            <p className="mt-2 text-xs leading-5 text-warm-gray">These are not being marked present or absent unless you explicitly reported them and a clinician confirms the history.</p>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-navy">{brief.redFlagsToReview.map((item) => <li key={item} className="flex gap-2"><span className="font-bold text-[#8a5140]">!</span><span>{item}</span></li>)}</ul>
          </section>
        </div>

        <div className="rounded-xl bg-deep-green p-4 text-sm leading-6 text-white"><strong>Important:</strong> {brief.boundary}</div>

        <div className="flex flex-wrap items-center gap-3">
          <button onClick={copyBrief} className="inline-flex min-h-11 items-center justify-center rounded-full bg-deep-green px-5 text-sm font-semibold text-white">{copied ? "Brief copied" : "Copy reviewed brief"}</button>
          <span className="text-xs leading-5 text-warm-gray">Prototype only: copying stays on your device. Saving or sharing into My Sanctuary will require authenticated consent and audit controls.</span>
        </div>
      </div>
    </div>
  );
}
