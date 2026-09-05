import "server-only";
import { randomUUID } from "node:crypto";
import { healthIntelligenceDemoModeEnabled } from "@/lib/healthIntelligence/auth";
import {
  anomalyFlags,
  canMoveObservation,
  detectLikelyDuplicate,
  freshnessStatus,
  operationalPublicationEligibility,
  sourceMaySupportPublication,
  type OperationalObservation,
  type SourceRegistryRecord,
  type WorkflowStage,
} from "@/lib/healthIntelligence/operations";

export type OperationsAuditEvent = {
  id: string;
  actor: string;
  action: string;
  targetType: string;
  targetId: string;
  before?: unknown;
  after?: unknown;
  reason: string;
  occurredAt: string;
};
export type OperationsSnapshot = {
  sources: SourceRegistryRecord[];
  observations: OperationalObservation[];
  auditEvents: OperationsAuditEvent[];
};

type OperationsGlobal = typeof globalThis & {
  __mmsOperationsDemo?: OperationsSnapshot;
};
function seed(): OperationsSnapshot {
  const sources: SourceRegistryRecord[] = (["MY", "TH", "SG"] as const).map(
    (country) => ({
      id: `demo-source-${country.toLowerCase()}-ops`,
      sourceName: `Demonstration ${country} source`,
      country,
      sourceType: "other_verified",
      organizationProvider: "Fictional provider",
      urlReference: "https://example.invalid",
      accessMethod: "Manual demonstration",
      normalPricingBasis: "retail_cash_price",
      trustLevel: "medium",
      trustReason: "Synthetic workflow exercise",
      verificationMethod: "Two-person demonstration review",
      termsUseNotes: "Demonstration only",
      geographicScope: [country],
      medicineScope: "Synthetic products only",
      updateFrequency: "30 days",
      status: "approved",
      reviewer: "demo-reviewer@mms.invalid",
      visibility: "public_type_only",
      dataClass: "demo",
    }),
  );
  return { sources, observations: [], auditEvents: [] };
}
function state(): OperationsSnapshot {
  const root = globalThis as OperationsGlobal;
  root.__mmsOperationsDemo ||= seed();
  return root.__mmsOperationsDemo;
}
function audit(
  snapshot: OperationsSnapshot,
  actor: string,
  action: string,
  targetType: string,
  targetId: string,
  reason: string,
  before?: unknown,
  after?: unknown,
) {
  snapshot.auditEvents.unshift({
    id: randomUUID(),
    actor,
    action,
    targetType,
    targetId,
    before,
    after,
    reason,
    occurredAt: new Date().toISOString(),
  });
}

export async function operationsSnapshot(): Promise<OperationsSnapshot> {
  if (!healthIntelligenceDemoModeEnabled())
    throw new Error(
      "Release 2C.1 operations require the approved 0023 migration before database mode can be enabled.",
    );
  return state();
}

export async function createCandidateSource(
  input: Omit<
    SourceRegistryRecord,
    "id" | "status" | "trustLevel" | "dataClass"
  >,
  actor: string,
): Promise<OperationsSnapshot> {
  const snapshot = await operationsSnapshot();
  const source: SourceRegistryRecord = {
    ...input,
    id: randomUUID(),
    status: "candidate",
    trustLevel: "unknown",
    dataClass: "demo",
  };
  snapshot.sources.unshift(source);
  audit(
    snapshot,
    actor,
    "source_creation",
    "source",
    source.id,
    "Candidate source created",
    undefined,
    source,
  );
  return snapshot;
}

export async function updateSourceGovernance(
  sourceId: string,
  status: SourceRegistryRecord["status"],
  trustLevel: SourceRegistryRecord["trustLevel"],
  reason: string,
  actor: string,
): Promise<OperationsSnapshot> {
  const snapshot = await operationsSnapshot();
  const source = snapshot.sources.find((item) => item.id === sourceId);
  if (!source) throw new Error("Source not found.");
  const before = structuredClone(source);
  source.status = status;
  source.trustLevel = trustLevel;
  source.trustReason = reason;
  source.reviewer = actor;
  source.lastReviewedAt = new Date().toISOString();
  audit(
    snapshot,
    actor,
    status === "approved"
      ? "source_approval"
      : status === "suspended"
        ? "source_suspension"
        : "source_review",
    "source",
    source.id,
    reason,
    before,
    structuredClone(source),
  );
  return snapshot;
}

export async function createOperationalObservation(
  input: Omit<
    OperationalObservation,
    "id" | "workflowStage" | "freshnessStatus" | "anomalyFlags" | "dataClass"
  >,
  actor: string,
): Promise<{ snapshot: OperationsSnapshot; duplicateIds: string[] }> {
  const snapshot = await operationsSnapshot();
  const source = snapshot.sources.find((item) => item.id === input.sourceId);
  if (!source) throw new Error("Approved source selection is required.");
  if (input.price < 0 || input.packQuantity <= 0)
    throw new Error("Price and pack quantity are invalid.");
  if (!input.originalObservedProductText.trim())
    throw new Error("Original product text is required.");
  const observation: OperationalObservation = {
    ...input,
    id: randomUUID(),
    workflowStage: "collected",
    freshnessStatus: freshnessStatus(input.reviewDueAt, input.validUntil),
    anomalyFlags: [],
    collector: actor,
    dataClass: "demo",
  };
  const duplicates = detectLikelyDuplicate(observation, snapshot.observations);
  observation.anomalyFlags = anomalyFlags(observation, snapshot.observations);
  if (duplicates.length) observation.anomalyFlags.push("possible_duplicate");
  snapshot.observations.unshift(observation);
  audit(
    snapshot,
    actor,
    "observation_creation",
    "observation",
    observation.id,
    "Collected for review; never published directly",
    undefined,
    observation,
  );
  return { snapshot, duplicateIds: duplicates.map((item) => item.id) };
}

export async function resolveOperationalObservationIdentity(
  id: string,
  matchedProductId: string,
  actor: string,
  reason: string,
): Promise<OperationsSnapshot> {
  const snapshot = await operationsSnapshot();
  const observation = snapshot.observations.find((item) => item.id === id);
  if (!observation) throw new Error("Observation not found.");
  if (observation.workflowStage !== "identity_review")
    throw new Error("Identity can only be resolved during identity review.");
  if (!/^[a-zA-Z0-9-]{8,80}$/.test(matchedProductId))
    throw new Error("Matched product identity is invalid.");
  const before = structuredClone(observation);
  observation.matchedProductId = matchedProductId;
  observation.candidateProductId = undefined;
  observation.productResolutionState = "confirmed_exact";
  audit(
    snapshot,
    actor,
    "product_identity_resolution",
    "observation",
    id,
    reason,
    before,
    structuredClone(observation),
  );
  return snapshot;
}

export async function transitionOperationalObservation(
  id: string,
  stage: WorkflowStage,
  actor: string,
  reason: string,
): Promise<OperationsSnapshot> {
  const snapshot = await operationsSnapshot();
  const observation = snapshot.observations.find((item) => item.id === id);
  if (!observation) throw new Error("Observation not found.");
  const source = snapshot.sources.find(
    (item) => item.id === observation.sourceId,
  );
  if (!source) throw new Error("Source not found.");
  if (!canMoveObservation(observation.workflowStage, stage))
    throw new Error(
      `Invalid workflow transition: ${observation.workflowStage} to ${stage}.`,
    );
  if (
    observation.workflowStage === "identity_review" &&
    stage === "basis_review" &&
    (observation.productResolutionState !== "confirmed_exact" ||
      !observation.matchedProductId)
  )
    throw new Error("Exact product identity must be confirmed first.");
  if (
    observation.workflowStage === "basis_review" &&
    stage === "source_review" &&
    observation.basisStatus !== "basis_verified"
  )
    throw new Error("Price basis must be verified first.");
  if (
    observation.workflowStage === "source_review" &&
    stage === "pending_verification" &&
    !sourceMaySupportPublication(source)
  )
    throw new Error("Source approval and sufficient trust are required.");
  const before = structuredClone(observation);
  if (stage === "publication_approved") {
    const eligibility = operationalPublicationEligibility(observation, source);
    if (!eligibility.eligible)
      throw new Error(`Publication blocked: ${eligibility.reasons.join(", ")}`);
    observation.publisher = actor;
  } else if (stage === "verified") {
    observation.reviewer = actor;
    observation.dataClass =
      observation.dataClass === "demo" ? "demo" : "real_verified";
  }
  observation.workflowStage = stage;
  audit(
    snapshot,
    actor,
    stage === "publication_approved"
      ? "publication_approval"
      : stage === "rejected"
        ? "rejection"
        : "verification",
    "observation",
    id,
    reason,
    before,
    structuredClone(observation),
  );
  return snapshot;
}
