"use client";

import { useMemo, useState } from "react";
import type { HealthIntelligenceSnapshot } from "@/lib/healthIntelligence/demoData";
import type { RecordState } from "@/lib/healthIntelligence/types";
import type {
  ReviewDecision,
  ReviewTargetType,
} from "@/lib/healthIntelligence/store";
import { HealthIntelligenceOperationsPanel } from "@/components/HealthIntelligenceOperationsPanel";
import { HealthIntelligenceIngestionPanel } from "@/components/HealthIntelligenceIngestionPanel";

const tabs = [
  "Products",
  "Prices",
  "Sources",
  "Generic Matches",
  "Verification Queue",
  "Audit",
  "Market Coverage",
] as const;
type Tab = (typeof tabs)[number];

function statusClass(status: string) {
  if (status.includes("verified") || status === "published")
    return "bg-emerald-100 text-emerald-900";
  if (status.includes("review") || status === "reported")
    return "bg-amber-100 text-amber-900";
  if (
    status === "rejected" ||
    status === "expired" ||
    status === "not_comparable"
  )
    return "bg-red-100 text-red-900";
  return "bg-slate-200 text-slate-800";
}

function Status({ value }: { value: string }) {
  return (
    <span
      className={`inline-flex px-2 py-1 text-[11px] font-bold uppercase tracking-wide ${statusClass(value)}`}
    >
      {value.replaceAll("_", " ")}
    </span>
  );
}

function availableDecisions(state: RecordState): ReviewDecision[] {
  if (state === "collected") return ["submit_for_review"];
  if (state === "pending_review") return ["verify", "reject"];
  if (state === "verified") return ["publish", "mark_stale"];
  if (state === "published") return ["mark_stale"];
  if (state === "needs_reverification" || state === "expired")
    return ["reverify"];
  if (state === "rejected") return ["submit_for_review"];
  return [];
}

function ReviewActions({
  targetType,
  targetId,
  state,
  pending,
  demoMode,
  onReview,
}: {
  targetType: ReviewTargetType;
  targetId: string;
  state: RecordState;
  pending: string;
  demoMode: boolean;
  onReview: (
    targetType: ReviewTargetType,
    targetId: string,
    decision: ReviewDecision,
  ) => void;
}) {
  const decisions = availableDecisions(state).filter(
    (decision) => !(demoMode && decision === "publish"),
  );
  return (
    <div className="flex flex-wrap gap-2">
      {decisions.map((decision) => (
        <button
          key={decision}
          disabled={Boolean(pending)}
          onClick={() => onReview(targetType, targetId, decision)}
          className="border border-slate-400 bg-white px-2 py-1 text-xs font-semibold text-slate-800 hover:border-slate-900 disabled:opacity-50"
        >
          {pending === `${targetId}:${decision}`
            ? "Working..."
            : decision.replaceAll("_", " ")}
        </button>
      ))}
    </div>
  );
}

export function HealthIntelligenceReviewerConsole({
  initialSnapshot,
  demoMode,
}: {
  initialSnapshot: HealthIntelligenceSnapshot;
  demoMode: boolean;
}) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [tab, setTab] = useState<Tab>("Products");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState("");
  const products = useMemo(
    () =>
      new Map<string, HealthIntelligenceSnapshot["products"][number]>(
        snapshot.products.map((item) => [item.id, item]),
      ),
    [snapshot.products],
  );
  const sources = useMemo(
    () =>
      new Map<string, HealthIntelligenceSnapshot["sources"][number]>(
        snapshot.sources.map((item) => [item.id, item]),
      ),
    [snapshot.sources],
  );
  const markets = useMemo(
    () =>
      new Map<string, HealthIntelligenceSnapshot["markets"][number]>(
        snapshot.markets.map((item) => [item.id, item]),
      ),
    [snapshot.markets],
  );

  async function review(
    targetType: ReviewTargetType,
    targetId: string,
    decision: ReviewDecision,
  ) {
    const key = `${targetId}:${decision}`;
    setPending(key);
    setMessage("");
    try {
      const response = await fetch("/api/internal/health-intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType,
          targetId,
          decision,
          notes: demoMode
            ? "Synthetic reviewer-console exercise."
            : "Reviewed in MMS Health Intelligence console.",
        }),
      });
      const body = (await response.json()) as {
        snapshot?: HealthIntelligenceSnapshot;
        message?: string;
      };
      if (response.ok && body.snapshot) {
        setSnapshot(body.snapshot);
        setMessage(
          `${decision.replaceAll("_", " ")} recorded with an audit event.`,
        );
      } else setMessage(body.message || "Review action failed.");
    } catch {
      setMessage("The reviewer service could not be reached.");
    } finally {
      setPending("");
    }
  }

  return (
    <main
      data-internal-console
      className="min-h-screen bg-slate-100 text-slate-950"
    >
      <header className="bg-slate-950 px-5 py-6 text-white">
        <div className="mx-auto flex max-w-7xl items-start justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
              MMS internal operations
            </p>
            <h1 className="mt-2 font-serif text-3xl md:text-4xl">
              Health Intelligence reviewer
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-300">
              Product identity, provenance, historical observations and
              human-controlled verification. Price is not access; similarity is
              not substitutability.
            </p>
          </div>
          <form action="/api/internal/health-intelligence/access" method="post">
            <input type="hidden" name="action" value="logout" />
            <button
              className="border border-slate-600 px-3 py-2 text-xs font-semibold"
              type="submit"
            >
              End session
            </button>
          </form>
        </div>
      </header>
      {demoMode ? (
        <div className="bg-amber-200 px-5 py-3 text-center text-sm font-bold text-amber-950">
          DEMO DATA ONLY. Fictional records, sources and prices. Never eligible
          for public publication.
        </div>
      ) : null}
      <HealthIntelligenceOperationsPanel demoMode={demoMode} />
      <HealthIntelligenceIngestionPanel />
      <nav
        className="overflow-x-auto border-b border-slate-300 bg-white"
        aria-label="Reviewer sections"
      >
        <div className="mx-auto flex max-w-7xl">
          {tabs.map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`whitespace-nowrap border-b-2 px-4 py-4 text-sm font-semibold ${tab === item ? "border-amber-600 text-slate-950" : "border-transparent text-slate-500"}`}
            >
              {item}
            </button>
          ))}
        </div>
      </nav>
      <section className="mx-auto max-w-7xl px-5 py-8">
        {message ? (
          <p
            className="mb-6 border border-slate-300 bg-white p-3 text-sm"
            role="status"
          >
            {message}
          </p>
        ) : null}
        {tab === "Products" ? (
          <div className="overflow-x-auto bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="p-3">Product identity</th>
                  <th className="p-3">Ingredients</th>
                  <th className="p-3">Form / route / release</th>
                  <th className="p-3">Pack</th>
                  <th className="p-3">Flags</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Review</th>
                </tr>
              </thead>
              <tbody>
                {snapshot.products.map((product) => (
                  <tr
                    className="border-b border-slate-200 align-top"
                    key={product.id}
                  >
                    <td className="p-3">
                      <strong>{product.brandName}</strong>
                      <br />
                      <span className="text-slate-500">
                        {product.genericName}
                        <br />
                        {product.manufacturerName}
                        <br />
                        {product.productCode}
                      </span>
                    </td>
                    <td className="p-3">
                      {product.ingredients.map((ingredient) => (
                        <div
                          key={`${ingredient.ingredientId}-${ingredient.strengthValue}`}
                        >
                          {ingredient.name} {ingredient.strengthValue}{" "}
                          {ingredient.strengthUnit}
                        </div>
                      ))}
                    </td>
                    <td className="p-3">
                      {product.dosageFormId}
                      <br />
                      {product.routeId}
                      <br />
                      {product.releaseTypeId}
                    </td>
                    <td className="p-3">
                      {product.unitsPerPack} units
                      <br />
                      {product.deviceOrPresentation || "Standard"}
                    </td>
                    <td className="p-3">
                      {[
                        product.biologic && "Biologic",
                        product.biosimilar && "Biosimilar",
                        product.narrowTherapeuticIndex && "NTI",
                        product.combinationProduct && "Combination",
                        product.specialDevice && "Special device",
                      ]
                        .filter(Boolean)
                        .join(", ") || "None"}
                    </td>
                    <td className="p-3">
                      <Status value={product.verificationStatus} />
                      <div className="mt-2">
                        <Status value={product.dataStatus} />
                      </div>
                    </td>
                    <td className="p-3">
                      <ReviewActions
                        targetType="medicine_product"
                        targetId={product.id}
                        state={product.verificationStatus}
                        pending={pending}
                        demoMode={demoMode}
                        onReview={review}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
        {tab === "Prices" ? (
          <div className="space-y-4">
            {snapshot.prices.map((price) => (
              <article
                className="grid gap-4 border border-slate-300 bg-white p-5 md:grid-cols-[1.3fr_.8fr_.9fr_1.2fr]"
                key={price.id}
              >
                <div>
                  <p className="font-bold">
                    {products.get(price.productId)?.brandName ||
                      price.productId}
                  </p>
                  <p className="text-sm text-slate-600">
                    {markets.get(price.marketId)?.countryName} ·{" "}
                    {price.currency} {price.observedLocalPrice.toLocaleString()}{" "}
                    / {price.packQuantity}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Observed{" "}
                    {price.observedAt
                      ? new Date(price.observedAt).toLocaleDateString()
                      : "date missing"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-slate-500">
                    Basis
                  </p>
                  <p>
                    {price.comparisonBasis?.replaceAll("_", " ") || "Missing"}
                  </p>
                  <p className="mt-2 text-xs">
                    {price.normalizationUnit
                      ? `Per ${price.normalizationUnit} supported`
                      : "No normalization"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-slate-500">
                    Source
                  </p>
                  <p>
                    {price.sourceId
                      ? sources.get(price.sourceId)?.sourceName
                      : "Missing"}
                  </p>
                  <p className="mt-2 text-xs">
                    Reviewer: {price.reviewer || "Pending"}
                  </p>
                  <p className="text-xs">
                    Review due:{" "}
                    {price.reviewDueAt
                      ? new Date(price.reviewDueAt).toLocaleDateString()
                      : "Not set"}
                  </p>
                </div>
                <div>
                  <div className="flex flex-wrap gap-2">
                    <Status value={price.recordState} />
                    <Status value={price.priceVerificationStatus} />
                    <Status value={price.dataStatus} />
                  </div>
                  <div className="mt-3">
                    <ReviewActions
                      targetType="price_observation"
                      targetId={price.id}
                      state={price.recordState}
                      pending={pending}
                      demoMode={demoMode}
                      onReview={review}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : null}
        {tab === "Sources" ? (
          <div className="grid gap-4 md:grid-cols-2">
            {snapshot.sources.map((source) => (
              <article
                className="border border-slate-300 bg-white p-5"
                key={source.id}
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="font-bold">{source.sourceName}</h2>
                  <Status value={source.trustLevel} />
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  {source.sourceType.replaceAll("_", " ")} ·{" "}
                  {markets.get(source.marketId)?.countryName}
                </p>
                <p className="mt-3 break-all text-xs text-slate-500">
                  {source.sourceUrl || "No source URL recorded"}
                </p>
                <div className="mt-3 flex gap-2">
                  <Status value={source.verificationStatus} />
                  <Status value={source.dataStatus} />
                </div>
              </article>
            ))}
          </div>
        ) : null}
        {tab === "Generic Matches" ? (
          <div className="space-y-4">
            {snapshot.relationships.map((relationship) => (
              <article
                className="border border-slate-300 bg-white p-5"
                key={relationship.id}
              >
                <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-500">
                      Reference
                    </p>
                    <p className="font-bold">
                      {products.get(relationship.sourceProductId)?.brandName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-500">
                      Candidate
                    </p>
                    <p className="font-bold">
                      {products.get(relationship.candidateProductId)?.brandName}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Status value={relationship.relationshipType} />
                    <Status value={relationship.matchConfidence} />
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-600">
                  {relationship.reviewNotes}
                </p>
                <div className="mt-4">
                  <ReviewActions
                    targetType="generic_relationship"
                    targetId={relationship.id}
                    state={relationship.verificationStatus}
                    pending={pending}
                    demoMode={demoMode}
                    onReview={review}
                  />
                </div>
              </article>
            ))}
          </div>
        ) : null}
        {tab === "Verification Queue" ? (
          <div className="space-y-4">
            {snapshot.prices
              .filter(
                (item) =>
                  item.recordState === "pending_review" ||
                  item.recordState === "needs_reverification" ||
                  item.recordState === "expired",
              )
              .map((price) => (
                <article
                  className="flex flex-col justify-between gap-4 border-l-4 border-amber-500 bg-white p-5 md:flex-row"
                  key={price.id}
                >
                  <div>
                    <p className="font-bold">
                      {products.get(price.productId)?.brandName} ·{" "}
                      {markets.get(price.marketId)?.countryName}
                    </p>
                    <p className="text-sm text-slate-600">
                      Source:{" "}
                      {price.sourceId
                        ? sources.get(price.sourceId)?.sourceName
                        : "missing"}{" "}
                      · observed{" "}
                      {price.observedAt
                        ? new Date(price.observedAt).toLocaleDateString()
                        : "date missing"}
                    </p>
                  </div>
                  <div>
                    <Status value={price.recordState} />
                    <div className="mt-3">
                      <ReviewActions
                        targetType="price_observation"
                        targetId={price.id}
                        state={price.recordState}
                        pending={pending}
                        demoMode={demoMode}
                        onReview={review}
                      />
                    </div>
                  </div>
                </article>
              ))}
          </div>
        ) : null}
        {tab === "Audit" ? (
          <div className="overflow-x-auto bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="p-3">When</th>
                  <th className="p-3">Actor</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Target</th>
                  <th className="p-3">Metadata</th>
                </tr>
              </thead>
              <tbody>
                {snapshot.auditEvents.map((event) => (
                  <tr className="border-b border-slate-200" key={event.id}>
                    <td className="p-3">
                      {new Date(event.occurredAt).toLocaleString()}
                    </td>
                    <td className="p-3">{event.actor}</td>
                    <td className="p-3">
                      <Status value={event.action} />
                    </td>
                    <td className="p-3">
                      {event.targetType}
                      <br />
                      <span className="text-xs text-slate-500">
                        {event.targetId}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-slate-600">
                      {JSON.stringify(event.metadata)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
        {tab === "Market Coverage" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {snapshot.markets.map((market) => (
              <article
                className="border border-slate-300 bg-white p-5"
                key={market.id}
              >
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  {market.countryCode}
                </p>
                <h2 className="mt-1 font-serif text-2xl">
                  {market.countryName}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  {
                    snapshot.prices.filter(
                      (item) => item.marketId === market.id,
                    ).length
                  }{" "}
                  price observations
                  <br />
                  {
                    snapshot.sources.filter(
                      (item) => item.marketId === market.id,
                    ).length
                  }{" "}
                  sources
                  <br />
                  Native currency: {market.currency}
                </p>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
