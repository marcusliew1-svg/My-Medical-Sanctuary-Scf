import { safeOperatorNext } from "@/lib/operatorIdentity";
import Link from "next/link";

export default async function OperationsLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; next?: string; reset?: string; setup?: string }>;
}) {
  const query = await searchParams;
  const next = safeOperatorNext(query?.next);
  const error = query?.error;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16">
      <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">My Medical Sanctuary</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">Operations sign in</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Restricted to authorised MMS Operations, Finance, Administration and Audit users.
        </p>

        {error ? (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {error === "auth_unavailable"
              ? "Operator authentication is not enabled."
              : error === "unauthorised_operator"
                ? "This account is not authorised for MMS Operations."
                : "The email or password was not accepted."}
          </div>
        ) : null}

        {query?.reset === "1" ? (
          <div role="status" className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            Your password was updated. Sign in with the new password to continue to Owner Oversight.
          </div>
        ) : query?.setup === "1" ? (
          <div role="status" className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            Your password was created. Sign in to continue.
          </div>
        ) : null}

        <form action="/api/operations/login" method="post" className="mt-7 space-y-5">
          <input type="hidden" name="next" value={next} />
          <label className="block text-sm font-medium text-slate-800">
            Email
            <input
              name="username"
              type="email"
              autoComplete="username"
              required
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-700"
            />
          </label>
          <label className="block text-sm font-medium text-slate-800">
            Password
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-700"
            />
          </label>
          <button type="submit" className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            Sign in to Operations
          </button>
        </form>

        <p className="mt-5 text-sm">
          <Link href="/operations/password-recovery" className="font-semibold text-slate-800 underline underline-offset-4">
            Owner forgot password?
          </Link>
        </p>

        <p className="mt-7 text-xs leading-5 text-slate-500">
          Partner Hub accounts do not automatically receive Operations or Finance access.
        </p>
      </div>
    </main>
  );
}
