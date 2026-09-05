import Link from "next/link";
import { PatientAccessShell } from "@/components/PatientAccessShell";
import { patientRegistrationEnabled } from "@/lib/patientIdentity";

const input = "rounded-xl border border-stone-200 px-4 py-3 font-normal outline-none transition focus:border-gold";
export default async function RegisterPage({ searchParams }: { searchParams?: Promise<{ submitted?: string; invalid?: string; unavailable?: string }> }) {
  const query = await searchParams;
  const enabled = patientRegistrationEnabled();
  return (
    <PatientAccessShell eyebrow="Create My Sanctuary account" title="Begin with secure basics." lead="This account is for identity, contact preferences and administrative continuity. Do not enter medical information.">
      {query?.submitted === "1" ? <p className="mb-5 border-l-2 border-deep-green bg-ivory px-4 py-3 text-sm text-navy">If the request was eligible, verification instructions have been sent. Verification does not itself activate account access.</p> : null}
      {query?.invalid === "1" ? <p role="alert" className="mb-5 border-l-2 border-gold bg-ivory px-4 py-3 text-sm text-navy">Please check the required fields and use a password of at least 12 characters.</p> : null}
      {!enabled || query?.unavailable === "1" ? <p className="mb-5 border-l-2 border-gold bg-ivory px-4 py-3 text-sm text-navy">Online account registration is not active in this environment. Public booking remains available.</p> : null}
      <form className="grid gap-4 sm:grid-cols-2" action="/api/patient-auth/register" method="post">
        <input type="hidden" name="sourcePath" value="/register" /><div className="absolute left-[-10000px] size-px overflow-hidden" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        <label className="grid gap-2 text-sm font-semibold text-navy sm:col-span-2">Full name<input name="fullName" maxLength={120} required disabled={!enabled} autoComplete="name" className={input} /></label>
        <label className="grid gap-2 text-sm font-semibold text-navy">Email<input name="email" type="email" maxLength={254} required disabled={!enabled} autoComplete="email" className={input} /></label>
        <label className="grid gap-2 text-sm font-semibold text-navy">Mobile<input name="mobile" maxLength={40} required disabled={!enabled} autoComplete="tel" className={input} /></label>
        <label className="grid gap-2 text-sm font-semibold text-navy">Country<input name="country" maxLength={80} required disabled={!enabled} autoComplete="country-name" className={input} /></label>
        <label className="grid gap-2 text-sm font-semibold text-navy">Preferred location<select name="preferredLocation" required disabled={!enabled} className={input}><option value="No preference">No preference</option><option>Bangsar</option><option>SS2</option></select></label>
        <label className="grid gap-2 text-sm font-semibold text-navy">Contact preference<select name="communicationPreference" required disabled={!enabled} className={input}><option>Email</option><option>WhatsApp</option><option>Phone</option></select></label>
        <span aria-hidden="true" />
        <label className="grid gap-2 text-sm font-semibold text-navy">Password<input name="password" type="password" minLength={12} maxLength={128} required disabled={!enabled} autoComplete="new-password" className={input} /></label>
        <label className="grid gap-2 text-sm font-semibold text-navy">Confirm password<input name="confirmPassword" type="password" minLength={12} maxLength={128} required disabled={!enabled} autoComplete="new-password" className={input} /></label>
        <label className="flex items-start gap-3 text-sm leading-6 text-warm-gray sm:col-span-2"><input name="consent" value="true" type="checkbox" required disabled={!enabled} className="mt-1 size-4 accent-[#315B4C]" /><span>I consent to MMS using these details to create and administer my account.</span></label>
        <button disabled={!enabled} className="min-h-12 rounded-full bg-deep-green px-6 font-semibold text-white transition hover:bg-navy disabled:cursor-not-allowed disabled:opacity-45 sm:col-span-2">Request account</button>
      </form>
      <p className="mt-6 text-sm text-warm-gray">Already registered? <Link href="/login" className="font-semibold text-deep-green underline underline-offset-4">Patient login</Link></p>
    </PatientAccessShell>
  );
}
