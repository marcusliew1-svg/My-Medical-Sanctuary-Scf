import Link from "next/link";
import { PatientAccessShell } from "@/components/PatientAccessShell";

export default function OnboardingPage() {
  return (
    <PatientAccessShell eyebrow="Ling-guided onboarding · Step 1 of 3" title="What would you like help with first?" lead="Share only what you are comfortable sharing. This preview does not store your answers.">
      <form className="grid gap-4" action="/my-sanctuary">
        {["Understand my current health", "Improve energy or wellbeing", "Plan preventive care", "Explore Malaysia–Thailand care", "I’m not sure yet"].map((option) => <label key={option} className="flex cursor-pointer items-center gap-3 rounded-xl border border-stone-200 p-4 text-sm font-medium text-navy transition hover:border-gold-light hover:bg-ivory"><input type="radio" name="priority" required value={option} className="accent-[#315B4C]" />{option}</label>)}
        <label className="mt-2 flex items-start gap-3 text-sm leading-6 text-warm-gray"><input type="checkbox" required className="mt-1 accent-[#315B4C]" /><span>I consent to Ling organising my answers for the MMS care team. Any AI summary remains unverified until human review.</span></label>
        <button className="mt-2 min-h-12 rounded-full bg-deep-green px-6 font-semibold text-white transition hover:bg-navy">Complete preview onboarding</button>
      </form>
      <Link href="/" className="mt-6 inline-block text-sm text-warm-gray underline underline-offset-4">Continue browsing without an account</Link>
    </PatientAccessShell>
  );
}
