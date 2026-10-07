export type ContinuityTier = "TIER_0" | "TIER_1" | "TIER_2" | "TIER_3";

export const continuityTargets = Object.freeze({
  TIER_0: {
    label: "Safety / identity / transactional control plane",
    targetRtoMinutes: 60,
    targetRpoMinutes: 15,
    examples: ["authentication", "commercial database", "governance audit trail", "payment/commission state"],
  },
  TIER_1: {
    label: "Core operational workflow",
    targetRtoMinutes: 240,
    targetRpoMinutes: 60,
    examples: ["operator workflows", "partner workflows", "CRM persistence", "management intelligence"],
  },
  TIER_2: {
    label: "Customer-facing non-transactional service",
    targetRtoMinutes: 480,
    targetRpoMinutes: 1440,
    examples: ["public website", "health intelligence public read surfaces", "content delivery"],
  },
  TIER_3: {
    label: "Non-critical supporting capability",
    targetRtoMinutes: 1440,
    targetRpoMinutes: 1440,
    examples: ["non-essential analytics", "non-critical internal reports"],
  },
} satisfies Record<ContinuityTier, {
  label: string;
  targetRtoMinutes: number;
  targetRpoMinutes: number;
  examples: readonly string[];
}>);

export const continuityDependencies = Object.freeze([
  {
    key: "MMS_APPLICATION",
    tier: "TIER_2" as ContinuityTier,
    backupEvidenceRequired: false,
    restoreEvidenceRequired: true,
    note: "Application recovery is primarily repository/build/deployment based; deployment recovery still requires verified release and environment configuration.",
  },
  {
    key: "MMS_COMMERCIAL_DATABASE",
    tier: "TIER_0" as ContinuityTier,
    backupEvidenceRequired: true,
    restoreEvidenceRequired: true,
    note: "Backup existence alone is insufficient; a tested restore with integrity reconciliation is required.",
  },
  {
    key: "MMS_GOVERNANCE_DATA",
    tier: "TIER_0" as ContinuityTier,
    backupEvidenceRequired: true,
    restoreEvidenceRequired: true,
    note: "Governance audit evidence must remain complete and tamper-evident after restore.",
  },
  {
    key: "MMS_AUTH",
    tier: "TIER_0" as ContinuityTier,
    backupEvidenceRequired: true,
    restoreEvidenceRequired: true,
    note: "Recovery must preserve trusted app metadata and must not use direct SQL mutation of auth.users.",
  },
  {
    key: "MMS_ZOHO_CRM",
    tier: "TIER_1" as ContinuityTier,
    backupEvidenceRequired: true,
    restoreEvidenceRequired: true,
    note: "Dedicated MMS tenant identity must be verified before live continuity evidence can be accepted.",
  },
]);

export const restoreEvidenceChecklist = Object.freeze([
  "Backup or recovery point identifier and timestamp are recorded.",
  "Restore target is isolated from Production until validation completes.",
  "Schema/object completeness is verified before application traffic is permitted.",
  "Record counts and key integrity constraints are reconciled for the affected scope.",
  "Duplicate, missing, replayed and out-of-order transactional mutations are checked.",
  "Authentication identities and trusted app metadata are validated through supported tooling.",
  "Audit and governance evidence remains attributable and internally consistent.",
  "Recovery timestamp, operator evidence and unresolved discrepancies are documented.",
]);

export const businessContinuityModes = Object.freeze([
  {
    key: "READ_ONLY",
    description: "Allow safe informational reads while mutations remain disabled.",
    permittedWhen: "Read path is demonstrably consistent and does not expose stale state as authoritative.",
  },
  {
    key: "FAIL_CLOSED",
    description: "Disable the affected capability and require manual follow-up.",
    permittedWhen: "Mutation integrity, authentication, safety, payment state or audit evidence cannot be trusted.",
  },
  {
    key: "MANUAL_RECONCILIATION",
    description: "Temporarily route affected work to documented manual reconciliation without pretending system completion.",
    permittedWhen: "A named human workflow has been approved and evidence can be retained.",
  },
]);

export function assertRecoveryEvidence(input: {
  tier: ContinuityTier;
  restoreTarget: string;
  recoveryPointReference?: string | null;
  integrityVerified: boolean;
  reconciliationCompleted: boolean;
  unresolvedDiscrepancies: number;
}) {
  if (!input.restoreTarget.trim()) throw new Error("Restore target is required.");
  if ((input.tier === "TIER_0" || input.tier === "TIER_1") && !input.recoveryPointReference?.trim()) {
    throw new Error("Tier 0/1 recovery requires a recovery-point reference.");
  }
  if (!input.integrityVerified) throw new Error("Recovery cannot complete before integrity verification.");
  if (!input.reconciliationCompleted) throw new Error("Recovery cannot complete before reconciliation.");
  if (input.unresolvedDiscrepancies > 0) throw new Error("Recovery cannot complete with unresolved discrepancies.");
}
