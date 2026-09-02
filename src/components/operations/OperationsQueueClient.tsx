"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type QueueKind = "applications" | "finance" | "memberships";

type QueueResponse = {
  status: string;
  message?: string;
  items?: Array<Record<string, unknown>>;
  nextCursor?: string | null;
};

const stageOptions: Record<QueueKind, string[]> = {
  applications: ["Submitted", "Under Review", "Documents Outstanding", "Approved", "Payment Pending", "Paid", "Activated", "Rejected", "Withdrawn"],
  finance: ["Submitted", "Cleared", "Failed", "Refunded", "Partially Refunded", "Chargeback"],
  memberships: ["Pending Activation", "Active", "Cancelled", "Expired"],
};

const endpoint: Record<QueueKind, string> = {
  applications: "/api/operations/applications",
  finance: "/api/operations/payments",
  memberships: "/api/operations/memberships",
};

function formatMoney(value: unknown, currency: unknown) {
  const amount = Number(value || 0) / 100;
  try {
    return new Intl.NumberFormat("en-MY", { style: "currency", currency: String(currency || "MYR") }).format(amount);
  } catch {
    return `${String(currency || "")} ${amount.toFixed(2)}`.trim();
  }
}

function formatDate(value: unknown) {
  if (!value) return "—";
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString("en-MY", { dateStyle: "medium", timeStyle: "short" });
}

function badge(value: unknown) {
  return <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{String(value || "—")}</span>;
}

export default function OperationsQueueClient({ kind, initialFilter = "" }: { kind: QueueKind; initialFilter?: string }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(initialFilter);
  const [items, setItems] = useState<Array<Record<string, unknown>>>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [message, setMessage] = useState("Loading queue…");
  const filterParam = kind === "memberships" ? "status" : "stage";

  const load = useCallback(async (cursor?: string | null, append = false) => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (filter) params.set(filterParam, filter);
    if (cursor) params.set("cursor", cursor);
    setMessage("Loading queue…");
    try {
      const response = await fetch(`${endpoint[kind]}?${params.toString()}`, { credentials: "same-origin", cache: "no-store" });
      const body = await response.json() as QueueResponse;
      if (!response.ok || body.status !== "ok") {
        setMessage(body.message || "Queue access is unavailable.");
        if (!append) setItems([]);
        return;
      }
      const incoming = body.items || [];
      setItems((current) => append ? [...current, ...incoming] : incoming);
      setNextCursor(body.nextCursor || null);
      setMessage(incoming.length || append ? "" : "No records match this queue.");
    } catch {
      setMessage("Queue access is unavailable.");
      if (!append) setItems([]);
    }
  }, [filter, filterParam, kind, search]);

  useEffect(() => { void load(null, false); }, [load]);

  const columns = useMemo(() => {
    if (kind === "applications") return ["Application", "Customer", "Partner", "Package", "Stage", "Payment", "Submitted"];
    if (kind === "finance") return ["Payment", "Application", "Customer", "Amount", "Stage", "Reference", "Submitted"];
    return ["Membership", "Application", "Customer", "Package", "Status", "Payment", "Activated"];
  }, [kind]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
        <input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void load(null, false); }} placeholder="Search ID, customer or partner" className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500" />
        <select value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
          <option value="">All statuses</option>
          {stageOptions[kind].map((value) => <option key={value} value={value}>{value}</option>)}
        </select>
        <button type="button" onClick={() => void load(null, false)} className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Refresh</button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500"><tr>{columns.map((column) => <th key={column} className="px-4 py-3 font-semibold">{column}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item, index) => {
                if (kind === "applications") return (
                  <tr key={String(item.applicationId || index)} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold"><a className="text-slate-950 underline-offset-2 hover:underline" href={`/operations/applications/${item.applicationId}`}>{String(item.applicationId)}</a></td>
                    <td className="px-4 py-3">{String(item.customerName || "—")}</td>
                    <td className="px-4 py-3">{String(item.partnerCode || "—")}</td>
                    <td className="px-4 py-3">{String(item.membershipCode || "—")}</td>
                    <td className="px-4 py-3">{badge(item.stage)}</td>
                    <td className="px-4 py-3">{String(item.paymentStage || "—")}</td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(item.submittedAt || item.createdAt)}</td>
                  </tr>
                );
                if (kind === "finance") return (
                  <tr key={String(item.paymentId || index)} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold">{String(item.paymentId || "—")}</td>
                    <td className="px-4 py-3">{String(item.applicationId || "—")}</td>
                    <td className="px-4 py-3">{String(item.customerName || "—")}</td>
                    <td className="px-4 py-3">{formatMoney(item.amountMinorUnits, item.currency)}</td>
                    <td className="px-4 py-3">{badge(item.stage)}</td>
                    <td className="px-4 py-3 font-mono text-xs">{String(item.transactionReference || "—")}</td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(item.submittedAt || item.createdAt)}</td>
                  </tr>
                );
                return (
                  <tr key={String(item.membershipId || index)} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold">{String(item.membershipId || "—")}</td>
                    <td className="px-4 py-3">{String(item.applicationId || "—")}</td>
                    <td className="px-4 py-3">{String(item.customerName || "—")}</td>
                    <td className="px-4 py-3">{String(item.membershipCode || "—")}</td>
                    <td className="px-4 py-3">{badge(item.status)}</td>
                    <td className="px-4 py-3">{String(item.paymentStage || "—")}</td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(item.activatedAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {message ? <div className="border-t border-slate-100 px-4 py-4 text-sm text-slate-600">{message}</div> : null}
        {nextCursor ? <div className="border-t border-slate-100 p-4"><button type="button" onClick={() => void load(nextCursor, true)} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800">Load more</button></div> : null}
      </div>
    </div>
  );
}
