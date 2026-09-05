import Link from "next/link";
import { PatientAccessShell } from "@/components/PatientAccessShell";
import { safePatientNext } from "@/lib/patientIdentity";

export default async function LoginPage({ searchParams }: { searchParams?: Promise<{ error?: string; next?: string; reset?: string; verified?: string }> }) {
  const query = await searchParams;
  const next = safePatientNext(query?.next);
  return (
    <PatientAccessShell eyebrow="My Sanctuary" title="Welcome back." lead="Sign in to manage your contact preferences and view available booking or programme updates.">
      {query?.error ? <p role="alert" className="mb-5 border-l-2 border-gold bg-ivory px-4 py-3 text-sm text-navy">{query.error === "auth_unavailable" ? "Patient sign-in is not available in this environment." : query.error === "invalid_link" ? "That verification or recovery link is invalid or has expired." : "The sign-in details were not accepted."}</p> : null}
      {query?.verified === "1" ? <p className="mb-5 border-l-2 border-deep-green bg-ivory px-4 py-3 text-sm text-navy">Your email was verified. Account access still requires an approved MMS patient identity.</p> : null}
      {query?.reset === "1" ? <p className="mb-5 border-l-2 border-deep-green bg-ivory px-4 py-3 text-sm text-navy">Your password was updated. Please sign in again.</p> : null}
      <form className="grid gap-5" action="/api/patient-auth/login" method="post">
        <input type="hidden" name="next" value={next} />
        <div className="absolute left-[-10000px] size-px overflow-hidden" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        <label className="grid gap-2 text-sm font-semibold text-navy">Email<input name="email" type="email" maxLength={254} required autoComplete="email" className="rounded-xl border border-stone-200 px-4 py-3 font-normal outline-none transition focus:border-gold" /></label>
        <label className="grid gap-2 text-sm font-semibold text-navy">Password<input name="password" type="password" maxLength={512} required autoComplete="current-password" className="rounded-xl border border-stone-200 px-4 py-3 font-normal outline-none transition focus:border-gold" /></label>
        <button className="min-h-12 rounded-full bg-deep-green px-6 font-semibold text-white transition hover:bg-navy">Sign in securely</button>
      </form>
      <div className="mt-6 flex flex-wrap justify-between gap-3 text-sm"><Link href="/patient-password-recovery" className="font-semibold text-deep-green underline underline-offset-4">Forgot password?</Link><Link href="/register" className="font-semibold text-deep-green underline underline-offset-4">Create account</Link></div>
    </PatientAccessShell>
  );
}
