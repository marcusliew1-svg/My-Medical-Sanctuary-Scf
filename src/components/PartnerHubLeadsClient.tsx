"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

const CONSENT_VERSION = "MMS-PDPA-MARKETING-2026-08-v1";

type Lead = {
  leadId: string;
  stage: string;
  registeredAt: string;
  source: string | null;
  campaign: string | null;
  duplicateStatus: string;
  fullName: string;
  email: string | null;
  phone: string | null;
};

type LeadsResponse = {
  status: string;
  message?: string;
  leads?: Lead[];
  requiredConsentVersion?: string;
};

function dateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-MY", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function newIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return `lead:${crypto.randomUUID()}`;
  return `lead:${Date.now()}:${Math.random().toString(36).slice(2, 14)}`;
}

export function PartnerHubLeadsClient() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", source: "Personal referral", campaign: "", consentAccepted: false });

  const loadLeads = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/partner-hub/leads", { cache: "no-store", credentials: "include" });
      const payload = (await response.json()) as LeadsResponse;
      if (!response.ok || payload.status !== "ok") {
        setMessage(payload.message || "Lead Registry is unavailable.");
        setLeads([]);
        return;
      }
      setLeads(payload.leads || []);
      setMessage("");
    } catch {
      setMessage("Lead Registry could not be reached.");
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLeads();
  }, [loadLeads]);

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setMessage("");
    try {
      const csrfResponse = await fetch("/api/partner-hub/csrf", { cache: "no-store", credentials: "include" });
      const csrfPayload = (await csrfResponse.json()) as { status: string; csrfToken?: string; headerName?: string; message?: string };
      if (!csrfResponse.ok || !csrfPayload.csrfToken) {
        setMessage(csrfPayload.message || "Unable to secure lead registration.");
        return;
      }

      const capturedAt = new Date().toISOString();
      const response = await fetch("/api/partner-hub/leads", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": newIdempotencyKey(),
          [csrfPayload.headerName || "x-mms-csrf-token"]: csrfPayload.csrfToken,
        },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email || undefined,
          phone: form.phone || undefined,
          source: form.source || undefined,
          campaign: form.campaign || undefined,
          consentAccepted: form.consentAccepted,
          consentVersion: CONSENT_VERSION,
          consentCapturedAt: capturedAt,
        }),
      });
      const payload = (await response.json()) as LeadsResponse & { lead?: { leadId: string } };
      if (!response.ok) {
        setMessage(payload.message || "Lead registration could not be completed.");
        return;
      }
      setMessage(payload.lead?.leadId ? `Lead ${payload.lead.leadId} registered.` : "Lead registered.");
      setForm({ fullName: "", email: "", phone: "", source: "Personal referral", campaign: "", consentAccepted: false });
      await loadLeads();
    } catch {
      setMessage("Lead registration could not be completed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-10 md:px-6 md:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">MMS Partner Hub</p>
            <h1 className="mt-2 font-[var(--font-playfair)] text-4xl text-stone-900">Partner Lead Registry</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">Register commercial prospects only. Do not enter diagnoses, symptoms, test results, treatments or any other clinical information.</p>
          </div>
          <a href="/partner-hub" className="text-sm font-semibold text-emerald-700">Back to dashboard</a>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Register a lead</p>
            <form onSubmit={submitLead} className="mt-5 space-y-4">
              <label className="block text-sm font-medium text-stone-700">Full name
                <input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-emerald-600" maxLength={160} />
              </label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-medium text-stone-700">Email
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-emerald-600" maxLength={254} />
                </label>
                <label className="block text-sm font-medium text-stone-700">Phone
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-emerald-600" maxLength={50} />
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-medium text-stone-700">Source
                  <input value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-emerald-600" maxLength={120} />
                </label>
                <label className="block text-sm font-medium text-stone-700">Campaign
                  <input value={form.campaign} onChange={(e) => setForm({ ...form, campaign: e.target.value })} className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-emerald-600" maxLength={120} />
                </label>
              </div>
              <label className="flex gap-3 rounded-2xl bg-stone-50 p-4 text-sm leading-6 text-stone-700">
                <input type="checkbox" checked={form.consentAccepted} onChange={(e) => setForm({ ...form, consentAccepted: e.target.checked })} className="mt-1 h-4 w-4" />
                <span>I confirm that marketing / PDPA consent has been obtained from this person before registration. Consent version: {CONSENT_VERSION}.</span>
              </label>
              <button disabled={submitting || !form.consentAccepted || (!form.email && !form.phone)} className="w-full rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">
                {submitting ? "Registering…" : "Register lead"}
              </button>
            </form>
            {message ? <p className="mt-4 rounded-xl bg-stone-100 px-4 py-3 text-sm text-stone-600">{message}</p> : null}
          </section>

          <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Your leads</p>
                <h2 className="mt-2 text-2xl font-semibold text-stone-900">{loading ? "Loading…" : `${leads.length} currently owned`}</h2>
              </div>
              <button onClick={() => void loadLeads()} className="rounded-full border border-stone-300 px-4 py-2 text-xs font-semibold text-stone-700">Refresh</button>
            </div>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-stone-200 text-xs uppercase tracking-[0.12em] text-stone-500">
                  <tr><th className="py-3 pr-4">Lead</th><th className="py-3 pr-4">Contact</th><th className="py-3 pr-4">Stage</th><th className="py-3 pr-4">Duplicate</th><th className="py-3">Registered</th></tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.leadId} className="border-b border-stone-100 align-top">
                      <td className="py-4 pr-4"><p className="font-semibold text-stone-900">{lead.fullName}</p><p className="mt-1 text-xs text-stone-500">{lead.leadId}</p></td>
                      <td className="py-4 pr-4 text-stone-600"><p>{lead.email || "—"}</p><p className="mt-1">{lead.phone || "—"}</p></td>
                      <td className="py-4 pr-4"><span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">{lead.stage}</span></td>
                      <td className="py-4 pr-4 text-stone-600">{lead.duplicateStatus}</td>
                      <td className="py-4 text-stone-600">{dateTime(lead.registeredAt)}</td>
                    </tr>
                  ))}
                  {!loading && leads.length === 0 ? <tr><td colSpan={5} className="py-10 text-center text-stone-500">No leads are currently assigned to this Partner account.</td></tr> : null}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
