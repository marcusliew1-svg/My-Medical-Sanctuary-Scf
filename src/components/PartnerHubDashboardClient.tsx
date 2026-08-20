"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Certification = {
  status: "Not Issued" | "Current" | "Renewal Due" | "Expired";
  issuedAt?: string;
  expiresAt?: string;
  renewalDueAt?: string;
};

type CommissionSummary = {
  currency: string;
  pendingMinorUnits: number;
  eligibleMinorUnits: number;
  heldMinorUnits: number;
  approvedMinorUnits: number;
  paidMinorUnits: number;
  reversedMinorUnits: number;
  clawbackMinorUnits: number;
};

type Dashboard = {
  partner: {
    partnerId: string;
    stage: "Active" | "Suspended" | "Inactive";
    level?: "Associate" | "Senior" | "Elite" | "Chairman";
    referralUrl?: string;
    certification: Certification;
  };
  leads: {
    totalOwned: number;
    registered: number;
    contacted: number;
    qualified: number;
    application: number;
    paymentPending: number;
    paymentVerified: number;
    activated: number;
    closed: number;
  };
  memberships: {
    active: number;
    cancelled: number;
    expired: number;
  };
  commissions: CommissionSummary[];
  generatedAt: string;
};

type SessionResponse = {
  status: string;
  authenticated?: boolean;
  message?: string;
  session?: {
    partnerId: string;
    expiresAt: string;
    authenticationMethod: string;
    assuranceLevel: string;
  };
};

type DashboardResponse = {
  status: string;
  message?: string;
  capabilities?: string[];
  dashboard?: Dashboard;
};

function money(minorUnits: number, currency: string): string {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(minorUnits / 100);
}

function dateLabel(value?: string): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-MY", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function StatCard({ label, value, note }: { label: string; value: string | number; note?: string }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-stone-900">{value}</p>
      {note ? <p className="mt-2 text-sm text-stone-500">{note}</p> : null}
    </div>
  );
}

export function PartnerHubDashboardClient() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<SessionResponse | null>(null);
  const [dashboardResponse, setDashboardResponse] = useState<DashboardResponse | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const sessionRequest = await fetch("/api/partner-hub/session", { cache: "no-store", credentials: "include" });
      const sessionPayload = (await sessionRequest.json()) as SessionResponse;
      setSession(sessionPayload);
      if (!sessionRequest.ok || !sessionPayload.authenticated) {
        setDashboardResponse(null);
        return;
      }

      const dashboardRequest = await fetch("/api/partner-hub/dashboard", { cache: "no-store", credentials: "include" });
      const dashboardPayload = (await dashboardRequest.json()) as DashboardResponse;
      setDashboardResponse(dashboardPayload);
    } catch {
      setSession({ status: "hub_unavailable", authenticated: false, message: "Partner Hub could not be reached." });
      setDashboardResponse(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const dashboard = dashboardResponse?.dashboard;
  const capabilities = useMemo(() => new Set(dashboardResponse?.capabilities || []), [dashboardResponse?.capabilities]);

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-stone-50 px-6 py-16">
        <div className="mx-auto max-w-6xl rounded-3xl border border-stone-200 bg-white p-10 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">MMS Partner Hub</p>
          <h1 className="mt-3 font-[var(--font-playfair)] text-4xl text-stone-900">Loading your commercial workspace…</h1>
        </div>
      </main>
    );
  }

  if (!session?.authenticated) {
    const unavailable = session?.status === "hub_unavailable";
    return (
      <main className="min-h-[70vh] bg-stone-50 px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-3xl border border-stone-200 bg-white p-8 shadow-sm md:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">MMS Partner Hub</p>
          <h1 className="mt-3 font-[var(--font-playfair)] text-4xl text-stone-900">
            {unavailable ? "Partner Hub is not enabled yet" : "Partner sign-in required"}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-stone-600">
            {unavailable
              ? "The Partner Hub remains safely closed until the dedicated MMS commercial database and Partner identity services are enabled."
              : "Your authenticated Partner session has expired or is not present. Sign in again through the approved MMS Partner login when it is available."}
          </p>
          {session?.message ? <p className="mt-4 rounded-xl bg-stone-100 px-4 py-3 text-sm text-stone-600">{session.message}</p> : null}
        </div>
      </main>
    );
  }

  if (!dashboard || dashboardResponse?.status !== "ok") {
    return (
      <main className="min-h-[70vh] bg-stone-50 px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-3xl border border-stone-200 bg-white p-8 shadow-sm md:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">MMS Partner Hub</p>
          <h1 className="mt-3 font-[var(--font-playfair)] text-4xl text-stone-900">Your dashboard is temporarily unavailable</h1>
          <p className="mt-5 text-stone-600">{dashboardResponse?.message || "The commercial dashboard could not be loaded."}</p>
          <button onClick={() => void load()} className="mt-6 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white">
            Try again
          </button>
        </div>
      </main>
    );
  }

  const cert = dashboard.partner.certification;

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-10 md:px-6 md:py-14">
      <div className="mx-auto max-w-7xl">
        <section className="overflow-hidden rounded-3xl bg-stone-900 p-7 text-white shadow-sm md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">My Medical Sanctuary · Partner Hub</p>
              <h1 className="mt-3 font-[var(--font-playfair)] text-4xl md:text-5xl">Welcome back</h1>
              <p className="mt-3 text-stone-300">
                {dashboard.partner.partnerId} · {dashboard.partner.level || "Partner"} · {dashboard.partner.stage}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.16em] text-stone-400">Certification</p>
              <p className="mt-1 text-lg font-semibold">{cert.status}</p>
              <p className="mt-1 text-sm text-stone-400">Expires {dateLabel(cert.expiresAt)}</p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Owned leads" value={dashboard.leads.totalOwned} note={`${dashboard.leads.qualified} qualified`} />
          <StatCard label="Active memberships" value={dashboard.memberships.active} note={`${dashboard.memberships.cancelled} cancelled`} />
          <StatCard label="Activated leads" value={dashboard.leads.activated} note={`${dashboard.leads.paymentPending} payment pending`} />
          <StatCard label="Partner status" value={dashboard.partner.stage} note={capabilities.has("REGISTER_LEAD") ? "Selling enabled" : "Read-only / restricted"} />
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Lead pipeline</p>
                <h2 className="mt-2 font-[var(--font-playfair)] text-3xl text-stone-900">Your commercial activity</h2>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Commercial only</span>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                ["Registered", dashboard.leads.registered],
                ["Contacted", dashboard.leads.contacted],
                ["Qualified", dashboard.leads.qualified],
                ["Application", dashboard.leads.application],
                ["Payment pending", dashboard.leads.paymentPending],
                ["Payment verified", dashboard.leads.paymentVerified],
                ["Activated", dashboard.leads.activated],
                ["Closed", dashboard.leads.closed],
              ].map(([label, value]) => (
                <div key={String(label)} className="rounded-2xl bg-stone-50 p-4">
                  <p className="text-2xl font-semibold text-stone-900">{value}</p>
                  <p className="mt-1 text-xs text-stone-500">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Commission wallet</p>
            <h2 className="mt-2 font-[var(--font-playfair)] text-3xl text-stone-900">Current ledger</h2>
            <div className="mt-5 space-y-4">
              {dashboard.commissions.length ? dashboard.commissions.map((summary) => (
                <div key={summary.currency} className="rounded-2xl bg-stone-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-900">{summary.currency}</span>
                    <span className="text-sm text-stone-500">Paid {money(summary.paidMinorUnits, summary.currency)}</span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-stone-600">
                    <span>Eligible</span><span className="text-right font-medium text-stone-900">{money(summary.eligibleMinorUnits, summary.currency)}</span>
                    <span>Approved</span><span className="text-right font-medium text-stone-900">{money(summary.approvedMinorUnits, summary.currency)}</span>
                    <span>Held</span><span className="text-right font-medium text-stone-900">{money(summary.heldMinorUnits, summary.currency)}</span>
                    <span>Clawback</span><span className="text-right font-medium text-stone-900">{money(summary.clawbackMinorUnits, summary.currency)}</span>
                  </div>
                </div>
              )) : <p className="rounded-2xl bg-stone-50 p-4 text-sm text-stone-500">No commission transactions yet.</p>}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Academy</p>
            <h3 className="mt-2 text-xl font-semibold text-stone-900">Training & certification</h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">Review controlled MMS learning modules and your current certification status.</p>
            <p className="mt-4 text-xs font-semibold text-emerald-700">{capabilities.has("ACCESS_ACADEMY") ? "Access available" : "Access restricted"}</p>
          </div>
          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Presentation Centre</p>
            <h3 className="mt-2 text-xl font-semibold text-stone-900">Approved materials only</h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">Use only current, effective-dated MMS materials approved for Partner use.</p>
            <p className="mt-4 text-xs font-semibold text-emerald-700">{capabilities.has("ACCESS_PRESENTATION_CENTRE") ? "Access available" : "Access restricted"}</p>
          </div>
          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Referral</p>
            <h3 className="mt-2 text-xl font-semibold text-stone-900">Your attribution link</h3>
            {dashboard.partner.referralUrl ? (
              <p className="mt-2 break-all text-sm leading-6 text-stone-600">{dashboard.partner.referralUrl}</p>
            ) : (
              <p className="mt-2 text-sm leading-6 text-stone-600">Referral sharing is not currently enabled for this account.</p>
            )}
          </div>
        </section>

        <p className="mt-6 text-center text-xs text-stone-400">Commercial Partner information only. No clinical or patient medical information is displayed in Partner Hub.</p>
      </div>
    </main>
  );
}
