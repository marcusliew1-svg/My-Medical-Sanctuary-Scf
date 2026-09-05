"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type ResponseBody = { status: string; message?: string; items?: Array<Record<string, unknown>>; nextCursor?: string | null };
const statuses = ["Pending Eligibility", "Eligible", "Held", "Approved", "Paid", "Reversed"];

function money(value: unknown, currency: unknown) {
  const amount = Number(value || 0) / 100;
  try { return new Intl.NumberFormat("en-MY", { style: "currency", currency: String(currency || "MYR") }).format(amount); }
  catch { return `${String(currency || "")} ${amount.toFixed(2)}`.trim(); }
}

function rate(value: unknown) {
  const n = Number(value || 0);
  return `${(n * 100).toFixed(2).replace(/\.00$/, "")}%`;
}

function date(value: unknown) {
  if (!value) return "—";
  const d = new Date(String(value));
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString("en-MY", { dateStyle: "medium", timeStyle: "short" });
}

export default function CommissionQueueClient() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [items, setItems] = useState<Array<Record<string, unknown>>>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [message, setMessage] = useState("Loading commission queue…");

  const load = useCallback(async (cursor?: string | null, append = false) => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (status) params.set("status", status);
    if (cursor) params.set("cursor", cursor);
    setMessage("Loading commission queue…");
    try {
      const response = await fetch(`/api/operations/commissions?${params.toString()}`, { credentials: "same-origin", cache: "no-store" });
      const body = await response.json() as ResponseBody;
      if (!response.ok || body.status !== "ok") {
        setMessage(body.message || "Commission queue is unavailable.");
        if (!append) setItems([]);
        return;
      }
      const incoming = body.items || [];
      setItems((current) => append ? [...current, ...incoming] : incoming);
      setNextCursor(body.nextCursor || null);
      setMessage(incoming.length || append ? "" : "No commission transactions match this queue.");
    } catch {
      setMessage("Commission queue is unavailable.");
      if (!append) setItems([]);
    }
  }, [search, status]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [load]);

  return <div className="space-y-4">
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row">
      <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") void load(); }} placeholder="Search commission, application, membership or partner" className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm" />
      <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-slate-300 px-3 py-2 text-sm"><option value="">All statuses</option>{statuses.map((value) => <option key={value}>{value}</option>)}</select>
      <button onClick={() => void load()} className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Refresh</button>
    </div>
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto"><table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500"><tr>{["Commission","Partner","Package","Revenue","Rule / Rate","Gross","Approved","Status","Created"].map((c) => <th key={c} className="px-4 py-3 font-semibold">{c}</th>)}</tr></thead>
        <tbody className="divide-y divide-slate-100">{items.map((item, index) => <tr key={String(item.transactionId || index)} className="hover:bg-slate-50">
          <td className="px-4 py-3 font-semibold"><Link href={`/operations/commissions/${item.transactionId}`} className="hover:underline">{String(item.transactionId || "—")}</Link></td>
          <td className="px-4 py-3">{String(item.partnerCode || "—")}</td><td className="px-4 py-3">{String(item.membershipCode || "—")}</td>
          <td className="px-4 py-3">{money(item.eligibleRevenueMinorUnits, item.currency)}</td><td className="px-4 py-3">{String(item.ruleVersion || "—")} · {rate(item.commissionRate)}</td>
          <td className="px-4 py-3">{money(item.grossCommissionMinorUnits, item.currency)}</td><td className="px-4 py-3">{money(item.approvedCommissionMinorUnits, item.currency)}</td>
          <td className="px-4 py-3"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{String(item.status || "—")}</span></td><td className="px-4 py-3 text-slate-600">{date(item.createdAt)}</td>
        </tr>)}</tbody>
      </table></div>
      {message ? <div className="border-t border-slate-100 px-4 py-4 text-sm text-slate-600">{message}</div> : null}
      {nextCursor ? <div className="border-t border-slate-100 p-4"><button onClick={() => void load(nextCursor, true)} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold">Load more</button></div> : null}
    </div>
  </div>;
}
