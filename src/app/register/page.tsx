import Link from "next/link";
import { PatientAccessShell } from "@/components/PatientAccessShell";

export default function RegisterPage() {
  return (
    <PatientAccessShell eyebrow="New patient" title="Create your secure MMS account." lead="Registration is only needed when you want Ling to personalise, remember or coordinate your journey.">
      <form className="grid gap-5" action="/onboarding">
        <label className="grid gap-2 text-sm font-semibold text-navy">Preferred name<input name="name" required autoComplete="name" className="rounded-xl border border-stone-200 px-4 py-3 font-normal outline-none transition focus:border-gold" /></label>
        <label className="grid gap-2 text-sm font-semibold text-navy">Email or mobile number<input name="contact" required autoComplete="email" className="rounded-xl border border-stone-200 px-4 py-3 font-normal outline-none transition focus:border-gold" /></label>
        <label className="flex items-start gap-3 text-sm leading-6 text-warm-gray"><input type="checkbox" required className="mt-1 size-4 accent-[#315B4C]" /><span>I agree to create an MMS account and receive a one-time verification code. <strong className="text-navy">Demo preview—no account will actually be created.</strong></span></label>
        <label className="flex items-start gap-3 text-sm leading-6 text-warm-gray"><input type="checkbox" className="mt-1 size-4 accent-[#315B4C]" /><span>I allow Ling to remember my conversations and preferences. I can change this later.</span></label>
        <button className="min-h-12 rounded-full bg-deep-green px-6 font-semibold text-white transition hover:bg-navy">Continue securely</button>
      </form>
      <p className="mt-6 text-sm text-warm-gray">Already registered? <Link href="/login" className="font-semibold text-deep-green underline underline-offset-4">Patient login</Link></p>
    </PatientAccessShell>
  );
}
