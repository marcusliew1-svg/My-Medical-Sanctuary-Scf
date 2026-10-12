import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Set MMS Owner Password", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const messages: Record<string, string> = {
  invalid_link: "This recovery link is invalid, expired, or is not for the private Owner account. Request a new link.",
  invalid_password: "Use matching passwords of 12 to 128 characters.",
  password_rejected: "That password could not be accepted. Choose a different strong password and try again.",
  unavailable: "Password recovery is temporarily unavailable. Your password was not changed; please try again later.",
  try_later: "Too many attempts were made. Wait before trying again.",
};

export default async function OwnerPasswordResetPage({ searchParams }: { searchParams?: Promise<{ error?: string }> }) {
  const query = await searchParams;
  const error = query?.error ? messages[query.error] || messages.invalid_link : "";
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16">
      <section className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8">
        <p className="text-xs uppercase tracking-widest text-slate-500">My Medical Sanctuary · Private</p>
        <h1 className="mt-4 text-2xl font-semibold">Choose a new Owner password</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">You do not need the old password. Use a unique password of at least 12 characters.</p>
        {error ? <p role="alert" className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{error}</p> : null}
        <form action="/api/operations/password-reset" method="post" className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-slate-800">New password
            <input name="password" type="password" autoComplete="new-password" minLength={12} maxLength={128} required className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-700" />
          </label>
          <label className="block text-sm font-medium text-slate-800">Confirm new password
            <input name="confirmPassword" type="password" autoComplete="new-password" minLength={12} maxLength={128} required className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-700" />
          </label>
          <button type="submit" className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">Update password</button>
        </form>
        <p className="mt-5 text-sm"><Link href="/operations/password-recovery" className="font-semibold text-slate-800 underline underline-offset-4">Request a new recovery link</Link></p>
      </section>
    </main>
  );
}
