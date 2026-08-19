"use client";

import { useCallback, useEffect, useState } from "react";
import { PartnerHubApplicationSubmissionClient } from "@/components/PartnerHubApplicationSubmissionClient";

type CommercialStatusResponse = {
  status: string;
  message?: string;
  applications?: Array<{
    applicationId: string;
    leadId: string;
    membershipCode: "ASCEND" | "EVOLVE" | "ETERNA" | "PINNACLE";
    applicationStage: string;
    submittedAt: string | null;
    approvedAt: string | null;
    activatedAt: string | null;
    payment: null | {
      paymentId: string;
      amountMinorUnits: number;
      currency: string;
      stage: string;
      submittedAt: string | null;
      clearedAt: string | null;
      refundAmountMinorUnits: number | null;
    };
    membership: null | {
      membershipId: string;
      memberReference: string;
      membershipCode: string;
      status: string;
      activatedAt: string | null;
      cancelledAt: string | null;
    };
  }>;
};

function dateLabel(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-MY", { day: "2-digit", month: "short", year: "numeric" }).format(d);
}

function money(minorUnits: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-MY", { style: "currency", currency }).format(minorUnits / 100);
  } catch {
    return `${currency} ${(minorUnits / 100).toFixed(2)}`;
  }
}

function statusTone(status: string): string {
  if (["Paid", "Activated", "Active", "Cleared", "Approved"].includes(status)) return "bg-emerald-50 text-emerald-700";
  if (["Rejected", "Failed", "Chargeback", "Cancelled"].includes(status)) return "bg-rose-50 text-rose-700";
  if (["Documents Outstanding", "Payment Pending", "Pending", "Submitted", "Under Review"].includes(status)) return "bg-amber-50 text-amber-800";
  return "bg-stone-100 text-stone-700";
}

export function PartnerHubCommercialStatusClient() {
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState<CommercialStatusResponse | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const request = await fetch("/api/partner-hub/commercial-status", { cache: "no-store", credentials: "include" });
      setResponse((await request.json()) as CommercialStatusResponse);
    } catch {
      setResponse({ status: "hub_unavailable", message: "Commercial status could not be reached." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  return (
    <main className="min-h-[70vh] bg-stone-50 px-4 py-10 md:px-6 md:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Partner Hub</p>
            <h1 className="mt-2 font-[var(--font-playfair)] text-4xl text-stone-900">Applications & memberships</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">Submit eligible qualified leads and track attributed customer applications from submission through payment verification and commercial membership activation.</p>
          </div>
          <button onClick={() => void load()} className="w-fit rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700">Refresh</button>
        </div>

        <PartnerHubApplicationSubmissionClient onSubmitted={() => void load()} />

        {loading ? <p className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 text-stone-500">Loading commercial status…</p> : null}

        {!loading && response?.status !== "ok" ? (
          <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-6">
            <p className="font-semibold text-stone-900">Commercial status unavailable</p>
            <p className="mt-2 text-sm text-stone-600">{response?.message || "Unable to load your commercial records."}</p>
          </div>
        ) : null}

        {!loading && response?.status === "ok" && !response.applications?.length ? (
          <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-8 text-center">
            <p className="text-lg font-semibold text-stone-900">No attributed applications yet</p>
            <p className="mt-2 text-sm text-stone-600">Applications linked to your permanent Partner ID will appear here.</p>
          </div>
        ) : null}

        <div className="mt-8 space-y-5">
          {response?.applications?.map((item) => (
            <article key={item.applicationId} className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-stone-900 px-3 py-1 text-xs font-semibold text-white">{item.membershipCode}</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(item.applicationStage)}`}>{item.applicationStage}</span>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-stone-900">Application {item.applicationId}</p>
                  <p className="mt-1 text-xs text-stone-500">Lead {item.leadId}</p>
                </div>
                <div className="text-sm text-stone-500 md:text-right">
                  <p>Submitted {dateLabel(item.submittedAt)}</p>
                  <p>Approved {dateLabel(item.approvedAt)}</p>
                  <p>Activated {dateLabel(item.activatedAt)}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-stone-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Payment</p>
                  {item.payment ? (
                    <>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <p className="text-xl font-semibold text-stone-900">{money(item.payment.amountMinorUnits, item.payment.currency)}</p>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(item.payment.stage)}`}>{item.payment.stage}</span>
                      </div>
                      <p className="mt-2 text-xs text-stone-500">Payment {item.payment.paymentId}</p>
                      <p className="mt-3 text-sm text-stone-600">Cleared {dateLabel(item.payment.clearedAt)}</p>
                      {item.payment.refundAmountMinorUnits ? <p className="mt-1 text-sm text-rose-700">Refunded {money(item.payment.refundAmountMinorUnits, item.payment.currency)}</p> : null}
                    </>
                  ) : <p className="mt-3 text-sm text-stone-500">Payment has not yet been recorded.</p>}
                </div>

                <div className="rounded-2xl bg-stone-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Membership</p>
                  {item.membership ? (
                    <>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <p className="text-xl font-semibold text-stone-900">{item.membership.membershipCode}</p>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(item.membership.status)}`}>{item.membership.status}</span>
                      </div>
                      <p className="mt-2 text-xs text-stone-500">Member ref {item.membership.memberReference}</p>
                      <p className="mt-3 text-sm text-stone-600">Activated {dateLabel(item.membership.activatedAt)}</p>
                      {item.membership.cancelledAt ? <p className="mt-1 text-sm text-rose-700">Cancelled {dateLabel(item.membership.cancelledAt)}</p> : null}
                    </>
                  ) : <p className="mt-3 text-sm text-stone-500">Membership has not yet been activated.</p>}
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-stone-400">Commercial status only. No diagnosis, treatment, test result or other clinical information is displayed or accepted here.</p>
      </div>
    </main>
  );
}
