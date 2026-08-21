"use client";

import { useEffect, useState } from "react";

type Summary = {
  applicationsNeedingReview: number;
  documentsOutstanding: number;
  paymentsAwaitingClearance: number;
  membershipsAwaitingPreparation: number;
  membershipsAwaitingActivation: number;
};

const cards: Array<{ key: keyof Summary; label: string; href: string }> = [
  { key: "applicationsNeedingReview", label: "Applications needing review", href: "/operations/applications" },
  { key: "documentsOutstanding", label: "Documents outstanding", href: "/operations/applications?stage=Documents%20Outstanding" },
  { key: "paymentsAwaitingClearance", label: "Payments awaiting clearance", href: "/operations/finance?stage=Submitted" },
  { key: "membershipsAwaitingPreparation", label: "Memberships awaiting preparation", href: "/operations/memberships" },
  { key: "membershipsAwaitingActivation", label: "Memberships awaiting activation", href: "/operations/memberships?status=Pending%20Activation" },
];

export default function OperationsDashboardClient() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [message, setMessage] = useState("Loading operational queues…");

  useEffect(() => {
    let active = true;
    fetch("/api/operations/dashboard", { credentials: "same-origin", cache: "no-store" })
      .then(async (response) => ({ response, body: await response.json() }))
      .then(({ response, body }) => {
        if (!active) return;
        if (!response.ok || body.status !== "ok") {
          setMessage(body.message || "Operations access is unavailable.");
          return;
        }
        setSummary(body.summary as Summary);
        setMessage("");
      })
      .catch(() => active && setMessage("Operations access is unavailable."));
    return () => { active = false; };
  }, []);

  if (!summary) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">{message}</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <a key={card.key} href={card.href} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="text-3xl font-semibold tracking-tight text-slate-950">{summary[card.key]}</div>
          <div className="mt-2 text-sm font-medium text-slate-700">{card.label}</div>
        </a>
      ))}
    </div>
  );
}
