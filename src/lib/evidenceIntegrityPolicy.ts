export const sha256HexPattern = /^[0-9a-f]{64}$/;

export const evidenceIntegrityRules = Object.freeze([
  "Evidence metadata must identify the governed subject and original source.",
  "Evidence must use a stable storage location or durable source reference.",
  "A SHA-256 digest must be recorded for immutable evidence artifacts.",
  "Evidence-artifact metadata is append-only; corrections require a new artifact rather than mutation.",
  "Verification must record verifier role, timestamp and method.",
  "A digest proves byte-level sameness only; it does not prove truth, authorship, legality or regulatory acceptance.",
  "Sensitive or clinical content must not be copied into general governance evidence metadata.",
]);

export const evidenceLineageChecklist = Object.freeze([
  "Evidence ID is unique and attributable.",
  "Subject type and subject reference identify what the evidence supports.",
  "Source system and source reference identify origin.",
  "Storage location is stable enough for later retrieval.",
  "SHA-256 digest is a lowercase 64-character hexadecimal value.",
  "Capture role and timestamp are recorded.",
  "Independent verification details are recorded when verification is claimed.",
  "Replacement/superseding evidence is added as a new artifact rather than overwriting history.",
]);

export function assertEvidenceArtifact(input: {
  evidenceId?: string | null;
  subjectReference?: string | null;
  sourceReference?: string | null;
  storageLocation?: string | null;
  contentDigestSha256?: string | null;
  capturedByRole?: string | null;
  capturedAt?: string | null;
}) {
  if (!input.evidenceId?.trim()) throw new Error("Evidence artifact requires an evidence ID.");
  if (!input.subjectReference?.trim()) throw new Error("Evidence artifact requires a subject reference.");
  if (!input.sourceReference?.trim()) throw new Error("Evidence artifact requires a source reference.");
  if (!input.storageLocation?.trim()) throw new Error("Evidence artifact requires a storage location.");
  if (!input.contentDigestSha256 || !sha256HexPattern.test(input.contentDigestSha256)) {
    throw new Error("Evidence artifact requires a valid SHA-256 digest.");
  }
  if (!input.capturedByRole?.trim()) throw new Error("Evidence artifact requires a capture role.");
  if (!input.capturedAt?.trim()) throw new Error("Evidence artifact requires a capture timestamp.");
}

export function assertEvidenceVerification(input: {
  verifiedAt?: string | null;
  verifiedByRole?: string | null;
  verificationMethod?: string | null;
}) {
  if (!input.verifiedAt) return;
  if (!input.verifiedByRole?.trim()) throw new Error("Verified evidence requires verifier role.");
  if (!input.verificationMethod?.trim()) throw new Error("Verified evidence requires verification method.");
}
