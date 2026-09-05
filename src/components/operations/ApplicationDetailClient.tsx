"use client";

import { useEffect, useState } from "react";

type Detail = {
  application: Record<string, unknown>;
  events: Array<Record<string, unknown>>;
};

function formatDate(value: unknown) {
  if (!value) return "—";
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString("en-MY", { dateStyle: "medium", timeStyle: "short" });
}

export default function ApplicationDetailClient({ applicationId }: { applicationId: string }) {
  const [detail, setDetail] = useState<Detail | null>(null);
  const [message, setMessage] = useState("Loading application…");

  useEffect(() => {
    let active = true;
    fetch(`/api/operations/applications/${encodeURIComponent(applicationId)}`, { credentials: "same-origin", cache: "no-store" })
      .then(async (response) => ({ response, body: await response.json() }))
      .then(({ response, body }) => {
        if (!active) return;
        if (!response.ok || body.status !== "ok") {
          setMessage(body.message || "Application access is unavailable.");
          return;
        }
        setDetail(body.detail as Detail);
        setMessage("");
      })
      .catch(() => active && setMessage("Application access is unavailable."));
    return () => { active = false; };
  }, [applicationId]);

  if (!detail) return <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">{message}</div>;

  const app = detail.application;
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Application</div><h2 className="mt-1 text-xl font-semibold text-slate-950">{String(app.applicationId)}</h2></div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{String(app.stage || "—")}</span>
        </div>
        <dl className="mt-6 grid gap-5 sm:grid-cols-2">
          <div><dt className="text-xs uppercase tracking-wide text-slate-500">Customer</dt><dd className="mt-1 font-medium text-slate-900">{String(app.customerName || "—")}</dd></div>
          <div><dt className="text-xs uppercase tracking-wide text-slate-500">Partner</dt><dd className="mt-1 font-medium text-slate-900">{String(app.partnerCode || "—")}</dd></div>
          <div><dt className="text-xs uppercase tracking-wide text-slate-500">Package</dt><dd className="mt-1 font-medium text-slate-900">{String(app.membershipCode || "—")}</dd></div>
          <div><dt className="text-xs uppercase tracking-wide text-slate-500">Submitted</dt><dd className="mt-1 font-medium text-slate-900">{formatDate(app.submittedAt)}</dd></div>
          {app.customerEmail ? <div><dt className="text-xs uppercase tracking-wide text-slate-500">Email</dt><dd className="mt-1 font-medium text-slate-900">{String(app.customerEmail)}</dd></div> : null}
          {app.customerPhone ? <div><dt className="text-xs uppercase tracking-wide text-slate-500">Phone</dt><dd className="mt-1 font-medium text-slate-900">{String(app.customerPhone)}</dd></div> : null}
          <div><dt className="text-xs uppercase tracking-wide text-slate-500">Payment</dt><dd className="mt-1 font-medium text-slate-900">{String(app.paymentStage || "—")}</dd></div>
          <div><dt className="text-xs uppercase tracking-wide text-slate-500">Membership</dt><dd className="mt-1 font-medium text-slate-900">{String(app.membershipStatus || "—")}</dd></div>
        </dl>
        <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">PR #23 is read-only. Application mutation controls are intentionally not exposed in this console foundation.</div>
      </section>

      <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-950">Commercial workflow timeline</h3>
        <div className="mt-5 space-y-5">
          {detail.events.length ? detail.events.map((event, index) => (
            <div key={`${String(event.entityPublicId)}-${index}`} className="relative border-l border-slate-200 pl-4">
              <div className="absolute -left-1.5 top-1 h-3 w-3 rounded-full border-2 border-white bg-slate-700" />
              <div className="text-sm font-semibold text-slate-900">{String(event.entityType)} · {String(event.nextState)}</div>
              <div className="mt-1 text-xs text-slate-500">{formatDate(event.occurredAt)} · {String(event.actor || "system")}</div>
              {event.reason ? <div className="mt-1 text-xs text-slate-600">{String(event.reason)}</div> : null}
            </div>
          )) : <div className="text-sm text-slate-500">No workflow events recorded.</div>}
        </div>
      </aside>
    </div>
  );
}
