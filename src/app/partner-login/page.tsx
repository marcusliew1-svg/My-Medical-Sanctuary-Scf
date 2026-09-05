import Link from "next/link";
import { safePartnerNext } from "@/lib/partnerIdentity";

export default async function PartnerLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; next?: string; reset?: string; verified?: string }>;
}) {
  const query = await searchParams;
  const next = safePartnerNext(query?.next);
  const error = query?.error;

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-16">
      <div className="mx-auto max-w-md rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">My Medical Sanctuary</p>
        <h1 className="mt-3 text-3xl font-semibold text-stone-900">Partner Hub sign in</h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">Use the email and password issued for your approved MMS Partner account.</p>

        {error ? (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {error === "auth_unavailable"
              ? "Partner authentication is temporarily unavailable."
              : error === "invalid_link"
                ? "That verification or recovery link is invalid or has expired."
                : "The sign-in details were not accepted."}
          </div>
        ) : null}
        {query?.reset === "1" ? <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">Your password was updated. Please sign in again.</div> : null}
        {query?.verified === "1" ? <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">Your email was verified. Partner access still depends on MMS approval.</div> : null}

        <form action="/api/partner-auth/login" method="post" className="mt-7 space-y-5">
          <input type="hidden" name="next" value={next} />
          <div className="absolute left-[-10000px] top-auto size-px overflow-hidden" aria-hidden="true">
            <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
          </div>
          <label className="block text-sm font-medium text-stone-800">Email
            <input name="email" type="email" autoComplete="email" maxLength={254} required className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-emerald-600" />
          </label>
          <label className="block text-sm font-medium text-stone-800">Password
            <input name="password" type="password" autoComplete="current-password" maxLength={512} required className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-emerald-600" />
          </label>
          <button type="submit" className="w-full rounded-xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800">Sign in securely</button>
        </form>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500">
          <Link href="/partner-password-recovery" className="font-semibold text-emerald-700">Forgot password?</Link>
          <Link href="/join-mms" className="font-semibold text-emerald-700">Apply to become a Partner</Link>
        </div>
        <p className="mt-6 text-xs leading-5 text-stone-500">Email verification does not approve Partner access. Approval, training and agreement requirements remain controlled by MMS.</p>
      </div>
    </main>
  );
}
