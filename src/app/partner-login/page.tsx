import Link from "next/link";
import { safeRelativeNext } from "@/lib/supabaseAuth";

export default function PartnerLoginPage({
  searchParams,
}: {
  searchParams?: { error?: string; next?: string };
}) {
  const next = safeRelativeNext(searchParams?.next);
  const hasError = searchParams?.error === "invalid_credentials";
  const unavailable = searchParams?.error === "auth_unavailable";
  const notAuthorized = searchParams?.error === "not_authorized";

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-16">
      <div className="mx-auto max-w-md rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">My Medical Sanctuary</p>
          <h1 className="mt-3 text-3xl font-semibold text-stone-900">Partner Hub sign in</h1>
          <p className="mt-3 text-sm leading-6 text-stone-600">Use the email and password issued for your MMS Partner account.</p>
        </div>

        {hasError ? (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            The email or password was not accepted.
          </div>
        ) : null}
        {notAuthorized ? (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            This account is not linked to an authorised MMS Partner profile.
          </div>
        ) : null}
        {unavailable ? (
          <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Partner authentication is temporarily unavailable.
          </div>
        ) : null}

        <form action="/api/auth/login" method="post" className="space-y-5">
          <input type="hidden" name="next" value={next} />
          <label className="block text-sm font-medium text-stone-800">
            Email
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-emerald-600"
            />
          </label>
          <label className="block text-sm font-medium text-stone-800">
            Password
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-emerald-600"
            />
          </label>
          <button type="submit" className="w-full rounded-xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800">
            Sign in securely
          </button>
        </form>

        <p className="mt-7 text-xs leading-5 text-stone-500">
          Access is limited to authorised MMS Partners. Need help? <Link href="/contact" className="font-semibold text-emerald-700">Contact MMS</Link>.
        </p>
      </div>
    </main>
  );
}
