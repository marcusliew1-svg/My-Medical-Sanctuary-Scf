export type MetricDirection = "HIGHER_IS_BETTER" | "LOWER_IS_BETTER" | "TARGET_RANGE" | "INFORMATIONAL";
export type MetricThresholdState = "NOT_ASSESSED" | "GREEN" | "AMBER" | "RED";

export const metricGovernanceRules = Object.freeze([
  "Every metric must have a stable definition, calculation method, source system, unit, frequency and accountable owner role.",
  "APPROVED or ACTIVE non-informational metrics require explicit approved GREEN/AMBER/RED threshold definitions.",
  "Thresholds must not be invented merely to make a dashboard appear green.",
  "A measured result and a management conclusion are separate records.",
  "Assessed GREEN/AMBER/RED observations require evidence linkage.",
  "Metric observations are append-only; corrections require a new observation rather than overwriting history.",
  "A KPI/KRI trend is not by itself proof of legal, clinical, regulatory or control compliance.",
]);

export const metricEvidenceChecklist = Object.freeze([
  "Metric ID and definition are controlled.",
  "Calculation method and unit are explicit.",
  "Source system/data lineage is identified.",
  "Measurement period and capture timestamp are recorded where applicable.",
  "Threshold definitions are approved before traffic-light assessment.",
  "Observed result is traceable to a source reference.",
  "Assessed result links to immutable evidence.",
  "Known data-quality limitations are disclosed.",
  "Restatements are added as new observations rather than rewriting prior evidence.",
]);

export function assertMetricActivation(input: {
  direction: MetricDirection;
  approvalReference?: string | null;
  calculationMethod?: string | null;
  sourceSystem?: string | null;
  ownerRole?: string | null;
  greenThreshold?: string | null;
  amberThreshold?: string | null;
  redThreshold?: string | null;
}) {
  if (!input.approvalReference?.trim()) throw new Error("Active metric requires approval evidence.");
  if (!input.calculationMethod?.trim()) throw new Error("Active metric requires a calculation method.");
  if (!input.sourceSystem?.trim()) throw new Error("Active metric requires a source system.");
  if (!input.ownerRole?.trim()) throw new Error("Active metric requires an accountable owner role.");
  if (input.direction !== "INFORMATIONAL") {
    if (!input.greenThreshold?.trim() || !input.amberThreshold?.trim() || !input.redThreshold?.trim()) {
      throw new Error("Non-informational active metric requires approved traffic-light thresholds.");
    }
  }
}

export function assertMetricObservation(input: {
  thresholdState: MetricThresholdState;
  sourceReference?: string | null;
  evidenceId?: string | null;
  valueNumeric?: number | null;
  valueText?: string | null;
}) {
  if (!input.sourceReference?.trim()) throw new Error("Metric observation requires a source reference.");
  if (input.valueNumeric == null && !input.valueText?.trim()) throw new Error("Metric observation requires a measured value.");
  if (input.thresholdState !== "NOT_ASSESSED" && !input.evidenceId?.trim()) {
    throw new Error("Assessed metric observation requires evidence linkage.");
  }
}
