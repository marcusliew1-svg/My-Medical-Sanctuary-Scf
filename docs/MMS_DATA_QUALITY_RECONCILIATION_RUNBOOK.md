# MMS Data Quality, Reconciliation & Source-Trust Runbook

**Document ID:** MMS-GOV-RUN-DQ-001  
**Status:** WORKING DRAFT

## Scope

This runbook governs whether data used for operations, governance, metrics, audit, reconciliation or management reporting is sufficiently trustworthy for the stated purpose.

T6.37 does not certify any real dataset, complete a real reconciliation, or declare Production data trustworthy.

## Core quality dimensions

Every assessment considers:
- freshness;
- completeness;
- duplicate/uniqueness risk;
- source-to-target reconciliation;
- lineage;
- evidence;
- known limitations.

## PASS standard

PASS requires all of the following:
- freshness = CURRENT;
- completeness = COMPLETE;
- duplicates = CLEAR;
- reconciliation = RECONCILED or NOT_APPLICABLE;
- lineage = COMPLETE;
- immutable evidence link.

A dataset with unresolved limitations must not be labelled PASS.

## PASS_WITH_LIMITATIONS

This status is permitted only when the limitations are explicit. The limitation should explain what cannot safely be concluded from the dataset.

## Reconciliation

Material source-to-target variances must remain visible. A reconciliation process must not silently overwrite a conflicting source value merely to force equality.

Where a variance exists, record the variance summary and remediation/escalation path.

## Append-only assessment history

Data-quality assessments are immutable. Reassessment creates a new record so management can see changes in quality over time rather than losing prior findings.

## Metrics dependency

A metric can be technically calculated while its source data remains poor. T6.37 therefore treats metric output and source-data trust as separate questions.

## Existing duplicate/reconciliation controls

Existing commercial lead duplicate review and Sales Partner registry reconciliation remain domain-specific controls. T6.37 does not replace or weaken them; it adds a cross-cutting governance assessment layer.

## Production boundary

No Production data certification, source-system write-back, automated reconciliation job, metric reclassification or external data-quality vendor is activated by this phase.
