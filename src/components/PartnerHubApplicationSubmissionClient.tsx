"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type LeadResponse = {
  status: string;
  message?: string;
  leads?: Array<{
    leadId: string;
    stage: string;
    fullName: string;
    email: string | null;
    phone: string | null;
  }>;
};

type SubmitResponse = {
  status: string;
  message?: string;
  replayed?: boolean;
  application?: {
    applicationId: string;
    leadId: string;
    membershipCode: string;
    stage: string;
  };
};

type CsrfResponse = {
  status: string;
  message?: string;
  csrfToken?: string;
  headerName?: string;
};

const packages = [
  { code: "ASCEND", label: "Ascend" },
  { code: "EVOLVE", label: "Evolve" },
  { code: "ETERNA", label: "Eterna" },
  { code: "PINNACLE", label: "Pinnacle" },
] as const;

function newIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `application:${crypto.randomUUID()}`;
  }
  return `application:${Date.now()}:${Math.random().toString(36).slice(2)}:${Math.random().toString(36).slice(2)}`;
}

export function PartnerHubApplicationSubmissionClient({ onSubmitted }: { onSubmitted: () => void }) {
  const [leadResponse, setLeadResponse] = useState<LeadResponse | null>(null);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [leadId, setLeadId] = useState("");
  const [membershipCode, setMembershipCode] = useState<(typeof packages)[number]["code"]>("ASCEND");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResponse | null>(null);

  const loadLeads = useCallback(async () => {
    setLoadingLeads(true);
    try {
      const response = await fetch("/api/partner-hub/leads", { cache: "no-store", credentials: "include" });
      setLeadResponse((await response.json()) as LeadResponse);
    } catch {
      setLeadResponse({ status: "hub_unavailable", message: "Eligible leads could not be reached." });
    } finally {
      setLoadingLeads(false);
    }
  }, []);

  useEffect(() => { void loadLeads(); }, [loadLeads]);

  const eligibleLeads = useMemo(
    () => (leadResponse?.leads || []).filter((lead) => lead.stage === "Qualified"),
    [leadResponse],
  );

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!leadId || submitting) return;
    setSubmitting(true);
    setResult(null);

    try {
      const csrfRequest = await fetch("/api/partner-hub/csrf", { cache: "no-store", credentials: "include" });
      const csrf = (await csrfRequest.json()) as CsrfResponse;
      if (!csrfRequest.ok || csrf.status !== "ok" || !csrf.csrfToken) {
        setResult({ status: "error", message: csrf.message || "Application security token could not be issued." });
        return;
      }

      const request = await fetch("/api/partner-hub/applications", {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
          "idempotency-key": newIdempotencyKey(),
          [csrf.headerName || "x-mms-csrf-token"]: csrf.csrfToken,
        },
        body: JSON.stringify({ leadId, membershipCode }),
      });
      const payload = (await request.json()) as SubmitResponse;
      setResult(payload);
      if (request.ok && ["submitted", "already_submitted"].includes(payload.status)) {
        setLeadId("");
        await loadLeads();
        onSubmitted();
      }
    } catch {
      setResult({ status: "error", message: "Application submission could not be completed." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-8 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">New commercial application</p>
          <h2 className="mt-2 text-2xl font-semibold text-stone-900">Submit an eligible lead</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
            Only leads already qualified in the Partner Lead Registry can be submitted. Package selection here is commercial only and does not constitute a diagnosis, prescription or treatment recommendation.
          </p>

          {loadingLeads ? <p className="mt-5 text-sm text-stone-500">Loading eligible leads…</p> : null}
          {!loadingLeads && leadResponse?.status !== "ok" ? (
            <p className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">{leadResponse?.message || "Eligible leads are unavailable."}</p>
          ) : null}
          {!loadingLeads && leadResponse?.status === "ok" && eligibleLeads.length === 0 ? (
            <p className="mt-5 rounded-2xl bg-stone-50 p-4 text-sm text-stone-600">No Qualified leads are currently available for a new application.</p>
          ) : null}
        </div>

        <form onSubmit={submit} className="rounded-2xl bg-stone-50 p-5">
          <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-stone-500" htmlFor="application-lead">Qualified lead</label>
          <select
            id="application-lead"
            value={leadId}
            onChange={(event) => setLeadId(event.target.value)}
            disabled={submitting || eligibleLeads.length === 0}
            className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-3 py-3 text-sm text-stone-900"
            required
          >
            <option value="">Select a lead</option>
            {eligibleLeads.map((lead) => (
              <option key={lead.leadId} value={lead.leadId}>{lead.fullName} · {lead.leadId}</option>
            ))}
          </select>

          <label className="mt-4 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-500" htmlFor="application-package">Membership package</label>
          <select
            id="application-package"
            value={membershipCode}
            onChange={(event) => setMembershipCode(event.target.value as (typeof packages)[number]["code"])}
            disabled={submitting}
            className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-3 py-3 text-sm text-stone-900"
          >
            {packages.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}
          </select>

          <button
            type="submit"
            disabled={submitting || !leadId}
            className="mt-5 w-full rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? "Submitting…" : "Submit application"}
          </button>

          {result ? (
            <div className={`mt-4 rounded-xl p-3 text-sm ${["submitted", "already_submitted"].includes(result.status) ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"}`}>
              <p className="font-semibold">{result.status === "already_submitted" ? "Application already submitted" : result.status === "submitted" ? "Application submitted" : "Application not submitted"}</p>
              <p className="mt-1">{result.application?.applicationId || result.message || "Please review the application status before retrying."}</p>
            </div>
          ) : null}
        </form>
      </div>
    </section>
  );
}
