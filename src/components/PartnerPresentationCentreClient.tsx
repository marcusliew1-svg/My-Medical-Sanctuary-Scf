"use client";

import { useEffect, useState } from "react";

type Asset = {
  assetId: string;
  title: string;
  category: "Membership" | "Brand" | "Education" | "Compliance" | "Campaign";
  version: string;
  effectiveFrom: string;
  expiresAt?: string;
  contentUrl: string;
  approvedBy: string;
  approvedAt: string;
};

function dateLabel(value?: string): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("en-MY", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

export function PartnerPresentationCentreClient() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [message, setMessage] = useState("Loading approved materials…");

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const response = await fetch("/api/partner-hub/presentation-centre", { cache: "no-store", credentials: "include" });
        const payload = (await response.json()) as { status: string; assets?: Asset[]; message?: string };
        if (!active) return;
        if (!response.ok || payload.status !== "ok") {
          setMessage(payload.message || "Presentation Centre is unavailable.");
          return;
        }
        setAssets(payload.assets || []);
        setMessage("");
      } catch {
        if (active) setMessage("Presentation Centre could not be reached.");
      }
    })();
    return () => { active = false; };
  }, []);

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-10 md:px-6 md:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">MMS Partner Hub</p>
            <h1 className="mt-2 font-[var(--font-playfair)] text-4xl text-stone-900">Presentation Centre</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">Only current, approved and effective-dated MMS materials are shown here. Partners cannot upload, edit or replace controlled materials.</p>
          </div>
          <a href="/partner-hub" className="text-sm font-semibold text-emerald-700">Back to dashboard</a>
        </div>

        {message ? <div className="mt-8 rounded-3xl border border-stone-200 bg-white p-8 text-stone-600 shadow-sm">{message}</div> : null}

        {!message && assets.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-stone-200 bg-white p-8 text-stone-600 shadow-sm">No approved materials are currently effective for Partner use.</div>
        ) : null}

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {assets.map((asset) => (
            <article key={`${asset.assetId}:${asset.version}`} className="flex flex-col rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{asset.category}</span>
                <span className="text-xs text-stone-400">v{asset.version}</span>
              </div>
              <h2 className="mt-5 text-xl font-semibold text-stone-900">{asset.title}</h2>
              <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <div><dt className="text-stone-500">Effective</dt><dd className="mt-1 font-medium text-stone-900">{dateLabel(asset.effectiveFrom)}</dd></div>
                <div><dt className="text-stone-500">Expires</dt><dd className="mt-1 font-medium text-stone-900">{dateLabel(asset.expiresAt)}</dd></div>
                <div className="col-span-2"><dt className="text-stone-500">Approved</dt><dd className="mt-1 font-medium text-stone-900">{dateLabel(asset.approvedAt)} · {asset.approvedBy}</dd></div>
              </dl>
              <a href={asset.contentUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex w-fit rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white">Open approved material</a>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
          Do not use superseded, downloaded or privately modified copies for customer-facing presentations. Always open the current controlled version from this page.
        </div>
      </div>
    </main>
  );
}
