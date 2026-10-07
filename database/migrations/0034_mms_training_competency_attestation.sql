-- T6.30 training, competency and policy-attestation hardening.
-- Preview/integration only until separately approved for Production.
-- Governance metadata only; patient clinical records are prohibited.

begin;

alter table mms_governance.training_records
  add column if not exists evidence_reference text,
  add column if not exists policy_attestation_reference text,
  add column if not exists verified_at timestamptz,
  add column if not exists refresh_required boolean not null default false;

alter table mms_governance.training_records
  drop constraint if exists training_records_competency_evidence_check;

alter table mms_governance.training_records
  add constraint training_records_competency_evidence_check
  check (
    status not in ('COMPETENT','COMPETENT_WITH_CONDITIONS')
    or (
      competency_method is not null
      and assessor_role is not null
      and completed_at is not null
      and evidence_reference is not null
      and verified_at is not null
      and refresh_required = false
    )
  );

alter table mms_governance.training_records
  drop constraint if exists training_records_expiry_check;

alter table mms_governance.training_records
  add constraint training_records_expiry_check
  check (
    expires_at is null
    or completed_at is null
    or expires_at > completed_at
  );

create index if not exists training_records_subject_status_idx
  on mms_governance.training_records(subject_id,status,expires_at);

commit;
