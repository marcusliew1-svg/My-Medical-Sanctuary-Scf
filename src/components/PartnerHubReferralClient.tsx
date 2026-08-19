"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type ReferralResponse = {
  status: string;
  message?: string;
  partnerId?: string;
  referralUrl?: string;
  qrPayload?: string;
  note?: string;
};

export function PartnerHubReferralClient() {
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [response, setResponse] = useState<ReferralResponse | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const request = await fetch("/api/partner-hub/referral", { cache: "no-store", credentials: "include" });
      setResponse((await request.json()) as ReferralResponse);
    } catch {
      setResponse({ status: "hub_unavailable", message: "Referral information could not be reached." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function copyReferral() {
    if (!response?.referralUrl) return;
    try {
      await navigator.clipboard.writeText(response.referralUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-10 md:px-6 md:py-14">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">MMS Partner Hub</p>
            <h1 className="mt-2 font-[var(--font-playfair)] text-4xl text-stone-900">Referral tools</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">Your controlled first-party attribution link. It is available only while your Partner account remains eligible to sell.</p>
          </div>
          <Link href="/partner-hub" className="shrink-0 text-sm font-semibold text-emerald-700">← Dashboard</Link>
        </div>

        {loading ? <p className="mt-8 rounded-2xl bg-white p-6 text-stone-500 shadow-sm">Loading referral tools…</p> : null}

        {!loading && response?.status !== "ok" ? (
          <div className="mt-8 rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-stone-900">Referral sharing unavailable</h2>
            <p className="mt-3 text-sm text-stone-600">{response?.message || "An active referral link is not available for this Partner account."}</p>
          </div>
        ) : null}

        {!loading && response?.status === "ok" && response.referralUrl ? (
          <div className="mt-8 space-y-6">
            <section className="rounded-3xl bg-stone-900 p-7 text-white shadow-sm md:p-9">
              <p className="text-xs uppercase tracking-[0.18em] text-stone-400">Permanent Partner ID</p>
              <p className="mt-2 text-2xl font-semibold">{response.partnerId}</p>
              <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-stone-400">Referral URL</p>
                <p className="mt-2 break-all text-sm leading-6 text-stone-100">{response.referralUrl}</p>
              </div>
              <button onClick={() => void copyReferral()} className="mt-5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-stone-900">
                {copied ? "Copied" : "Copy referral link"}
              </button>
            </section>

            <section className="rounded-3xl border border-stone-200 bg-white p-7 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">QR readiness</p>
              <h2 className="mt-2 text-2xl font-semibold text-stone-900">Use the same controlled URL</h2>
              <p className="mt-3 text-sm leading-6 text-stone-600">When the Hub adds downloadable QR artwork, its payload must be exactly the same first-party referral URL shown above. No third-party redirect or alternate tracking destination should be substituted.</p>
              <p className="mt-4 break-all rounded-2xl bg-stone-50 p-4 font-mono text-xs text-stone-600">{response.qrPayload}</p>
            </section>

            <p className="text-xs leading-5 text-stone-400">{response.note}</p>
          </div>
        ) : null}
      </div>
    </main>
  );
}
