import type { Metadata } from "next";
export const metadata: Metadata = { title: "MMS Account Setup", robots: { index: false, follow: false } };
export default async function OperatorSetupPage({searchParams}: {searchParams?: Promise<{error?: string}>}) {
  const query = await searchParams;
  return <main className="min-h-screen bg-slate-50 px-4 py-16"><section className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8">
    <p className="text-xs uppercase tracking-widest text-slate-500">My Medical Sanctuary</p>
    <h1 className="mt-4 text-2xl font-semibold">Set your MMS password</h1>
    <p className="mt-3 text-sm text-slate-600">Use the invitation link from MMS. Your password must contain at least 12 characters.</p>
    {query?.error ? <p role="alert" className="mt-4 text-sm text-red-700">Your invitation could not be completed. Request a fresh MMS invitation if this continues.</p> : null}
    <form method="post" action="/api/operations/setup" className="mt-6 space-y-4">
      <label className="block text-sm">New password<input type="password" name="password" autoComplete="new-password" minLength={12} maxLength={128} required className="mt-1 w-full rounded border p-3"/></label>
      <label className="block text-sm">Confirm password<input type="password" name="confirm" autoComplete="new-password" minLength={12} maxLength={128} required className="mt-1 w-full rounded border p-3"/></label>
      <button className="rounded-lg bg-slate-900 px-5 py-3 text-white" type="submit">Set password</button>
    </form>
    <p className="mt-5 text-xs text-slate-500">Account setup does not grant operational permissions. Access is assigned separately.</p>
  </section></main>;
}
