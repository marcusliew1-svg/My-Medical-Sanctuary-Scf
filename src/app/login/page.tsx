import Link from "next/link";
import { PatientAccessShell } from "@/components/PatientAccessShell";

export default function LoginPage() {
  return (
    <PatientAccessShell eyebrow="Returning patient" title="Welcome back to My Sanctuary." lead="Continue your conversations with Ling and see what is awaiting care-team review.">
      <form className="grid gap-5" action="/my-sanctuary">
        <label className="grid gap-2 text-sm font-semibold text-navy">Email or mobile number<input required autoComplete="username" className="rounded-xl border border-stone-200 px-4 py-3 font-normal outline-none transition focus:border-gold" /></label>
        <label className="grid gap-2 text-sm font-semibold text-navy">Password<input type="password" required autoComplete="current-password" className="rounded-xl border border-stone-200 px-4 py-3 font-normal outline-none transition focus:border-gold" /></label>
        <div className="flex items-center justify-between text-sm"><label className="flex items-center gap-2 text-warm-gray"><input type="checkbox" className="accent-[#315B4C]" /> Remember me</label><span className="text-deep-green underline underline-offset-4">Forgot access?</span></div>
        <button className="min-h-12 rounded-full bg-deep-green px-6 font-semibold text-white transition hover:bg-navy">Enter demo sanctuary</button>
      </form>
      <p className="mt-3 text-xs leading-5 text-warm-gray">Internal preview: authentication and recovery are simulated. Do not enter real patient information.</p>
      <p className="mt-6 text-sm text-warm-gray">New to MMS? <Link href="/register" className="font-semibold text-deep-green underline underline-offset-4">Create an account</Link></p>
    </PatientAccessShell>
  );
}
