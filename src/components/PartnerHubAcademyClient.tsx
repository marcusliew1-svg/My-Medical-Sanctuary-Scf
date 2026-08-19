"use client";

import { useEffect, useState } from "react";

type Academy = {
  trainingVersion: string;
  modules: Array<{
    moduleId: string;
    title: string;
    version: string;
    status: "Not Started" | "Completed" | "Refresh Required";
    completedAt?: string;
    acknowledgedAt?: string;
  }>;
  completedModules: number;
  totalModules: number;
  trainingComplete: boolean;
  assessment: {
    status: "Not Attempted" | "Passed" | "Failed";
    overallScore?: number;
    noMedicalClaimsScore?: number;
    completedAt?: string;
  };
  certification: {
    status: "Not Issued" | "Current" | "Renewal Due" | "Expired";
    issuedAt?: string;
    expiresAt?: string;
    renewalDueAt?: string;
  };
};

function dateLabel(value?: string): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("en-MY", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

export function PartnerHubAcademyClient() {
  const [academy, setAcademy] = useState<Academy | null>(null);
  const [message, setMessage] = useState("Loading Academy…");

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const response = await fetch("/api/partner-hub/academy", { cache: "no-store", credentials: "include" });
        const payload = (await response.json()) as { status: string; academy?: Academy; message?: string };
        if (!active) return;
        if (!response.ok || !payload.academy) {
          setMessage(payload.message || "Academy is unavailable.");
          return;
        }
        setAcademy(payload.academy);
        setMessage("");
      } catch {
        if (active) setMessage("Academy could not be reached.");
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
            <h1 className="mt-2 font-[var(--font-playfair)] text-4xl text-stone-900">Partner Academy</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">Controlled Sales Partner training, assessment and certification status.</p>
          </div>
          <a href="/partner-hub" className="text-sm font-semibold text-emerald-700">Back to dashboard</a>
        </div>

        {!academy ? (
          <div className="mt-8 rounded-3xl border border-stone-200 bg-white p-8 text-stone-600 shadow-sm">{message}</div>
        ) : (
          <>
            <section className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Training</p>
                <p className="mt-2 text-3xl font-semibold text-stone-900">{academy.completedModules}/{academy.totalModules}</p>
                <p className="mt-2 text-sm text-stone-600">{academy.trainingComplete ? "Core training complete" : "Core training incomplete"}</p>
              </div>
              <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Assessment</p>
                <p className="mt-2 text-3xl font-semibold text-stone-900">{academy.assessment.status}</p>
                <p className="mt-2 text-sm text-stone-600">Overall {academy.assessment.overallScore ?? "—"}% · No Medical Claims {academy.assessment.noMedicalClaimsScore ?? "—"}%</p>
              </div>
              <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Certification</p>
                <p className="mt-2 text-3xl font-semibold text-stone-900">{academy.certification.status}</p>
                <p className="mt-2 text-sm text-stone-600">Expires {dateLabel(academy.certification.expiresAt)}</p>
              </div>
            </section>

            <section className="mt-6 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Core curriculum</p>
                <h2 className="mt-2 font-[var(--font-playfair)] text-3xl text-stone-900">Required modules</h2>
                <p className="mt-2 text-sm text-stone-500">Version {academy.trainingVersion}</p>
              </div>
              <div className="mt-6 space-y-3">
                {academy.modules.map((trainingModule) => (
                  <div key={trainingModule.moduleId} className="flex flex-col gap-3 rounded-2xl bg-stone-50 p-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-500">{trainingModule.moduleId}</p>
                      <p className="mt-1 font-semibold text-stone-900">{trainingModule.title}</p>
                      {trainingModule.completedAt ? <p className="mt-1 text-xs text-stone-500">Completed {dateLabel(trainingModule.completedAt)}</p> : null}
                    </div>
                    <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${trainingModule.status === "Completed" ? "bg-emerald-50 text-emerald-700" : trainingModule.status === "Refresh Required" ? "bg-amber-50 text-amber-700" : "bg-stone-200 text-stone-700"}`}>
                      {trainingModule.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-6 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Certification record</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-3 text-sm">
                <div><p className="text-stone-500">Issued</p><p className="mt-1 font-semibold text-stone-900">{dateLabel(academy.certification.issuedAt)}</p></div>
                <div><p className="text-stone-500">Renewal due</p><p className="mt-1 font-semibold text-stone-900">{dateLabel(academy.certification.renewalDueAt)}</p></div>
                <div><p className="text-stone-500">Expires</p><p className="mt-1 font-semibold text-stone-900">{dateLabel(academy.certification.expiresAt)}</p></div>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
