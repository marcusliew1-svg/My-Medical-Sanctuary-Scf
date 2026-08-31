"use client";

import { useEffect, useMemo, useState } from "react";
import {
  canMoveObservation,
  operationQueue,
  type OperationalObservation,
  type SourceRegistryRecord,
} from "@/lib/healthIntelligence/operations";

type Snapshot = {
  sources: SourceRegistryRecord[];
  observations: OperationalObservation[];
  auditEvents: Array<{
    id: string;
    action: string;
    actor: string;
    occurredAt: string;
  }>;
};
const queues = [
  "new_observations",
  "unresolved_products",
  "source_review",
  "verification_queue",
  "publication_approval",
  "reverification_due",
  "rejected_exception",
] as const;
const inputClass =
  "min-h-10 border border-slate-300 bg-white px-3 text-sm outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-200";

const nextStage: Partial<
  Record<
    OperationalObservation["workflowStage"],
    OperationalObservation["workflowStage"]
  >
> = {
  collected: "identity_review",
  identity_review: "basis_review",
  basis_review: "source_review",
  source_review: "pending_verification",
  pending_verification: "verified",
  verified: "publication_approved",
  needs_reverification: "pending_verification",
  expired: "identity_review",
};

export function HealthIntelligenceOperationsPanel({
  demoMode,
}: {
  demoMode: boolean;
}) {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [message, setMessage] = useState("");
  const [csv, setCsv] = useState(
    "source_key,country,observed_product_name,ingredient,manufacturer,strength,dosage_form,pack,price,currency,basis,observed_date,source_reference\nDEMO-MY,MY,Northstar A,Clarionex,Fictional Meridian Labs,10mg,tablet,30,84,MYR,retail_cash_price,2026-08-18,DEMO-REFERENCE",
  );
  const [csvPreview, setCsvPreview] = useState<{
    valid: boolean;
    rows: Array<{ rowNumber: number; errors: string[] }>;
    errors: string[];
  } | null>(null);
  useEffect(() => {
    void fetch("/api/internal/health-intelligence/operations")
      .then((response) => response.json())
      .then((body) => setSnapshot(body.snapshot || null))
      .catch(() => setMessage("Operational queues are unavailable."));
  }, []);
  const counts = useMemo(
    () =>
      Object.fromEntries(
        queues.map((queue) => [
          queue,
          snapshot?.observations.filter(
            (item) => operationQueue(item) === queue,
          ).length || 0,
        ]),
      ),
    [snapshot],
  );
  async function mutate(payload: Record<string, unknown>) {
    setMessage("");
    const response = await fetch(
      "/api/internal/health-intelligence/operations",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    const body = await response.json();
    if (body.snapshot) setSnapshot(body.snapshot);
    setMessage(
      response.ok
        ? `${payload.action} recorded with audit history.`
        : body.message || "Operation failed.",
    );
    return body;
  }
  async function addSource(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await mutate({
      action: "create_source",
      source: {
        sourceName: String(data.get("sourceName")),
        country: String(data.get("country")),
        sourceType: String(data.get("sourceType")),
        organizationProvider: String(data.get("organization")),
        urlReference: String(data.get("url")),
        accessMethod: "manual",
        normalPricingBasis: "basis_unverified",
        trustReason: "Pending review",
        verificationMethod: "Human review",
        termsUseNotes: "Review required",
        geographicScope: [String(data.get("country"))],
        medicineScope: "To be reviewed",
        updateFrequency: "manual",
        visibility: "internal_only",
      },
    });
    event.currentTarget.reset();
  }
  async function addObservation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!snapshot?.sources[0]) return;
    const data = new FormData(event.currentTarget);
    const country = String(data.get("country"));
    await mutate({
      action: "create_observation",
      observation: {
        sourceId: String(data.get("sourceId")),
        country,
        originalObservedProductText: String(data.get("productText")),
        originalLanguage: country === "TH" ? "th" : "en",
        productResolutionState: "unresolved",
        observedBrand: "",
        observedIngredient: "",
        observedManufacturer: "",
        observedStrength: String(data.get("strength")),
        observedDosageForm: String(data.get("form")),
        observedReleaseType: "",
        observedPack: String(data.get("pack")),
        price: Number(data.get("price")),
        currency: String(data.get("currency")),
        packQuantity: Number(data.get("pack")),
        basisStatus: data.get("basis") ? "basis_verified" : "basis_unverified",
        basis: String(data.get("basis")) || undefined,
        availability: "unknown",
        observedAt: String(data.get("observedAt")),
        sourceReference: String(data.get("reference")),
        notes: "",
        evidence: [
          { type: "source_url", reference: String(data.get("reference")) },
        ],
        collector: "mms-health-intelligence-reviewer",
      },
    });
  }
  async function previewCsv() {
    const body = await mutate({ action: "csv_dry_run", csv });
    if (body.preview) setCsvPreview(body.preview);
  }
  return (
    <section className="border-b border-slate-300 bg-slate-50 px-5 py-7">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-amber-700">
              Release 2C.1 operations
            </p>
            <h2 className="mt-2 font-serif text-3xl">
              Controlled market data workflow
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Malaysia, Thailand and Singapore first. Collection never publishes
              directly.
            </p>
          </div>
          <span className="border border-slate-300 bg-white px-3 py-2 text-xs font-bold">
            {demoMode ? "DEMO OPERATIONS" : "DATABASE OPERATIONS"}
          </span>
        </div>
        <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-7">
          {queues.map((queue) => (
            <div key={queue} className="border border-slate-200 bg-white p-3">
              <strong className="text-xl">{counts[queue]}</strong>
              <p className="mt-1 text-xs text-slate-600">
                {queue.replaceAll("_", " ")}
              </p>
            </div>
          ))}
        </div>
        {message ? (
          <p
            role="status"
            className="mt-4 border border-slate-300 bg-white p-3 text-sm"
          >
            {message}
          </p>
        ) : null}
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          <form
            onSubmit={addSource}
            className="grid gap-3 border border-slate-300 bg-white p-4"
          >
            <h3 className="font-bold">Add candidate source</h3>
            <input
              name="sourceName"
              required
              placeholder="Source name"
              className={inputClass}
            />
            <select name="country" className={inputClass}>
              <option>MY</option>
              <option>TH</option>
              <option>SG</option>
            </select>
            <select name="sourceType" className={inputClass}>
              <option value="government_regulatory">
                Government / regulatory
              </option>
              <option value="licensed_pharmacy">Licensed pharmacy</option>
              <option value="hospital_clinic">Hospital / clinic</option>
              <option value="manufacturer">Manufacturer</option>
              <option value="manual_quotation">Manual quotation</option>
              <option value="other_verified">Other verified</option>
            </select>
            <input
              name="organization"
              required
              placeholder="Organisation / provider"
              className={inputClass}
            />
            <input
              name="url"
              required
              type="url"
              placeholder="URL or reference"
              className={inputClass}
            />
            <button className="bg-slate-950 px-4 py-2 text-sm font-bold text-white">
              Create candidate
            </button>
          </form>
          <form
            onSubmit={addObservation}
            className="grid gap-3 border border-slate-300 bg-white p-4"
          >
            <h3 className="font-bold">Record observation</h3>
            <select name="sourceId" required className={inputClass}>
              {snapshot?.sources.map((source) => (
                <option key={source.id} value={source.id}>
                  {source.country} · {source.sourceName}
                </option>
              ))}
            </select>
            <div className="grid grid-cols-3 gap-2">
              <select name="country" className={inputClass}>
                <option>MY</option>
                <option>TH</option>
                <option>SG</option>
              </select>
              <select name="currency" className={inputClass}>
                <option>MYR</option>
                <option>THB</option>
                <option>SGD</option>
              </select>
              <input
                name="price"
                required
                type="number"
                min="0"
                step="0.01"
                placeholder="Price"
                className={inputClass}
              />
            </div>
            <input
              name="productText"
              required
              placeholder="Original observed product text"
              className={inputClass}
            />
            <div className="grid grid-cols-3 gap-2">
              <input
                name="strength"
                placeholder="Strength"
                className={inputClass}
              />
              <input name="form" placeholder="Form" className={inputClass} />
              <input
                name="pack"
                required
                type="number"
                min="1"
                placeholder="Pack"
                className={inputClass}
              />
            </div>
            <select name="basis" className={inputClass}>
              <option value="">Basis unverified</option>
              <option value="retail_cash_price">Retail cash</option>
              <option value="pharmacy_list_price">Pharmacy list</option>
              <option value="hospital_price">Hospital</option>
              <option value="manufacturer_list_price">Manufacturer list</option>
              <option value="reimbursed_price">Reimbursed</option>
              <option value="wholesale_price">Wholesale</option>
            </select>
            <input
              name="observedAt"
              required
              type="date"
              className={inputClass}
            />
            <input
              name="reference"
              required
              placeholder="Evidence / reference"
              className={inputClass}
            />
            <button className="bg-slate-950 px-4 py-2 text-sm font-bold text-white">
              Submit as collected
            </button>
          </form>
          <div className="grid content-start gap-3 border border-slate-300 bg-white p-4">
            <h3 className="font-bold">CSV dry run</h3>
            <textarea
              value={csv}
              onChange={(event) => setCsv(event.target.value)}
              rows={9}
              className="border border-slate-300 p-2 font-mono text-xs"
            />
            <button
              type="button"
              onClick={previewCsv}
              className="bg-slate-950 px-4 py-2 text-sm font-bold text-white"
            >
              Validate and preview
            </button>
            {csvPreview ? (
              <div className="text-xs">
                <strong>
                  {csvPreview.valid ? "Valid dry run" : "Validation errors"}
                </strong>
                <p>
                  {csvPreview.rows.length} row(s);{" "}
                  {csvPreview.rows.reduce(
                    (total, row) => total + row.errors.length,
                    0,
                  )}{" "}
                  row error(s).
                </p>
              </div>
            ) : null}
          </div>
        </div>
        <div className="mt-6 overflow-x-auto border border-slate-300 bg-white">
          <table className="min-w-full text-left text-xs">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="p-3">Source registry</th>
                <th className="p-3">Country / class</th>
                <th className="p-3">Trust</th>
                <th className="p-3">Status</th>
                <th className="p-3">Visibility</th>
                <th className="p-3">Review</th>
              </tr>
            </thead>
            <tbody>
              {snapshot?.sources.map((source) => (
                <tr key={source.id} className="border-b">
                  <td className="p-3">
                    <strong>{source.sourceName}</strong>
                    <br />
                    <span className="text-slate-500">
                      {source.urlReference}
                    </span>
                  </td>
                  <td className="p-3">
                    {source.country}
                    <br />
                    {source.sourceType.replaceAll("_", " ")}
                  </td>
                  <td className="p-3">
                    {source.trustLevel}
                    <br />
                    <span className="text-slate-500">{source.trustReason}</span>
                  </td>
                  <td className="p-3">{source.status}</td>
                  <td className="p-3">
                    {source.visibility.replaceAll("_", " ")}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          void mutate({
                            action: "source_governance",
                            sourceId: source.id,
                            sourceStatus: "approved",
                            trustLevel: "medium",
                            reason: "Human source review",
                          })
                        }
                        className="border px-2 py-1"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          void mutate({
                            action: "source_governance",
                            sourceId: source.id,
                            sourceStatus: "suspended",
                            trustLevel: source.trustLevel,
                            reason: "Suspended pending review",
                          })
                        }
                        className="border px-2 py-1"
                      >
                        Suspend
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 overflow-x-auto border border-slate-300 bg-white">
          <table className="min-w-full text-left text-xs">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="p-3">Observation queue</th>
                <th className="p-3">Market / price</th>
                <th className="p-3">Identity / basis</th>
                <th className="p-3">Workflow</th>
                <th className="p-3">Anomalies</th>
                <th className="p-3">Controlled handoff</th>
              </tr>
            </thead>
            <tbody>
              {snapshot?.observations.length ? (
                snapshot.observations.map((observation) => {
                  const proposed = nextStage[observation.workflowStage];
                  return (
                    <tr key={observation.id} className="border-b align-top">
                      <td className="p-3">
                        <strong>
                          {observation.originalObservedProductText}
                        </strong>
                        <br />
                        <span className="text-slate-500">
                          {operationQueue(observation).replaceAll("_", " ")}
                        </span>
                      </td>
                      <td className="p-3">
                        {observation.country} · {observation.currency}{" "}
                        {observation.price.toFixed(2)}
                        <br />
                        <span className="text-slate-500">
                          pack {observation.packQuantity}
                        </span>
                      </td>
                      <td className="p-3">
                        {observation.productResolutionState.replaceAll(
                          "_",
                          " ",
                        )}
                        <br />
                        <span className="text-slate-500">
                          {observation.basisStatus.replaceAll("_", " ")}
                        </span>
                      </td>
                      <td className="p-3">
                        {observation.workflowStage.replaceAll("_", " ")}
                        <br />
                        <span className="text-slate-500">
                          {observation.freshnessStatus.replaceAll("_", " ")}
                        </span>
                      </td>
                      <td className="p-3">
                        {observation.anomalyFlags.length
                          ? observation.anomalyFlags.join(", ")
                          : "None detected"}
                      </td>
                      <td className="p-3">
                        {demoMode &&
                        observation.workflowStage === "identity_review" &&
                        observation.productResolutionState !==
                          "confirmed_exact" ? (
                          <button
                            onClick={() =>
                              void mutate({
                                action: "resolve_observation_identity",
                                observationId: observation.id,
                                matchedProductId:
                                  observation.country === "TH"
                                    ? "demo-product-a-th"
                                    : "demo-product-a-my",
                                reason:
                                  "Synthetic exact identity review completed",
                              })
                            }
                            className="border px-2 py-1 font-bold"
                          >
                            Resolve synthetic identity
                          </button>
                        ) : proposed &&
                          canMoveObservation(
                            observation.workflowStage,
                            proposed,
                          ) ? (
                          <button
                            onClick={() =>
                              void mutate({
                                action: "transition_observation",
                                observationId: observation.id,
                                stage: proposed,
                                reason: `Controlled handoff to ${proposed}`,
                              })
                            }
                            className="border px-2 py-1 font-bold"
                          >
                            Move to {proposed.replaceAll("_", " ")}
                          </button>
                        ) : (
                          <span className="text-slate-500">
                            No forward action
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="p-5 text-slate-500">
                    No observations collected. New entries remain private until
                    every controlled review stage is complete.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
