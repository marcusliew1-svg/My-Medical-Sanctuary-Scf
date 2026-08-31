"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  IngestionBatch,
  SourceConnectorConfig,
} from "@/lib/healthIntelligence/ingestion";

type Snapshot = {
  realDataEnabled: boolean;
  connectors: SourceConnectorConfig[];
  batches: IngestionBatch[];
  metrics: Record<string, number>;
  marketCoverage: Array<{
    market: string;
    approvedSources: number;
    productsObserved: number;
    verifiedObservations: number;
    staleObservations: number;
    unresolvedItems: number;
  }>;
};
const headers =
  "source_key,country,observed_product_name,ingredient,manufacturer,strength,dosage_form,pack,price,currency,basis,observed_date,source_reference";
const sample =
  "DEMO-MY-001,MY,Northstar A,Clarionex,Fictional Meridian Labs,10mg,tablet,30,84,MYR,retail_cash_price,2026-08-29,DEMO-REFERENCE";
const control =
  "min-h-10 border border-slate-300 bg-white px-3 text-sm outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-200";

function percentage(value = 0) {
  return `${Math.round(value * 100)}%`;
}

export function HealthIntelligenceIngestionPanel() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [selectedConnector, setSelectedConnector] = useState("");
  const [csv, setCsv] = useState(`${headers}\n${sample}`);
  const [activeBatchId, setActiveBatchId] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [message, setMessage] = useState("");
  const activeBatch = useMemo(
    () => snapshot?.batches.find((batch) => batch.id === activeBatchId),
    [activeBatchId, snapshot],
  );
  useEffect(() => {
    void fetch("/api/internal/health-intelligence/ingestion")
      .then((response) => response.json())
      .then((body) => {
        setSnapshot(body.snapshot || null);
        setSelectedConnector(body.snapshot?.connectors?.[0]?.id || "");
      })
      .catch(() => setMessage("Ingestion operations are unavailable."));
  }, []);

  async function mutate(payload: Record<string, unknown>) {
    setMessage("");
    const response = await fetch("/api/internal/health-intelligence/ingestion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await response.json();
    if (body.snapshot) setSnapshot(body.snapshot);
    if (body.batch?.id) setActiveBatchId(body.batch.id);
    setMessage(
      response.ok
        ? `${payload.action} completed with audit history.`
        : body.message || "Ingestion operation failed.",
    );
    return body;
  }

  async function prepare() {
    const connector = snapshot?.connectors.find(
      (item) => item.id === selectedConnector,
    );
    if (!connector) return;
    setConfirmed(false);
    await mutate({
      action: "prepare_csv",
      sourceId: connector.sourceId,
      connectorId: connector.id,
      filename: "mms-controlled-preview.csv",
      csv,
    });
  }

  return (
    <section className="border-b border-slate-300 bg-white px-5 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-amber-700">
              Ingestion
            </p>
            <h2 className="mt-2 font-serif text-3xl">
              Assisted collection, controlled by people
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Validate, preview, resolve, confirm, then import as collected and
              unverified. No connector can verify or publish.
            </p>
          </div>
          <span className="border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-900">
            REAL DATA {snapshot?.realDataEnabled ? "ON" : "OFF"}
          </span>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {Object.entries(snapshot?.metrics || {}).map(([label, value]) => (
            <div key={label} className="border border-slate-200 bg-slate-50 p-3">
              <strong className="text-xl">
                {label === "sourceCoverage" ? value : percentage(value)}
              </strong>
              <p className="mt-1 text-xs text-slate-600">
                {label.replace(/([A-Z])/g, " $1").toLowerCase()}
              </p>
            </div>
          ))}
        </div>

        {message ? (
          <p role="status" className="mt-4 border border-slate-300 bg-slate-50 p-3 text-sm">
            {message}
          </p>
        ) : null}

        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_1.5fr]">
          <div className="grid content-start gap-3 border border-slate-300 bg-slate-50 p-4">
            <h3 className="font-bold">Controlled CSV import</h3>
            <label className="text-xs font-bold" htmlFor="ingestion-connector">
              Approved connector
            </label>
            <select
              id="ingestion-connector"
              value={selectedConnector}
              onChange={(event) => setSelectedConnector(event.target.value)}
              className={control}
            >
              {snapshot?.connectors.map((connector) => (
                <option key={connector.id} value={connector.id}>
                  {connector.market} · {connector.displayName} · {connector.status}
                </option>
              ))}
            </select>
            <label className="text-xs font-bold" htmlFor="ingestion-csv">
              Source rows
            </label>
            <textarea
              id="ingestion-csv"
              value={csv}
              onChange={(event) => setCsv(event.target.value)}
              rows={10}
              className="border border-slate-300 p-3 font-mono text-xs"
            />
            <button
              type="button"
              onClick={prepare}
              className="bg-slate-950 px-4 py-3 text-sm font-bold text-white"
            >
              Validate and prepare batch
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-300 bg-white">
            <div className="border-b border-slate-300 p-4">
              <h3 className="font-bold">Batch preview and row lineage</h3>
              <p className="mt-1 text-xs text-slate-500">
                Original values and suggestions remain separate. Ambiguity is
                never selected silently.
              </p>
            </div>
            {activeBatch ? (
              <>
                <div className="grid grid-cols-2 gap-2 border-b bg-slate-50 p-4 text-xs sm:grid-cols-4">
                  <span>Status: <strong>{activeBatch.status}</strong></span>
                  <span>Accepted: <strong>{activeBatch.accepted}</strong></span>
                  <span>Rejected: <strong>{activeBatch.rejected}</strong></span>
                  <span>Unresolved: <strong>{activeBatch.unresolved}</strong></span>
                </div>
                <table className="min-w-full text-left text-xs">
                  <thead className="bg-slate-900 text-white">
                    <tr>
                      <th className="p-3">Original source</th>
                      <th className="p-3">Normalized proposal</th>
                      <th className="p-3">Product resolution</th>
                      <th className="p-3">Issues / action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeBatch.rows.map((row) => (
                      <tr key={row.id} className="border-b align-top">
                        <td className="p-3">
                          <strong>{row.originalSourceValue}</strong>
                          <br />
                          <span className="text-slate-500">
                            {row.originalLanguage} · {row.sourceItemIdentifier}
                          </span>
                        </td>
                        <td className="p-3">
                          {String(row.normalized.ingredient || "—")} ·{" "}
                          {String(row.normalized.strength || "—")}
                          <br />
                          {String(row.normalized.dosage_form || "—")} · pack{" "}
                          {String(row.normalized.pack || "—")}
                        </td>
                        <td className="p-3">
                          <strong>{row.productResolution.outcome.replaceAll("_", " ")}</strong>
                          <br />
                          <span className="text-emerald-700">
                            matched: {row.productResolution.matched.join(", ") || "none"}
                          </span>
                          <br />
                          <span className="text-red-700">
                            mismatched: {row.productResolution.mismatched.join(", ") || "none"}
                          </span>
                        </td>
                        <td className="p-3">
                          {[...row.errors, ...row.warnings].join(" · ") || "No issues"}
                          {row.productResolution.candidateIds.length === 1 &&
                          !row.resolvedProductId &&
                          row.productResolution.outcome !== "safety_exception" ? (
                            <button
                              type="button"
                              onClick={() =>
                                void mutate({
                                  action: "resolve_row",
                                  batchId: activeBatch.id,
                                  rowId: row.id,
                                  candidateId: row.productResolution.candidateIds[0],
                                })
                              }
                              className="mt-2 block border border-slate-500 px-2 py-1 font-bold"
                            >
                              Accept proposed identity
                            </button>
                          ) : row.resolvedProductId ? (
                            <span className="mt-2 block font-bold text-emerald-700">
                              Human identity resolution recorded
                            </span>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {activeBatch.status === "ready" ? (
                  <div className="border-t bg-amber-50 p-4">
                    <label className="flex items-start gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={confirmed}
                        onChange={(event) => setConfirmed(event.target.checked)}
                      />
                      I confirm these accepted rows may be imported as collected
                      and unverified. Nothing will be published.
                    </label>
                    <button
                      type="button"
                      disabled={!confirmed}
                      onClick={() =>
                        void mutate({
                          action: "confirm_import",
                          batchId: activeBatch.id,
                          confirmed,
                        })
                      }
                      className="mt-3 bg-slate-950 px-4 py-2 text-sm font-bold text-white disabled:opacity-40"
                    >
                      Confirm controlled import
                    </button>
                  </div>
                ) : null}
              </>
            ) : (
              <p className="p-5 text-sm text-slate-500">
                Prepare a batch to inspect row-level lineage and issues.
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div className="overflow-x-auto border border-slate-300">
            <table className="min-w-full text-left text-xs">
              <thead className="bg-slate-900 text-white">
                <tr><th className="p-3">Recent batch</th><th className="p-3">Counts</th><th className="p-3">Status</th></tr>
              </thead>
              <tbody>
                {snapshot?.batches.map((batch) => (
                  <tr key={batch.id} className="border-b">
                    <td className="p-3">
                      <button className="font-bold underline" onClick={() => setActiveBatchId(batch.id)}>
                        {batch.market} · {batch.sourceFileReference}
                      </button>
                      <br /><span className="text-slate-500">{batch.connectorType} · {batch.id.slice(0, 8)}</span>
                    </td>
                    <td className="p-3">{batch.accepted} accepted · {batch.rejected} rejected · {batch.unresolved} unresolved</td>
                    <td className="p-3">{batch.status.replaceAll("_", " ")}</td>
                  </tr>
                ))}
                {!snapshot?.batches.length ? <tr><td colSpan={3} className="p-4 text-slate-500">No batches yet.</td></tr> : null}
              </tbody>
            </table>
          </div>
          <div className="overflow-x-auto border border-slate-300">
            <table className="min-w-full text-left text-xs">
              <thead className="bg-slate-900 text-white">
                <tr><th className="p-3">Market</th><th className="p-3">Sources</th><th className="p-3">Observed</th><th className="p-3">Verified</th><th className="p-3">Stale</th><th className="p-3">Unresolved</th></tr>
              </thead>
              <tbody>
                {snapshot?.marketCoverage.map((row) => (
                  <tr key={row.market} className="border-b">
                    <td className="p-3 font-bold">{row.market}</td>
                    <td className="p-3">{row.approvedSources}</td>
                    <td className="p-3">{row.productsObserved}</td>
                    <td className="p-3">{row.verifiedObservations}</td>
                    <td className="p-3">{row.staleObservations}</td>
                    <td className="p-3">{row.unresolvedItems}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
