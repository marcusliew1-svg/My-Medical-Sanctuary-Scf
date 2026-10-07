export type DataQualityStatus = "NOT_ASSESSED" | "PASS" | "PASS_WITH_LIMITATIONS" | "FAIL" | "BLOCKED";

export const dataQualityRules = Object.freeze([
  "A dataset must not be treated as trusted merely because a query returned rows.",
  "PASS requires current freshness, complete expected data, no unresolved duplicates, reconciled or not-applicable totals, complete lineage, and evidence.",
  "PASS_WITH_LIMITATIONS requires explicit limitations.",
  "Known reconciliation variance requires a variance summary.",
  "Data-quality assessments are append-only; reassessment creates a new record.",
  "Metric/KPI observations should not be relied upon beyond the quality of their source data.",
  "Operational reconciliation must not silently overwrite source-system conflicts.",
]);

export const dataQualityChecklist = Object.freeze([
  "Freshness is measured against a defined expectation.",
  "Expected grain and completeness are checked.",
  "Duplicate/uniqueness risk is assessed.",
  "Source-to-target reconciliation is performed where applicable.",
  "Data lineage from source to reported value is traceable.",
  "Known missingness, stale data and source changes are disclosed.",
  "Assessment links to immutable evidence.",
  "Material variances have an owner/remediation path.",
]);

export function assertDataQualityAssessment(input: {
  status: DataQualityStatus;
  evidenceId?: string | null;
  freshnessState: string;
  completenessState: string;
  duplicateState: string;
  reconciliationState: string;
  lineageState: string;
  limitations?: string | null;
  varianceSummary?: string | null;
}) {
  if (input.status !== "NOT_ASSESSED" && input.status !== "BLOCKED" && !input.evidenceId?.trim()) {
    throw new Error("Assessed data quality requires evidence linkage.");
  }
  if (input.status === "PASS") {
    if (
      input.freshnessState !== "CURRENT" ||
      input.completenessState !== "COMPLETE" ||
      input.duplicateState !== "CLEAR" ||
      !["RECONCILED","NOT_APPLICABLE"].includes(input.reconciliationState) ||
      input.lineageState !== "COMPLETE"
    ) throw new Error("PASS requires all core data-quality dimensions to satisfy policy.");
  }
  if (input.status === "PASS_WITH_LIMITATIONS" && !input.limitations?.trim()) {
    throw new Error("PASS_WITH_LIMITATIONS requires explicit limitations.");
  }
  if (input.reconciliationState === "VARIANCE" && !input.varianceSummary?.trim()) {
    throw new Error("Reconciliation variance requires a variance summary.");
  }
}
