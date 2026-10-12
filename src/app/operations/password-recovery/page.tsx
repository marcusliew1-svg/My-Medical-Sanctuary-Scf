import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "MMS Owner Password Recovery", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function OwnerPasswordRecoveryPage({ searchParams }: { searchParams?: Promise<{ sent?: string; unavailable?: string }> }) {
  const query = await searchParams;
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16">
      <section className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8">
        <p className="text-xs uppercase tracking-widest text-slate-500">My Medical Sanctuary · Private</p>
        <h1 className="mt-4 text-2xl font-semibold">Recover Owner access</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">Enter the email used for the private Owner account. The response is the same whether or not an eligible account exists.</p>
        {query?.sent === "1" ? <p role="status" className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">If an eligible Owner account exists, recovery instructions have been sent.</p> : null}
        {query?.unavailable === "1" ? <p role="alert" className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Password recovery is temporarily unavailable. Please try again later.</p> : null}
        <form action="/api/operations/password-recovery" method="post" className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-slate-800">Owner email
            <input name="username" type="email" autoComplete="username" inputMode="email" maxLength={320} required className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-700" />
          </label>
          <button type="submit" className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">Send recovery instructions</button>
        </form>
        <p className="mt-5 text-sm"><Link href="/operations/login?next=/owner" className="font-semibold text-slate-800 underline underline-offset-4">Return to sign in</Link></p>
      </section>
    </main>
  );
}
