# MMS Metrics, KPI/KRI & Control-Performance Monitoring Runbook

**Document ID:** MMS-GOV-RUN-MET-001  
**Status:** WORKING DRAFT

## Scope

This runbook governs metric definitions, KPI/KRI thresholds, observations, traffic-light assessment and evidence lineage.

T6.36 does not itself approve a KPI target, activate a metric, populate performance observations, reclassify any dashboard as green, or configure Production monitoring.

## Metric definition

Every governed metric should identify:
- metric ID and name;
- domain and metric type;
- accountable owner role;
- definition;
- calculation method;
- source system;
- unit;
- direction;
- frequency;
- approved thresholds where traffic-light assessment is used.

## Threshold discipline

Non-informational metrics must not become APPROVED or ACTIVE without explicit GREEN, AMBER and RED threshold definitions plus approval evidence.

Thresholds must not be reverse-engineered from current results merely to produce a favorable status.

## Observation evidence

Metric observations are append-only. A GREEN/AMBER/RED assessment requires an immutable evidence artifact link.

Corrections and restatements are added as new observations; prior observations remain part of the evidence trail.

## Interpretation boundary

A green metric is a measured result against an approved threshold. It is not automatically:
- proof a control is effective;
- evidence of legal/regulatory compliance;
- clinical approval;
- certification;
- Production readiness.

Those conclusions retain their own governance evidence and approval requirements.

## Data quality

Known missingness, stale data, duplicate records, source-system changes, denominator changes and material calculation changes must be disclosed before management relies on a metric.

## Existing dashboards

Existing operations/dashboard counters remain operational queue indicators. T6.36 does not silently convert those counters into approved KPIs or management-assurance conclusions.

## Production boundary

No Production monitoring vendor, alerting threshold, KPI target, scheduled metric job or executive dashboard is activated by this phase.
