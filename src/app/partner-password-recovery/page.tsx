import Link from "next/link";

export default async function PartnerPasswordRecoveryPage({ searchParams }: { searchParams?: Promise<{ sent?: string }> }) {
  const query = await searchParams;
  return (
    <main className="min-h-screen bg-stone-50 px-4 py-16">
      <div className="mx-auto max-w-md rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">Partner security</p>
        <h1 className="mt-3 text-3xl font-semibold text-stone-900">Reset your password</h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">Enter your Partner account email. For privacy, the response is the same whether or not an account exists.</p>
        {query?.sent === "1" ? <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">If an eligible account exists, recovery instructions have been sent.</div> : null}
        <form action="/api/partner-auth/password-recovery" method="post" className="mt-7 space-y-5">
          <div className="absolute left-[-10000px] top-auto size-px overflow-hidden" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
          <label className="block text-sm font-medium text-stone-800">Email
            <input name="email" type="email" autoComplete="email" maxLength={254} required className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-emerald-600" />
          </label>
          <button type="submit" className="w-full rounded-xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white">Send recovery instructions</button>
        </form>
        <Link href="/partner-login" className="mt-6 inline-block text-sm font-semibold text-emerald-700">Return to sign in</Link>
      </div>
    </main>
  );
}
