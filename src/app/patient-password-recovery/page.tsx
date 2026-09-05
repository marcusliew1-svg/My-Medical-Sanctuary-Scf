import Link from "next/link";
import { PatientAccessShell } from "@/components/PatientAccessShell";

export default async function Page({ searchParams }: { searchParams?: Promise<{ sent?: string }> }) {
  const query = await searchParams;
  return <PatientAccessShell eyebrow="Account security" title="Reset your password." lead="For privacy, the response is the same whether or not an eligible account exists.">
    {query?.sent === "1" ? <p className="mb-5 border-l-2 border-deep-green bg-ivory px-4 py-3 text-sm text-navy">If an eligible account exists, recovery instructions have been sent.</p> : null}
    <form action="/api/patient-auth/password-recovery" method="post" className="grid gap-5"><div className="absolute left-[-10000px] size-px overflow-hidden" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div><label className="grid gap-2 text-sm font-semibold text-navy">Email<input name="email" type="email" required maxLength={254} autoComplete="email" className="rounded-xl border border-stone-200 px-4 py-3 font-normal outline-none focus:border-gold" /></label><button className="min-h-12 rounded-full bg-deep-green px-6 font-semibold text-white">Send recovery instructions</button></form>
    <Link href="/login" className="mt-6 inline-block text-sm font-semibold text-deep-green underline underline-offset-4">Return to sign in</Link>
  </PatientAccessShell>;
}
