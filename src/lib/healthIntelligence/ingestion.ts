import type {
  ConnectorType,
  OperationalMarket,
  OperationalObservation,
  SourceRegistryRecord,
} from "@/lib/healthIntelligence/operations";
import { matchMedicineProducts } from "@/lib/healthIntelligence/matching";
import type {
  MatchDimension,
  MedicineProductIdentity,
} from "@/lib/healthIntelligence/types";

export type IngestionBatchStatus =
  | "created"
  | "validating"
  | "ready"
  | "importing"
  | "completed"
  | "completed_with_errors"
  | "failed"
  | "cancelled";
export type ParsingConfidence = "high" | "medium" | "low" | "unknown";
export type ResolutionProposal =
  | "exact_candidate"
  | "likely_candidate"
  | "ambiguous_candidates"
  | "no_match"
  | "safety_exception";

export type SourceConnectorConfig = {
  id: string;
  sourceId: string;
  connectorKey: string;
  connectorType: ConnectorType;
  displayName: string;
  market: OperationalMarket;
  status: "inactive" | "approved" | "suspended" | "retired";
  authenticationType:
    | "none"
    | "api_key"
    | "bearer"
    | "basic"
    | "oauth2"
    | "other_server_side";
  environmentSecretNames: string[];
  requestRatePerMinute: number;
  timeoutMs: number;
  retryLimit: number;
  failureLimit: number;
  backoffMs: number;
  scheduleMode: "manual" | "daily" | "weekly" | "monthly";
  restrictions: string;
  lastRunAt?: string;
  consecutiveFailures: number;
  dataClass: "demo" | "real_unverified";
};

export type ParsedField = {
  original: string;
  suggested: string;
  confidence: ParsingConfidence;
};
export type ProductMatchProposal = {
  outcome: ResolutionProposal;
  candidateIds: string[];
  matched: MatchDimension["dimension"][];
  mismatched: MatchDimension["dimension"][];
  safetyExceptions: string[];
  explanation: string;
};
export type IngestionRow = {
  id: string;
  batchId: string;
  rowNumber: number;
  sourceItemIdentifier: string;
  originalSourceValue: string;
  originalLanguage: string;
  raw: Record<string, string>;
  normalized: Record<string, string | number>;
  parsedFields: Record<string, ParsedField>;
  productResolution: ProductMatchProposal;
  resolvedProductId?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  observationId?: string;
  rowStatus: "valid" | "warning" | "unresolved" | "rejected" | "imported";
  warnings: string[];
  errors: string[];
  fingerprint: string;
};
export type IngestionBatch = {
  id: string;
  sourceId: string;
  connectorId: string;
  connectorType: ConnectorType;
  market: OperationalMarket;
  startedAt: string;
  completedAt?: string;
  initiatedBy: string;
  totalItems: number;
  accepted: number;
  rejected: number;
  unresolved: number;
  warnings: number;
  failures: number;
  status: IngestionBatchStatus;
  sourceFileReference: string;
  fingerprint: string;
  idempotencyKey: string;
  confirmedBy?: string;
  confirmedAt?: string;
  rows: IngestionRow[];
  dataClass: "demo" | "real_unverified";
};

export function realHealthIntelligenceDataEnabled(): boolean {
  return process.env.MMS_HEALTH_INTELLIGENCE_REAL_DATA_ENABLED === "true";
}

export function connectorMayRun(
  connector: SourceConnectorConfig,
  source: SourceRegistryRecord,
): { allowed: boolean; reasons: string[] } {
  const reasons: string[] = [];
  if (connector.status !== "approved") reasons.push("connector_not_approved");
  if (connector.consecutiveFailures >= connector.failureLimit)
    reasons.push("connector_failure_limit_reached");
  if (source.status !== "approved") reasons.push("source_not_approved");
  if (source.connectorActivationStatus !== "approved")
    reasons.push("source_connector_activation_not_approved");
  if (!source.approvedCollectionMethods?.includes(connector.connectorType))
    reasons.push("collection_method_not_approved");
  if (connector.sourceId !== source.id) reasons.push("connector_source_mismatch");
  if (connector.market !== source.country) reasons.push("connector_market_mismatch");
  return { allowed: reasons.length === 0, reasons };
}

export function normalizeObservedValue(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .replace(/(\d)\s*(mg|mcg|g|ml)\b/gi, "$1 $2");
}

export function assistedParseProductText(text: string): {
  originalText: string;
  fields: Record<string, ParsedField>;
} {
  const normalized = normalizeObservedValue(text);
  const strength = normalized.match(/\b\d+(?:\.\d+)?\s*(?:mg|mcg|g|ml)(?:\/ml)?\b/i)?.[0] || "";
  const pack = normalized.match(/(?:pack|x|×)\s*(\d+)\b/i)?.[1] || "";
  return {
    originalText: text,
    fields: {
      productText: { original: text, suggested: normalized, confidence: "high" },
      strength: {
        original: text,
        suggested: strength,
        confidence: strength ? "medium" : "unknown",
      },
      pack: {
        original: text,
        suggested: pack,
        confidence: pack ? "medium" : "unknown",
      },
    },
  };
}

function candidateIdentity(row: Record<string, string | number>): MedicineProductIdentity | null {
  const strengthText = String(row.strength || "");
  const strength = strengthText.match(/(\d+(?:\.\d+)?)\s*([a-zA-Z/]+)/);
  const ingredient = String(row.ingredient || "").trim();
  const pack = Number(row.pack);
  if (!ingredient || !strength || !Number.isFinite(pack)) return null;
  return {
    id: "ingestion-candidate",
    productCode: "INGESTION-CANDIDATE",
    genericName: ingredient,
    brandName: String(row.observed_product_name || ""),
    manufacturerName: String(row.manufacturer || ""),
    dosageFormId: String(row.dosage_form || "").toLowerCase(),
    routeId: String(row.route || "unknown").toLowerCase(),
    releaseTypeId: String(row.release_type || "unknown").toLowerCase(),
    packSize: pack,
    unitsPerPack: pack,
    ingredients: [
      {
        ingredientId: ingredient,
        name: ingredient,
        strengthValue: Number(strength[1]),
        strengthUnit: strength[2],
      },
    ],
    combinationProduct: false,
    biologic: false,
    biosimilar: false,
    narrowTherapeuticIndex: false,
    complexInjectable: false,
    specialDevice: false,
    oncologyMedicine: false,
    specialFormulation: false,
    verificationStatus: "collected",
    publicationStatus: "not_eligible",
    dataStatus: "demo",
  };
}

export function proposeProductMatches(
  row: Record<string, string | number>,
  products: MedicineProductIdentity[],
): ProductMatchProposal {
  const candidate = candidateIdentity(row);
  if (!candidate)
    return {
      outcome: "no_match",
      candidateIds: [],
      matched: [],
      mismatched: [],
      safetyExceptions: [],
      explanation: "Insufficient structured identity fields for deterministic matching.",
    };
  const identityForNameMatching = (product: MedicineProductIdentity) => ({
    ...product,
    ingredients: product.ingredients.map((ingredient) => ({
      ...ingredient,
      ingredientId: ingredient.name.trim().toLowerCase(),
    })),
  });
  const results = products.map((product) => ({
    product,
    result: matchMedicineProducts(
      identityForNameMatching(candidate),
      identityForNameMatching(product),
    ),
  }));
  const materiallyRelated = results.filter((item) => {
    const matches = new Map(
      item.result.dimensions.map((dimension) => [
        dimension.dimension,
        dimension.matches,
      ]),
    );
    return matches.get("ingredients") && matches.get("strength");
  });
  const safety = materiallyRelated
    .map((item) => ({
      ...item,
      applicableExceptionCodes: item.result.hardExceptionCodes.filter(
        (code) =>
          !(
            code === "MODIFIED_RELEASE_REVIEW_REQUIRED" &&
            candidate.releaseTypeId === "unknown" &&
            item.product.releaseTypeId === "immediate"
          ),
      ),
    }))
    .filter((item) => item.applicableExceptionCodes.length);
  if (safety.length)
    return {
      outcome: "safety_exception",
      candidateIds: safety.map((item) => item.product.id),
      matched: safety[0].result.dimensions.filter((item) => item.matches).map((item) => item.dimension),
      mismatched: safety[0].result.dimensions.filter((item) => !item.matches).map((item) => item.dimension),
      safetyExceptions: [
        ...new Set(safety.flatMap((item) => item.applicableExceptionCodes)),
      ],
      explanation: "A deterministic safety exception requires human identity review.",
    };
  const comparable = materiallyRelated.filter((item) =>
    ["exact_match", "close_equivalent"].includes(item.result.classification),
  );
  const exact = comparable.filter((item) => item.result.classification === "exact_match");
  const partial = materiallyRelated.filter((item) => {
    const matches = new Map(
      item.result.dimensions.map((dimension) => [
        dimension.dimension,
        dimension.matches,
      ]),
    );
    return matches.get("form");
  });
  const candidates = exact.length ? exact : comparable.length ? comparable : partial;
  if (!candidates.length)
    return {
      outcome: "no_match",
      candidateIds: [],
      matched: [],
      mismatched: [],
      safetyExceptions: [],
      explanation: "No deterministic candidate matched the clinically material dimensions.",
    };
  const first = candidates[0].result;
  return {
    outcome:
      candidates.length > 1
        ? "ambiguous_candidates"
        : exact.length === 1
          ? "exact_candidate"
          : "likely_candidate",
    candidateIds: candidates.map((item) => item.product.id),
    matched: first.dimensions.filter((item) => item.matches).map((item) => item.dimension),
    mismatched: first.dimensions.filter((item) => !item.matches).map((item) => item.dimension),
    safetyExceptions: [],
    explanation:
      candidates.length > 1
        ? "More than one candidate remains; no identity was selected automatically."
        : exact.length
          ? first.explanation
          : "Ingredient, strength and form align, but missing or differing identity dimensions require human confirmation.",
  };
}

export function stableFingerprint(parts: Array<string | number | undefined>): string {
  const value = parts.map((part) => String(part || "").trim().toLowerCase()).join("|");
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `mms-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function ingestionMetrics(
  sources: SourceRegistryRecord[],
  observations: OperationalObservation[],
  batches: IngestionBatch[],
) {
  const rows = batches.flatMap((batch) => batch.rows);
  const resolved = rows.filter((row) => row.productResolution.outcome === "exact_candidate").length;
  const imported = observations.filter((item) => item.ingestionBatchId);
  const verified = imported.filter((item) => item.workflowStage === "verified").length;
  return {
    productResolutionRate: rows.length ? resolved / rows.length : 0,
    verificationRate: imported.length ? verified / imported.length : 0,
    unresolvedRate: rows.length ? rows.filter((row) => row.rowStatus === "unresolved").length / rows.length : 0,
    staleRate: imported.length ? imported.filter((item) => item.freshnessStatus !== "fresh").length / imported.length : 0,
    sourceCoverage: sources.filter((source) => source.status === "approved").length,
    observationErrorRate: rows.length ? rows.filter((row) => row.errors.length).length / rows.length : 0,
  };
}
