"use client";

import { useCallback, useEffect, useState } from "react";

type DetailResponse = {
  status: string;
  message?: string;
  detail?: { transaction: Record<string, unknown>; events: Array<Record<string, unknown>> };
  capabilities?: { canMutate: boolean };
};

function money(value: unknown, currency: unknown) {
  const amount = Number(value || 0) / 100;
  try { return new Intl.NumberFormat("en-MY", { style: "currency", currency: String(currency || "MYR") }).format(amount); }
  catch { return `${String(currency || "")} ${amount.toFixed(2)}`.trim(); }
}
function date(value: unknown) { if (!value) return "—"; const d = new Date(String(value)); return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString("en-MY", { dateStyle: "medium", timeStyle: "short" }); }
function field(label: string, value: unknown) { return <div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt><dd className="mt-1 break-words text-sm font-medium text-slate-900">{String(value ?? "—") || "—"}</dd></div>; }

export default function CommissionDetailClient({ transactionId }: { transactionId: string }) {
  const [detail, setDetail] = useState<DetailResponse["detail"]>();
  const [canMutate, setCanMutate] = useState(false);
  const [message, setMessage] = useState("Loading commission…");
  const [reason, setReason] = useState("");
  const [batchId, setBatchId] = useState("");
  const [payoutReference, setPayoutReference] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const response = await fetch(`/api/operations/commissions/${encodeURIComponent(transactionId)}`, { credentials: "same-origin", cache: "no-store" });
      const body = await response.json() as DetailResponse;
      if (!response.ok || body.status !== "ok" || !body.detail) { setMessage(body.message || "Commission detail is unavailable."); return; }
      setDetail(body.detail); setCanMutate(body.capabilities?.canMutate === true); setMessage("");
    } catch { setMessage("Commission detail is unavailable."); }
  }, [transactionId]);
  useEffect(() => {
    const timeoutId = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [load]);

  const mutate = async (path: string, body: Record<string, unknown>) => {
    setBusy(true); setMessage("Processing…");
    try {
      const response = await fetch(path, { method: "POST", credentials: "same-origin", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      const result = await response.json() as { status?: string; message?: string };
      if (!response.ok) { setMessage(result.message || "Action could not be completed."); return; }
      setReason(""); setBatchId(""); setPayoutReference(""); await load();
    } catch { setMessage("Action could not be completed."); }
    finally { setBusy(false); }
  };

  if (!detail) return <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">{message}</div>;
  const t = detail.transaction;
  const status = String(t.status || "");
  const currency = t.currency;

  return <div className="space-y-6">
    <div className="grid gap-4 lg:grid-cols-3">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2"><h2 className="text-base font-semibold">Commercial eligibility</h2><dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {field("Commission", t.transactionId)}{field("Partner", t.partnerCode)}{field("Application", t.applicationId)}{field("Payment", t.paymentId)}{field("Membership", t.membershipId)}{field("Member reference", t.memberReference)}{field("Package", t.membershipCode)}{field("Partner level", t.partnerLevel)}{field("Rule version", t.ruleVersion)}{field("Rate", `${(Number(t.commissionRate || 0) * 100).toFixed(2)}%`)}{field("Eligibility checked by", t.eligibilityCheckedBy)}{field("Eligibility checked at", date(t.eligibilityCheckedAt))}
      </dl></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-base font-semibold">Amounts</h2><dl className="mt-4 space-y-4">{field("Eligible revenue", money(t.eligibleRevenueMinorUnits, currency))}{field("Gross commission", money(t.grossCommissionMinorUnits, currency))}{field("Adjustment", money(t.adjustmentMinorUnits, currency))}{field("Approved", money(t.approvedCommissionMinorUnits, currency))}{field("Clawback", money(t.clawbackMinorUnits, currency))}</dl></section>
    </div>

    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-base font-semibold">{canMutate ? "Finance controls" : "Finance review"}</h2><p className="mt-1 text-sm text-slate-600">Current status: <span className="font-semibold text-slate-900">{status}</span>. {canMutate ? "Approval, payout and reversal require recent Finance step-up." : "This operator has read-only access to commercial commission records."}</p></div></div>
      {canMutate ? <>
      <div className="mt-4 grid gap-3 md:grid-cols-3"><input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for hold/release/reversal" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" /><input value={batchId} onChange={(e) => setBatchId(e.target.value)} placeholder="Payout batch ID" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" /><input value={payoutReference} onChange={(e) => setPayoutReference(e.target.value)} placeholder="Payout reference" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" /></div>
      <div className="mt-4 flex flex-wrap gap-2">
        {status === "Eligible" ? <><button disabled={busy || !reason.trim()} onClick={() => void mutate("/api/internal/commerce/commissions/hold", { transactionId, action: "hold", reason })} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-40">Place on hold</button><button disabled={busy} onClick={() => void mutate("/api/internal/commerce/commissions/approve", { transactionId })} className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40">Approve for payout</button></> : null}
        {status === "Held" ? <button disabled={busy || !reason.trim()} onClick={() => void mutate("/api/internal/commerce/commissions/hold", { transactionId, action: "release", reason })} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-40">Release hold</button> : null}
        {status === "Approved" ? <button disabled={busy || !batchId.trim() || !payoutReference.trim()} onClick={() => void mutate("/api/internal/commerce/commissions/pay", { transactionId, payoutBatchId: batchId, payoutReference })} className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40">Mark paid</button> : null}
        {["Eligible", "Held", "Approved", "Paid"].includes(status) ? <button disabled={busy || !reason.trim()} onClick={() => void mutate("/api/internal/commerce/commissions/reverse", { transactionId, reason })} className="rounded-xl border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 disabled:opacity-40">Reverse</button> : null}
      </div>
      </> : null}
      {message ? <p className="mt-3 text-sm text-slate-600">{message}</p> : null}
      <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{field("Hold reason", t.holdReason)}{field("Approved by", t.approvedBy)}{field("Approved at", date(t.approvedAt))}{field("Payout batch", t.payoutBatchId)}{field("Paid by", t.paidBy)}{field("Paid at", date(t.paidAt))}{field("Payout reference", t.payoutReference)}{field("Reversal reason", t.reversalReason)}</dl>
    </section>

    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-base font-semibold">Immutable commission timeline</h2><div className="mt-4 space-y-3">{detail.events.length ? detail.events.map((event, index) => <div key={`${String(event.occurredAt)}-${index}`} className="rounded-xl border border-slate-200 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><div className="font-semibold">{String(event.previousStatus)} → {String(event.nextStatus)}</div><div className="text-xs text-slate-500">{date(event.occurredAt)}</div></div><div className="mt-1 text-sm text-slate-600">{String(event.reason || "—")}</div><div className="mt-1 text-xs text-slate-500">Operator: {String(event.actor || "—")}</div></div>) : <p className="text-sm text-slate-600">No commission events recorded.</p>}</div></section>
  </div>;
}
