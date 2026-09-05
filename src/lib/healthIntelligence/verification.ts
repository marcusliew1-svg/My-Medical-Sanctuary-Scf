import type {
  DataStatus,
  PriceObservation,
  PriceSource,
  RecordState,
} from "@/lib/healthIntelligence/types";

const ALLOWED_TRANSITIONS: Record<RecordState, readonly RecordState[]> = {
  collected: ["pending_review"],
  pending_review: ["verified", "rejected"],
  verified: ["published", "needs_reverification", "expired"],
  published: ["needs_reverification", "expired"],
  rejected: ["collected", "pending_review"],
  expired: ["pending_review"],
  needs_reverification: ["pending_review"],
};

export function canTransitionRecord(
  previous: RecordState,
  next: RecordState,
): boolean {
  return ALLOWED_TRANSITIONS[previous].includes(next);
}

export function assertRecordTransition(
  previous: RecordState,
  next: RecordState,
): void {
  if (!canTransitionRecord(previous, next))
    throw new Error(
      `Invalid Health Intelligence transition: ${previous} -> ${next}`,
    );
}

export type PublicationEligibilityInput = {
  observation: PriceObservation;
  source?: PriceSource;
  productIdentityVerified: boolean;
  now?: Date;
};

export function pricePublicationEligibility(
  input: PublicationEligibilityInput,
): { eligible: boolean; reasons: string[] } {
  const { observation, source, productIdentityVerified } = input;
  const now = input.now || new Date();
  const reasons: string[] = [];
  if (observation.recordState !== "verified")
    reasons.push("price_not_verified");
  if (observation.priceVerificationStatus !== "verified")
    reasons.push("price_confidence_not_verified");
  if (!observation.verifiedAt || !observation.reviewer)
    reasons.push("verification_evidence_missing");
  if (!source?.active || !observation.sourceId)
    reasons.push("active_source_missing");
  if (
    observation.dataStatus === "live" &&
    source?.sourceStatus !== "approved"
  )
    reasons.push("source_not_approved");
  if (
    observation.dataStatus === "live" &&
    (!source || ["low", "unknown"].includes(source.trustLevel))
  )
    reasons.push("source_trust_insufficient");
  if (!observation.comparisonBasis) reasons.push("comparison_basis_missing");
  if (!observation.observedAt) reasons.push("observation_date_missing");
  if (!productIdentityVerified) reasons.push("product_identity_not_verified");
  if (observation.dataStatus === "demo") reasons.push("demo_data_never_public");
  if (observation.validUntil && new Date(observation.validUntil) < now)
    reasons.push("verification_expired");
  return { eligible: reasons.length === 0, reasons };
}

export function publicDataAllowed(dataStatus: DataStatus): boolean {
  return dataStatus === "live";
}
