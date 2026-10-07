-- T6.37 data quality, reconciliation and source-trust governance.
-- Preview/integration only until separately approved for Production.
-- Governance metadata only; no operational dataset is declared trustworthy by this migration.

begin;

create table if not exists mms_governance.data_quality_assessments (
  id uuid primary key default gen_random_uuid(),
  assessment_id text not null unique,
  dataset_name text not null,
  source_system text not null,
  source_reference text not null,
  owner_role text not null,
  assessed_at timestamptz not null,
  status text not null check (status in (
    'NOT_ASSESSED','PASS','PASS_WITH_LIMITATIONS','FAIL','BLOCKED'
  )),
  freshness_state text not null check (freshness_state in ('NOT_ASSESSED','CURRENT','STALE','UNKNOWN')),
  completeness_state text not null check (completeness_state in ('NOT_ASSESSED','COMPLETE','INCOMPLETE','UNKNOWN')),
  duplicate_state text not null check (duplicate_state in ('NOT_ASSESSED','CLEAR','POSSIBLE_DUPLICATES','CONFIRMED_DUPLICATES','UNKNOWN')),
  reconciliation_state text not null check (reconciliation_state in ('NOT_ASSESSED','RECONCILED','VARIANCE','UNRECONCILED','NOT_APPLICABLE')),
  lineage_state text not null check (lineage_state in ('NOT_ASSESSED','COMPLETE','PARTIAL','BROKEN','UNKNOWN')),
  evidence_id uuid references mms_governance.evidence_artifacts(id) on delete restrict,
  limitations text,
  variance_summary text,
  remediation_reference text,
  next_review_at timestamptz,
  created_at timestamptz not null default now(),
  check (
    status in ('NOT_ASSESSED','BLOCKED')
    or evidence_id is not null
  ),
  check (
    status <> 'PASS'
    or (
      freshness_state='CURRENT'
      and completeness_state='COMPLETE'
      and duplicate_state='CLEAR'
      and reconciliation_state in ('RECONCILED','NOT_APPLICABLE')
      and lineage_state='COMPLETE'
    )
  ),
  check (
    status <> 'PASS_WITH_LIMITATIONS'
    or limitations is not null
  ),
  check (
    reconciliation_state <> 'VARIANCE'
    or variance_summary is not null
  )
);

create index if not exists data_quality_assessments_dataset_idx
  on mms_governance.data_quality_assessments(dataset_name,assessed_at desc);

create index if not exists data_quality_assessments_status_idx
  on mms_governance.data_quality_assessments(status,reconciliation_state,freshness_state);

drop trigger if exists data_quality_assessments_immutable on mms_governance.data_quality_assessments;
create trigger data_quality_assessments_immutable
  before update or delete on mms_governance.data_quality_assessments
  for each row execute function mms_governance.reject_immutable_mutation();

alter table mms_governance.data_quality_assessments enable row level security;
alter table mms_governance.data_quality_assessments force row level security;
revoke all on table mms_governance.data_quality_assessments from public, anon, authenticated;

commit;
