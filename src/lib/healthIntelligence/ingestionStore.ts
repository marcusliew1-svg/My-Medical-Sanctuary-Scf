import "server-only";
import { randomUUID } from "node:crypto";
import { validateObservationCsv } from "@/lib/healthIntelligence/csvImport";
import { demoProducts } from "@/lib/healthIntelligence/demoData";
import {
  assistedParseProductText,
  connectorMayRun,
  ingestionMetrics,
  proposeProductMatches,
  realHealthIntelligenceDataEnabled,
  stableFingerprint,
  type IngestionBatch,
  type IngestionRow,
  type SourceConnectorConfig,
} from "@/lib/healthIntelligence/ingestion";
import type { OperationalMarket } from "@/lib/healthIntelligence/operations";
import {
  createOperationalObservation,
  operationsSnapshot,
  type OperationsAuditEvent,
} from "@/lib/healthIntelligence/operationsStore";

type IngestionState = {
  connectors: SourceConnectorConfig[];
  batches: IngestionBatch[];
  auditEvents: OperationsAuditEvent[];
};
type IngestionGlobal = typeof globalThis & { __mmsIngestionDemo?: IngestionState };

function state(): IngestionState {
  const root = globalThis as IngestionGlobal;
  root.__mmsIngestionDemo ||= { connectors: [], batches: [], auditEvents: [] };
  return root.__mmsIngestionDemo;
}
function audit(
  target: IngestionState,
  actor: string,
  action: string,
  targetType: string,
  targetId: string,
  reason: string,
  before?: unknown,
  after?: unknown,
) {
  target.auditEvents.unshift({
    id: randomUUID(),
    actor,
    action,
    targetType,
    targetId,
    reason,
    before,
    after,
    occurredAt: new Date().toISOString(),
  });
}

async function ensureDemoConnectors() {
  const target = state();
  const operations = await operationsSnapshot();
  for (const source of operations.sources) {
    source.approvedCollectionMethods ||= ["manual", "csv"];
    source.connectorActivationStatus ||= "approved";
    source.collectionRestrictions ||= "Synthetic demonstration collection only.";
    if (!target.connectors.some((item) => item.sourceId === source.id && item.connectorType === "csv"))
      target.connectors.push({
        id: `demo-connector-${source.country.toLowerCase()}-csv`,
        sourceId: source.id,
        connectorKey: `DEMO-${source.country}-CSV`,
        connectorType: "csv",
        displayName: `${source.country} controlled CSV`,
        market: source.country,
        status: "approved",
        authenticationType: "none",
        environmentSecretNames: [],
        requestRatePerMinute: 10,
        timeoutMs: 10_000,
        retryLimit: 2,
        failureLimit: 3,
        backoffMs: 1_000,
        scheduleMode: "manual",
        restrictions: "Manual confirmation required. Demonstration records only.",
        consecutiveFailures: 0,
        dataClass: "demo",
      });
  }
  return { target, operations };
}

export async function ingestionSnapshot() {
  const { target, operations } = await ensureDemoConnectors();
  return {
    realDataEnabled: realHealthIntelligenceDataEnabled(),
    connectors: target.connectors,
    batches: target.batches,
    metrics: ingestionMetrics(operations.sources, operations.observations, target.batches),
    marketCoverage: (["MY", "TH", "SG"] as OperationalMarket[]).map((market) => ({
      market,
      approvedSources: operations.sources.filter((source) => source.country === market && source.status === "approved").length,
      productsObserved: new Set(operations.observations.filter((item) => item.country === market).map((item) => item.originalObservedProductText)).size,
      verifiedObservations: operations.observations.filter((item) => item.country === market && item.workflowStage === "verified").length,
      staleObservations: operations.observations.filter((item) => item.country === market && item.freshnessStatus !== "fresh").length,
      unresolvedItems: operations.observations.filter((item) => item.country === market && item.productResolutionState !== "confirmed_exact").length,
    })),
    auditEvents: target.auditEvents,
  };
}

export async function createConnectorConfiguration(
  input: Omit<SourceConnectorConfig, "id" | "status" | "lastRunAt" | "consecutiveFailures" | "dataClass">,
  actor: string,
) {
  const { target, operations } = await ensureDemoConnectors();
  const source = operations.sources.find((item) => item.id === input.sourceId);
  if (!source) throw new Error("Source not found.");
  if (target.connectors.some((item) => item.connectorKey === input.connectorKey))
    throw new Error("Connector key already exists.");
  if (input.environmentSecretNames.some((name) => !/^[A-Z][A-Z0-9_]{2,80}$/.test(name)))
    throw new Error("Only environment-variable names may be stored for connector authentication.");
  if (!input.connectorKey.trim() || !input.displayName.trim())
    throw new Error("Connector key and display name are required.");
  if (input.authenticationType !== "none" && !input.environmentSecretNames.length)
    throw new Error("Authenticated connectors require server environment secret names.");
  if (!operations.sources.some((item) => item.id === input.sourceId && item.country === input.market))
    throw new Error("Connector market must match its Source Registry entry.");
  if (!Number.isInteger(input.requestRatePerMinute) || input.requestRatePerMinute < 1 || input.requestRatePerMinute > 120)
    throw new Error("Connector request rate is outside the approved range.");
  if (!Number.isInteger(input.timeoutMs) || input.timeoutMs < 1_000 || input.timeoutMs > 60_000)
    throw new Error("Connector timeout is outside the approved range.");
  if (!Number.isInteger(input.retryLimit) || input.retryLimit < 0 || input.retryLimit > 5)
    throw new Error("Connector retry limit is outside the approved range.");
  if (!Number.isInteger(input.failureLimit) || input.failureLimit < 1 || input.failureLimit > 10)
    throw new Error("Connector failure limit is outside the approved range.");
  if (!Number.isInteger(input.backoffMs) || input.backoffMs < 100 || input.backoffMs > 60_000)
    throw new Error("Connector backoff is outside the approved range.");
  const connector: SourceConnectorConfig = {
    id: randomUUID(),
    sourceId: input.sourceId,
    connectorKey: input.connectorKey.trim(),
    connectorType: input.connectorType,
    displayName: input.displayName.trim(),
    market: input.market,
    status: "inactive",
    authenticationType: input.authenticationType,
    environmentSecretNames: [...input.environmentSecretNames],
    requestRatePerMinute: input.requestRatePerMinute,
    timeoutMs: input.timeoutMs,
    retryLimit: input.retryLimit,
    failureLimit: input.failureLimit,
    backoffMs: input.backoffMs,
    scheduleMode: input.scheduleMode,
    restrictions: input.restrictions.trim(),
    consecutiveFailures: 0,
    dataClass: "demo",
  };
  target.connectors.unshift(connector);
  audit(target, actor, "connector_creation", "source_connector", connector.id, "Inactive connector configuration created", undefined, connector);
  return ingestionSnapshot();
}

export async function updateConnectorActivation(
  connectorId: string,
  status: SourceConnectorConfig["status"],
  actor: string,
  reason: string,
) {
  const { target, operations } = await ensureDemoConnectors();
  const connector = target.connectors.find((item) => item.id === connectorId);
  if (!connector) throw new Error("Connector not found.");
  const source = operations.sources.find((item) => item.id === connector.sourceId);
  if (!source) throw new Error("Source not found.");
  if (status === "approved") {
    if (source.status !== "approved" || source.connectorActivationStatus !== "approved")
      throw new Error("Source registry approval is required before connector activation.");
    if (!source.approvedCollectionMethods?.includes(connector.connectorType))
      throw new Error("Connector collection method is not approved for this source.");
  }
  const before = structuredClone(connector);
  connector.status = status;
  audit(target, actor, status === "approved" ? "connector_activation" : "connector_deactivation", "source_connector", connector.id, reason, before, structuredClone(connector));
  return ingestionSnapshot();
}

export async function prepareCsvIngestion(input: {
  sourceId: string;
  connectorId: string;
  filename: string;
  csv: string;
  initiatedBy: string;
  idempotencyKey?: string;
}) {
  const { target, operations } = await ensureDemoConnectors();
  const source = operations.sources.find((item) => item.id === input.sourceId);
  const connector = target.connectors.find((item) => item.id === input.connectorId);
  if (!source || !connector) throw new Error("Source and connector are required.");
  const gate = connectorMayRun(connector, source);
  if (!gate.allowed) throw new Error(`Connector refused: ${gate.reasons.join(", ")}`);
  const fingerprint = stableFingerprint([input.sourceId, input.filename, input.csv]);
  const idempotencyKey = input.idempotencyKey?.trim() || fingerprint;
  const existing = target.batches.find(
    (batch) => batch.sourceId === input.sourceId && batch.idempotencyKey === idempotencyKey,
  );
  if (existing) return { snapshot: await ingestionSnapshot(), batch: existing, idempotentReplay: true };
  const preview = validateObservationCsv(input.csv);
  const batchId = randomUUID();
  const rows: IngestionRow[] = preview.rows.map((row) => {
    const normalized = row.normalized || {};
    const original = row.raw.observed_product_name || "";
    const parsing = assistedParseProductText(original);
    const productResolution = proposeProductMatches(normalized, demoProducts);
    const errors = [...row.errors];
    const warnings: string[] = [];
    if (!errors.length) warnings.push("Product and price fields remain unverified after import.");
    if (["ambiguous_candidates", "safety_exception"].includes(productResolution.outcome))
      warnings.push("Human product identity review is mandatory.");
    const rowStatus: IngestionRow["rowStatus"] = errors.length
      ? "rejected"
      : productResolution.outcome === "exact_candidate"
        ? "warning"
        : "unresolved";
    return {
      id: randomUUID(),
      batchId,
      rowNumber: row.rowNumber,
      sourceItemIdentifier: row.raw.source_key || `row-${row.rowNumber}`,
      originalSourceValue: original,
      originalLanguage: source.country === "TH" ? "th" : "und",
      raw: row.raw,
      normalized,
      parsedFields: parsing.fields,
      productResolution,
      rowStatus,
      warnings,
      errors,
      fingerprint: stableFingerprint([
        input.sourceId,
        row.raw.source_key,
        original,
        row.raw.price,
        row.raw.observed_date,
      ]),
    };
  });
  const accepted = rows.filter((row) => !row.errors.length).length;
  const batch: IngestionBatch = {
    id: batchId,
    sourceId: source.id,
    connectorId: connector.id,
    connectorType: connector.connectorType,
    market: source.country,
    startedAt: new Date().toISOString(),
    initiatedBy: input.initiatedBy,
    totalItems: rows.length,
    accepted,
    rejected: rows.length - accepted,
    unresolved: rows.filter((row) => row.rowStatus === "unresolved").length,
    warnings: rows.reduce((total, row) => total + row.warnings.length, 0),
    failures: 0,
    status: accepted ? "ready" : "failed",
    sourceFileReference: input.filename,
    fingerprint,
    idempotencyKey,
    rows,
    dataClass: "demo",
  };
  target.batches.unshift(batch);
  audit(target, input.initiatedBy, "batch_start", "ingestion_batch", batch.id, "CSV validated and previewed", undefined, batch);
  return { snapshot: await ingestionSnapshot(), batch, idempotentReplay: false };
}

export async function confirmCsvIngestion(
  batchId: string,
  confirmed: boolean,
  actor: string,
) {
  if (!confirmed) throw new Error("Explicit import confirmation is required.");
  const { target, operations } = await ensureDemoConnectors();
  const batch = target.batches.find((item) => item.id === batchId);
  if (!batch) throw new Error("Batch not found.");
  if (["completed", "completed_with_errors"].includes(batch.status))
    return { snapshot: await ingestionSnapshot(), batch, idempotentReplay: true };
  if (batch.status !== "ready") throw new Error("Only a ready batch can be imported.");
  const source = operations.sources.find((item) => item.id === batch.sourceId);
  const connector = target.connectors.find((item) => item.id === batch.connectorId);
  if (!source || !connector) throw new Error("Batch source configuration is unavailable.");
  const gate = connectorMayRun(connector, source);
  if (!gate.allowed) throw new Error(`Connector refused: ${gate.reasons.join(", ")}`);
  batch.status = "importing";
  batch.confirmedBy = actor;
  batch.confirmedAt = new Date().toISOString();
  audit(target, actor, "import_confirmation", "ingestion_batch", batch.id, "Explicit controlled import confirmation");
  for (const row of batch.rows.filter((item) => !item.errors.length && !item.observationId)) {
    try {
      const result = await createOperationalObservation(
        {
          sourceId: batch.sourceId,
          country: batch.market,
          originalObservedProductText: row.originalSourceValue,
          originalLanguage: row.originalLanguage,
          matchedProductId: row.resolvedProductId,
          productResolutionState: row.resolvedProductId ? "confirmed_exact" : "unresolved",
          observedBrand: String(row.normalized.observed_product_name || ""),
          observedIngredient: String(row.normalized.ingredient || ""),
          observedManufacturer: String(row.normalized.manufacturer || ""),
          observedStrength: String(row.normalized.strength || ""),
          observedDosageForm: String(row.normalized.dosage_form || ""),
          observedReleaseType: "",
          observedPack: String(row.normalized.pack || ""),
          price: Number(row.normalized.price),
          currency: String(row.normalized.currency) as "MYR" | "THB" | "SGD",
          packQuantity: Number(row.normalized.pack),
          basis: String(row.normalized.basis || "") as never,
          basisStatus: "basis_unverified",
          availability: "unknown",
          observedAt: String(row.normalized.observed_date),
          sourceReference: String(row.normalized.source_reference || batch.sourceFileReference),
          notes: "Imported as unverified candidate; human review required.",
          evidence: [{ type: "source_reference", reference: String(row.normalized.source_reference || batch.sourceFileReference) }],
          collector: actor,
          ingestionBatchId: batch.id,
          ingestionRowId: row.id,
          externalItemId: row.sourceItemIdentifier,
          observationSignature: row.fingerprint,
        },
        actor,
      );
      row.observationId = result.snapshot.observations[0].id;
      row.rowStatus = "imported";
    } catch (error) {
      row.errors.push(error instanceof Error ? error.message : "Import failed.");
      row.rowStatus = "rejected";
      batch.failures += 1;
    }
  }
  batch.completedAt = new Date().toISOString();
  batch.status = batch.failures || batch.rejected ? "completed_with_errors" : "completed";
  audit(target, actor, "batch_completion", "ingestion_batch", batch.id, batch.status);
  return { snapshot: await ingestionSnapshot(), batch, idempotentReplay: false };
}

export async function resolveIngestionRowCandidate(input: {
  batchId: string;
  rowId: string;
  candidateId: string;
  actor: string;
}) {
  const { target } = await ensureDemoConnectors();
  const batch = target.batches.find((item) => item.id === input.batchId);
  const row = batch?.rows.find((item) => item.id === input.rowId);
  if (!batch || !row) throw new Error("Ingestion row not found.");
  if (batch.status !== "ready") throw new Error("Only ready batch rows can be resolved.");
  if (!row.productResolution.candidateIds.includes(input.candidateId))
    throw new Error("Selected product was not proposed for this row.");
  if (row.productResolution.outcome === "safety_exception")
    throw new Error("Safety exceptions require the dedicated product review workflow.");
  const before = structuredClone(row);
  row.resolvedProductId = input.candidateId;
  row.resolvedBy = input.actor;
  row.resolvedAt = new Date().toISOString();
  row.rowStatus = "warning";
  audit(
    target,
    input.actor,
    "row_resolution",
    "ingestion_row",
    row.id,
    "Human accepted a proposed identity candidate; price remains unverified.",
    before,
    structuredClone(row),
  );
  return { snapshot: await ingestionSnapshot(), batch, row };
}
