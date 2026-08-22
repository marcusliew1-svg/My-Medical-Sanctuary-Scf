import { safeOperatorNext } from "@/lib/operatorIdentity";

export default function OperationsStepUpPage({
  searchParams,
}: {
  searchParams?: { error?: string; next?: string };
}) {
  const next = safeOperatorNext(searchParams?.next);
  const error = searchParams?.error;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16">
      <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">My Medical Sanctuary</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">Confirm sensitive action</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Re-enter your operator password before Finance approval, payout, reversal or other protected actions.
        </p>

        {error ? (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {error === "session_required"
              ? "Your operator session needs to be renewed. Sign in again first."
              : error === "unauthorised_operator"
                ? "This account no longer has the required operator authorization."
                : "The password was not accepted."}
          </div>
        ) : null}

        <form action="/api/operations/step-up" method="post" className="mt-7 space-y-5">
          <input type="hidden" name="next" value={next} />
          <label className="block text-sm font-medium text-slate-800">
            Password
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              autoFocus
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-700"
            />
          </label>
          <button type="submit" className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            Confirm identity
          </button>
        </form>
      </div>
    </main>
  );
}
