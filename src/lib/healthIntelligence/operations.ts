export type OperationalMarket = "MY" | "TH" | "SG";
export type SourceStatus =
  | "candidate"
  | "under_review"
  | "approved"
  | "restricted"
  | "suspended"
  | "retired";
export type SourceVisibility =
  | "public_full"
  | "public_name_only"
  | "public_type_only"
  | "internal_only";
export type OperationsRole =
  | "health_intelligence_collector"
  | "health_intelligence_reviewer"
  | "health_intelligence_publisher"
  | "admin";
export type WorkflowStage =
  | "collected"
  | "identity_review"
  | "basis_review"
  | "source_review"
  | "pending_verification"
  | "verified"
  | "publication_approved"
  | "rejected"
  | "needs_reverification"
  | "expired";

export type SourceRegistryRecord = {
  id: string;
  sourceName: string;
  country: OperationalMarket;
  sourceType:
    | "government_regulatory"
    | "manufacturer"
    | "licensed_pharmacy"
    | "hospital_clinic"
    | "distributor"
    | "reimbursement_database"
    | "formulary"
    | "public_marketplace"
    | "manual_quotation"
    | "other_verified";
  organizationProvider: string;
  urlReference: string;
  accessMethod: string;
  normalPricingBasis: string;
  trustLevel: "high" | "medium" | "low" | "unknown";
  trustReason: string;
  verificationMethod: string;
  termsUseNotes: string;
  geographicScope: string[];
  medicineScope: string;
  updateFrequency: string;
  lastReviewedAt?: string;
  nextReviewDue?: string;
  status: SourceStatus;
  reviewer?: string;
  visibility: SourceVisibility;
  dataClass: "demo" | "real_unverified" | "real_verified";
  approvedCollectionMethods?: ConnectorType[];
  collectionRestrictions?: string;
  connectorActivationStatus?: "inactive" | "approved" | "suspended" | "retired";
};

export type ConnectorType =
  | "manual"
  | "csv"
  | "api"
  | "structured_file"
  | "assisted_extraction"
  | "other_approved";

export type OperationalObservation = {
  id: string;
  sourceId: string;
  country: OperationalMarket;
  originalObservedProductText: string;
  originalLanguage: string;
  matchedProductId?: string;
  candidateProductId?: string;
  productResolutionState:
    | "confirmed_exact"
    | "candidate_review"
    | "unresolved"
    | "rejected";
  observedBrand: string;
  observedIngredient: string;
  observedManufacturer: string;
  observedStrength: string;
  observedDosageForm: string;
  observedReleaseType: string;
  observedPack: string;
  price: number;
  currency: "MYR" | "THB" | "SGD";
  packQuantity: number;
  basis?:
    | "retail_cash_price"
    | "pharmacy_list_price"
    | "hospital_price"
    | "manufacturer_list_price"
    | "reimbursed_price"
    | "wholesale_price"
    | "other_verified_basis";
  basisStatus: "basis_unverified" | "basis_verified";
  availability:
    | "available"
    | "reported_available"
    | "out_of_stock"
    | "unavailable"
    | "unknown";
  observedAt: string;
  sourceReference: string;
  notes: string;
  evidence: Array<{ type: string; reference: string; notes?: string }>;
  workflowStage: WorkflowStage;
  freshnessStatus: "fresh" | "review_due" | "stale" | "expired";
  anomalyFlags: string[];
  collector: string;
  reviewer?: string;
  publisher?: string;
  reviewDueAt?: string;
  validUntil?: string;
  dataClass: "demo" | "real_unverified" | "real_verified";
  ingestionBatchId?: string;
  ingestionRowId?: string;
  externalItemId?: string;
  observationSignature?: string;
};

const stageTransitions: Record<WorkflowStage, WorkflowStage[]> = {
  collected: ["identity_review", "rejected"],
  identity_review: ["basis_review", "rejected"],
  basis_review: ["source_review", "rejected"],
  source_review: ["pending_verification", "rejected"],
  pending_verification: ["verified", "rejected"],
  verified: ["publication_approved", "needs_reverification", "rejected"],
  publication_approved: ["needs_reverification", "expired"],
  rejected: ["collected"],
  needs_reverification: [
    "identity_review",
    "basis_review",
    "source_review",
    "pending_verification",
    "rejected",
  ],
  expired: ["identity_review", "rejected"],
};

export function canMoveObservation(
  from: WorkflowStage,
  to: WorkflowStage,
): boolean {
  return stageTransitions[from].includes(to);
}

export function roleCan(
  role: OperationsRole,
  action: "collect" | "review" | "publish" | "audit_read",
): boolean {
  if (role === "admin") return true;
  if (action === "collect")
    return (
      role === "health_intelligence_collector" ||
      role === "health_intelligence_reviewer"
    );
  if (action === "review" || action === "audit_read")
    return (
      role === "health_intelligence_reviewer" ||
      role === "health_intelligence_publisher"
    );
  return role === "health_intelligence_publisher";
}

export function sourceMaySupportPublication(
  source: SourceRegistryRecord,
  manualOverrideReason?: string,
): boolean {
  return (
    (source.status === "approved" &&
      !["low", "unknown"].includes(source.trustLevel)) ||
    Boolean(manualOverrideReason?.trim())
  );
}

export function operationalPublicationEligibility(
  observation: OperationalObservation,
  source: SourceRegistryRecord,
): { eligible: boolean; reasons: string[] } {
  const reasons: string[] = [];
  if (!sourceMaySupportPublication(source))
    reasons.push("source_not_approved_or_trusted");
  if (observation.productResolutionState !== "confirmed_exact")
    reasons.push("product_not_resolved");
  if (observation.basisStatus !== "basis_verified")
    reasons.push("basis_unverified");
  if (observation.workflowStage !== "verified")
    reasons.push("human_verification_required");
  if (observation.dataClass !== "real_verified")
    reasons.push("real_verified_data_required");
  if (observation.collector === observation.reviewer)
    reasons.push("four_eyes_review_recommended");
  return { eligible: reasons.length === 0, reasons };
}

export function observationFingerprint(
  observation: Pick<
    OperationalObservation,
    | "sourceId"
    | "country"
    | "price"
    | "packQuantity"
    | "observedAt"
    | "originalObservedProductText"
  >,
): string {
  return [
    observation.sourceId,
    observation.country,
    observation.originalObservedProductText
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " "),
    observation.price.toFixed(6),
    observation.packQuantity.toFixed(4),
    observation.observedAt.slice(0, 10),
  ].join("|");
}

export function detectLikelyDuplicate(
  candidate: OperationalObservation,
  existing: OperationalObservation[],
): OperationalObservation[] {
  const fingerprint = observationFingerprint(candidate);
  return existing.filter(
    (item) => observationFingerprint(item) === fingerprint,
  );
}

export function anomalyFlags(
  candidate: OperationalObservation,
  recent: OperationalObservation[],
  varianceThresholdPercent = 35,
): string[] {
  const flags = new Set<string>();
  if (
    candidate.currency !==
    ({ MY: "MYR", TH: "THB", SG: "SGD" } as const)[candidate.country]
  )
    flags.add("currency_inconsistency");
  const comparable = recent.filter(
    (item) =>
      item.country === candidate.country &&
      item.matchedProductId &&
      item.matchedProductId === candidate.matchedProductId &&
      item.basis === candidate.basis,
  );
  for (const item of comparable) {
    if (item.packQuantity !== candidate.packQuantity)
      flags.add("pack_mismatch");
    const previousUnit = item.price / item.packQuantity;
    const candidateUnit = candidate.price / candidate.packQuantity;
    if (
      previousUnit > 0 &&
      Math.abs((candidateUnit - previousUnit) / previousUnit) * 100 >
        varianceThresholdPercent
    )
      flags.add("price_variance_review");
  }
  return [...flags];
}

export function freshnessStatus(
  reviewDueAt?: string,
  validUntil?: string,
  now = new Date(),
): OperationalObservation["freshnessStatus"] {
  if (validUntil && new Date(validUntil) <= now) return "expired";
  if (reviewDueAt && new Date(reviewDueAt) <= now) return "review_due";
  return "fresh";
}

export function operationQueue(
  observation: OperationalObservation,
):
  | "new_observations"
  | "unresolved_products"
  | "source_review"
  | "verification_queue"
  | "publication_approval"
  | "reverification_due"
  | "rejected_exception" {
  if (
    observation.workflowStage === "rejected" ||
    observation.anomalyFlags.length
  )
    return "rejected_exception";
  if (observation.productResolutionState !== "confirmed_exact")
    return "unresolved_products";
  if (
    observation.freshnessStatus !== "fresh" ||
    ["needs_reverification", "expired"].includes(observation.workflowStage)
  )
    return "reverification_due";
  if (observation.workflowStage === "source_review") return "source_review";
  if (observation.workflowStage === "pending_verification")
    return "verification_queue";
  if (observation.workflowStage === "verified") return "publication_approval";
  return "new_observations";
}
