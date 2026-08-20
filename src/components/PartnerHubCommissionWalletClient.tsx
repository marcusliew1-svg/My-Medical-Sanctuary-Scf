"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

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

type RecentCommissionTransaction = {
  transactionId: string;
  membershipCode: string;
  currency: string;
  status: string;
  amountMinorUnits: number;
  clawbackMinorUnits: number;
  createdAt: string;
};

type WalletResponse = {
  status: string;
  message?: string;
  partnerId?: string;
  commissions?: CommissionSummary[];
  recentTransactions?: RecentCommissionTransaction[];
  generatedAt?: string;
  note?: string;
};

function money(value: number, currency: string): string {
  return new Intl.NumberFormat("en-MY", { style: "currency", currency }).format(value / 100);
}

function displayDate(value: string): string {
  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) return "—";
  return new Intl.DateTimeFormat("en-MY", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export function PartnerHubCommissionWalletClient() {
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState<WalletResponse | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const request = await fetch("/api/partner-hub/commission-wallet", { cache: "no-store", credentials: "include" });
      const payload = (await request.json()) as WalletResponse;
      setResponse(payload);
    } catch {
      setResponse({ status: "hub_unavailable", message: "Commission Wallet could not be reached." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-10 md:px-6 md:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">MMS Partner Hub</p>
            <h1 className="mt-2 font-[var(--font-playfair)] text-4xl text-stone-900">Commission Wallet</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">Read-only commercial commission status. Approval, payout and reversal remain Finance-controlled.</p>
          </div>
          <Link href="/partner-hub" className="text-sm font-semibold text-emerald-700">← Dashboard</Link>
        </div>

        {loading ? <p className="mt-8 rounded-2xl bg-white p-6 text-stone-500 shadow-sm">Loading Commission Wallet…</p> : null}

        {!loading && response?.status !== "ok" ? (
          <div className="mt-8 rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-stone-900">Wallet unavailable</h2>
            <p className="mt-3 text-sm text-stone-600">{response?.message || "Commission information could not be loaded."}</p>
            <button onClick={() => void load()} className="mt-5 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white">Try again</button>
          </div>
        ) : null}

        {!loading && response?.status === "ok" ? (
          <>
            <div className="mt-8 rounded-3xl bg-stone-900 p-6 text-white shadow-sm md:p-8">
              <p className="text-xs uppercase tracking-[0.18em] text-stone-400">Partner</p>
              <p className="mt-2 text-2xl font-semibold">{response.partnerId}</p>
              <p className="mt-2 text-sm text-stone-400">Figures are grouped by currency. No cross-currency total is shown.</p>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              {(response.commissions || []).map((summary) => (
                <section key={summary.currency} className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-stone-900">{summary.currency}</h2>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Commercial ledger</span>
                  </div>
                  <dl className="mt-6 space-y-3 text-sm">
                    {[
                      ["Pending eligibility", summary.pendingMinorUnits],
                      ["Eligible", summary.eligibleMinorUnits],
                      ["Held", summary.heldMinorUnits],
                      ["Approved", summary.approvedMinorUnits],
                      ["Paid", summary.paidMinorUnits],
                      ["Reversed", summary.reversedMinorUnits],
                      ["Clawback", summary.clawbackMinorUnits],
                    ].map(([label, value]) => (
                      <div key={String(label)} className="flex items-center justify-between border-b border-stone-100 pb-3 last:border-0">
                        <dt className="text-stone-500">{label}</dt>
                        <dd className="font-semibold text-stone-900">{money(Number(value), summary.currency)}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ))}
            </div>

            {(response.commissions || []).length === 0 ? (
              <p className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 text-sm text-stone-500">No commission transactions yet.</p>
            ) : null}

            {(response.recentTransactions || []).length > 0 ? (
              <section className="mt-8 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">Recent activity</p>
                  <h2 className="mt-2 text-2xl font-semibold text-stone-900">Commission transactions</h2>
                  <p className="mt-2 text-sm text-stone-500">Latest 50 commercial ledger entries. Member identity, payout references and Finance operator details are not shown.</p>
                </div>
                <div className="mt-6 space-y-3">
                  {(response.recentTransactions || []).map((transaction) => (
                    <div key={transaction.transactionId} className="rounded-2xl border border-stone-100 bg-stone-50 p-4 sm:flex sm:items-center sm:justify-between sm:gap-6">
                      <div>
                        <p className="text-sm font-semibold text-stone-900">{transaction.membershipCode}</p>
                        <p className="mt-1 text-xs text-stone-500">{transaction.transactionId} · {displayDate(transaction.createdAt)}</p>
                      </div>
                      <div className="mt-3 text-left sm:mt-0 sm:text-right">
                        <p className="text-sm font-semibold text-stone-900">{money(transaction.amountMinorUnits, transaction.currency)}</p>
                        <p className="mt-1 text-xs text-stone-500">{transaction.status}{transaction.clawbackMinorUnits > 0 ? ` · clawback ${money(transaction.clawbackMinorUnits, transaction.currency)}` : ""}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <p className="mt-6 text-xs leading-5 text-stone-400">{response.note}</p>
          </>
        ) : null}
      </div>
    </main>
  );
}
