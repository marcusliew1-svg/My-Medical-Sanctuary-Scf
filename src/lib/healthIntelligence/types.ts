export const HEALTH_INTELLIGENCE_RULE_VERSION = "mms-hi-match-v1";

export type RecordState =
  | "collected"
  | "pending_review"
  | "verified"
  | "published"
  | "rejected"
  | "expired"
  | "needs_reverification";

export type PublicationStatus =
  | "not_eligible"
  | "eligible"
  | "approved"
  | "published"
  | "unpublished";
export type DataStatus = "demo" | "live";
export type PriceVerificationStatus =
  | "verified"
  | "reported"
  | "indicative"
  | "unverified"
  | "expired";
export type MatchClassification =
  | "exact_match"
  | "close_equivalent"
  | "not_comparable"
  | "review_required_due_to_exception";
export type MatchConfidence =
  | "exact_verified"
  | "close_verified"
  | "possible"
  | "not_comparable"
  | "review_required";

export type IngredientComponent = {
  ingredientId: string;
  name: string;
  strengthValue: number;
  strengthUnit: string;
  saltOrEster?: string;
  clinicallyMeaningfulVariant?: boolean;
};

export type MedicineProductIdentity = {
  id: string;
  productCode: string;
  genericName: string;
  brandName: string;
  manufacturerName: string;
  dosageFormId: string;
  routeId: string;
  releaseTypeId: string;
  packSize: number;
  unitsPerPack: number;
  deviceOrPresentation?: string;
  ingredients: IngredientComponent[];
  combinationProduct: boolean;
  biologic: boolean;
  biosimilar: boolean;
  narrowTherapeuticIndex: boolean;
  complexInjectable: boolean;
  specialDevice: boolean;
  oncologyMedicine: boolean;
  specialFormulation: boolean;
  verificationStatus: RecordState;
  publicationStatus: PublicationStatus;
  dataStatus: DataStatus;
  verifiedAt?: string;
  validUntil?: string;
  reviewDueAt?: string;
};

export type PriceSource = {
  id: string;
  sourceCode: string;
  sourceName: string;
  sourceType:
    | "pharmacy"
    | "hospital"
    | "manufacturer"
    | "distributor"
    | "government_database"
    | "reimbursement_database"
    | "marketplace"
    | "manually_verified"
    | "other";
  marketId: string;
  sourceUrl?: string;
  trustLevel: "high" | "medium" | "low" | "unknown";
  active: boolean;
  dataStatus: DataStatus;
  verificationStatus: RecordState;
  verifiedAt?: string;
  sourceStatus?:
    | "candidate"
    | "under_review"
    | "approved"
    | "restricted"
    | "suspended"
    | "retired";
  visibilityLevel?:
    | "public_full"
    | "public_name_only"
    | "public_type_only"
    | "internal_only";
};

export type PriceObservation = {
  id: string;
  productId: string;
  marketId: string;
  sourceId?: string;
  observedLocalPrice: number;
  currency: string;
  packQuantity: number;
  comparisonBasis?:
    | "retail_cash_price"
    | "pharmacy_list_price"
    | "hospital_price"
    | "manufacturer_list_price"
    | "reimbursed_price"
    | "wholesale_price"
    | "other_verified_basis";
  normalizationUnit?:
    | "tablet"
    | "capsule"
    | "vial"
    | "pen"
    | "syringe"
    | "bottle"
    | "ml"
    | "unit"
    | "none";
  normalizedQuantity?: number;
  observedAt?: string;
  priceVerificationStatus: PriceVerificationStatus;
  recordState: RecordState;
  publicationStatus: PublicationStatus;
  reviewer?: string;
  verifiedAt?: string;
  validUntil?: string;
  reviewDueAt?: string;
  dataStatus: DataStatus;
};

export type MatchDimension = {
  dimension:
    | "ingredients"
    | "strength"
    | "form"
    | "route"
    | "release"
    | "manufacturer"
    | "brand"
    | "pack"
    | "device";
  matches: boolean;
  weight: number;
};

export type MatchResult = {
  classification: MatchClassification;
  confidence: MatchConfidence;
  score: number;
  ruleVersion: string;
  dimensions: MatchDimension[];
  hardExceptionCodes: string[];
  explanation: string;
};

export type GenericRelationship = {
  id: string;
  sourceProductId: string;
  candidateProductId: string;
  relationshipType:
    | "potential_generic_match"
    | "verified_generic_relationship"
    | "possible_equivalent_review_required"
    | "not_suitable_for_automatic_comparison";
  matchConfidence: MatchConfidence;
  verificationStatus: RecordState;
  reviewer?: string;
  reviewNotes?: string;
  dataStatus: DataStatus;
};

export type VerificationEvent = {
  id: string;
  targetType: string;
  targetId: string;
  reviewer: string;
  decision:
    | "submit_for_review"
    | "verify"
    | "reject"
    | "publish"
    | "unpublish"
    | "mark_stale"
    | "reverify";
  reasonNotes?: string;
  previousState: RecordState;
  newState: RecordState;
  occurredAt: string;
  dataStatus: DataStatus;
};

export type AuditEvent = {
  id: string;
  actor: string;
  action:
    | "create"
    | "update"
    | "verify"
    | "reject"
    | "publish"
    | "unpublish"
    | "mark_stale"
    | "relationship_change";
  targetType: string;
  targetId: string;
  occurredAt: string;
  metadata: Record<string, unknown>;
  dataStatus: DataStatus;
};
