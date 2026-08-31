import { cookies } from "next/headers";
import { HealthIntelligenceReviewerConsole } from "@/components/HealthIntelligenceReviewerConsole";
import {
  HEALTH_INTELLIGENCE_REVIEWER_COOKIE,
  healthIntelligenceAuthConfigured,
  healthIntelligenceDemoModeEnabled,
  verifyHealthIntelligenceReviewerSession,
} from "@/lib/healthIntelligence/auth";
import { healthIntelligenceSnapshot } from "@/lib/healthIntelligence/store";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Health Intelligence Review",
  robots: { index: false, follow: false },
};

export default async function HealthIntelligenceInternalPage({
  searchParams,
}: {
  searchParams?: { access?: string };
}) {
  const configured = healthIntelligenceAuthConfigured();
  const authenticated = verifyHealthIntelligenceReviewerSession(
    cookies().get(HEALTH_INTELLIGENCE_REVIEWER_COOKIE)?.value,
  );
  if (!configured || !authenticated) {
    return (
      <main data-internal-console className="min-h-screen bg-slate-950 px-5 py-16 text-slate-100">
        <section className="mx-auto max-w-md border border-slate-700 bg-slate-900 p-8 shadow-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
            Internal MMS control
          </p>
          <h1 className="mt-4 font-serif text-4xl">
            Health Intelligence review
          </h1>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            This operational console requires an explicitly enabled environment
            and a short-lived reviewer session.
          </p>
          {!configured ? (
            <p className="mt-6 border border-amber-700 bg-amber-950/50 p-4 text-sm text-amber-100">
              Reviewer access is not configured for this environment.
            </p>
          ) : (
            <form
              className="mt-8 space-y-4"
              action="/api/internal/health-intelligence/access"
              method="post"
            >
              <label className="block text-sm font-semibold" htmlFor="token">
                Internal access token
              </label>
              <input
                className="w-full border border-slate-600 bg-slate-950 px-4 py-3 text-white"
                id="token"
                name="token"
                type="password"
                autoComplete="current-password"
                required
              />
              {searchParams?.access === "denied" ? (
                <p className="text-sm text-red-300">Access was not accepted.</p>
              ) : null}
              <button
                className="w-full bg-amber-300 px-4 py-3 font-bold text-slate-950"
                type="submit"
              >
                Open reviewer console
              </button>
            </form>
          )}
        </section>
      </main>
    );
  }
  let snapshot;
  try {
    snapshot = await healthIntelligenceSnapshot();
  } catch {
    return (
      <main data-internal-console className="min-h-screen bg-slate-950 p-10 text-white">
        <h1 className="font-serif text-4xl">Health Intelligence unavailable</h1>
        <p className="mt-4 text-slate-300">
          The feature is enabled, but its data store is not ready.
        </p>
      </main>
    );
  }
  return (
    <HealthIntelligenceReviewerConsole
      initialSnapshot={snapshot}
      demoMode={healthIntelligenceDemoModeEnabled()}
    />
  );
}
