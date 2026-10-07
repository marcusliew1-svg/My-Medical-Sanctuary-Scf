-- T6.38 AI/model governance, human oversight and validation evidence.
-- Preview/integration only until separately approved for Production.
-- No AI capability is activated by this migration.

begin;

alter table mms_governance.ai_use_cases
  add column if not exists model_identifier text,
  add column if not exists model_version text,
  add column if not exists system_policy_reference text,
  add column if not exists human_oversight_reference text,
  add column if not exists privacy_review_reference text,
  add column if not exists validation_reference text,
  add column if not exists monitoring_reference text,
  add column if not exists disable_or_rollback_reference text,
  add column if not exists clinical_governance_reference text,
  add column if not exists last_validated_at timestamptz;

alter table mms_governance.ai_use_cases
  drop constraint if exists ai_use_cases_activation_evidence_check;

alter table mms_governance.ai_use_cases
  add constraint ai_use_cases_activation_evidence_check
  check (
    status not in ('APPROVED','ACTIVE')
    or (
      provider_name is not null
      and model_identifier is not null
      and model_version is not null
      and system_policy_reference is not null
      and human_review_required = true
      and human_oversight_reference is not null
      and privacy_review_reference is not null
      and validation_reference is not null
      and monitoring_reference is not null
      and disable_or_rollback_reference is not null
      and approval_reference is not null
      and last_validated_at is not null
      and (
        clinical_governance_required = false
        or clinical_governance_reference is not null
      )
    )
  );

create table if not exists mms_governance.ai_validation_assessments (
  id uuid primary key default gen_random_uuid(),
  validation_id text not null unique,
  ai_use_case_id uuid not null references mms_governance.ai_use_cases(id) on delete restrict,
  validation_type text not null check (validation_type in (
    'SAFETY',
    'ACCURACY',
    'REFUSAL_BOUNDARY',
    'HUMAN_OVERSIGHT',
    'PRIVACY',
    'SECURITY',
    'BIAS_FAIRNESS',
    'ROBUSTNESS',
    'CONTENT_GROUNDING',
    'OTHER'
  )),
  scope text not null,
  result text not null check (result in ('PASS','PASS_WITH_LIMITATIONS','FAIL','BLOCKED')),
  evidence_id uuid references mms_governance.evidence_artifacts(id) on delete restrict,
  assessor_role text not null,
  validated_at timestamptz not null,
  limitations text,
  remediation_reference text,
  notes text,
  created_at timestamptz not null default now(),
  check (
    result in ('FAIL','BLOCKED')
    or evidence_id is not null
  ),
  check (
    result <> 'PASS_WITH_LIMITATIONS'
    or limitations is not null
  )
);

create index if not exists ai_validation_use_case_idx
  on mms_governance.ai_validation_assessments(ai_use_case_id,validated_at desc);

drop trigger if exists ai_validation_assessments_immutable on mms_governance.ai_validation_assessments;
create trigger ai_validation_assessments_immutable
  before update or delete on mms_governance.ai_validation_assessments
  for each row execute function mms_governance.reject_immutable_mutation();

alter table mms_governance.ai_validation_assessments enable row level security;
alter table mms_governance.ai_validation_assessments force row level security;
revoke all on table mms_governance.ai_validation_assessments from public, anon, authenticated;

commit;
