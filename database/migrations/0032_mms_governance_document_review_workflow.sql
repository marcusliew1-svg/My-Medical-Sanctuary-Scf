-- T6.19 controlled governance-document ownership and review evidence.
-- Preview-first. Adds accountable identities/evidence without assigning or fabricating people.

begin;

alter table mms_governance.governance_documents
  add column if not exists owner_id text,
  add column if not exists reviewer_id text,
  add column if not exists approver_id text,
  add column if not exists approval_reference text,
  add column if not exists review_requested_at timestamptz,
  add column if not exists approved_at timestamptz,
  add column if not exists retired_at timestamptz;

alter table mms_governance.governance_documents
  drop constraint if exists governance_documents_review_identity_check,
  add constraint governance_documents_review_identity_check
  check (
    status not in ('REVIEW','APPROVED','EFFECTIVE')
    or (owner_id is not null and btrim(owner_id) <> '' and reviewer_id is not null and btrim(reviewer_id) <> '')
  );

alter table mms_governance.governance_documents
  drop constraint if exists governance_documents_approval_evidence_check,
  add constraint governance_documents_approval_evidence_check
  check (
    status not in ('APPROVED','EFFECTIVE')
    or (
      approver_id is not null and btrim(approver_id) <> ''
      and approver_role is not null and btrim(approver_role) <> ''
      and approval_reference is not null and btrim(approval_reference) <> ''
      and approved_at is not null
    )
  );

alter table mms_governance.governance_documents
  drop constraint if exists governance_documents_effective_evidence_check,
  add constraint governance_documents_effective_evidence_check
  check (status <> 'EFFECTIVE' or effective_at is not null);

create index if not exists governance_documents_owner_status_idx
  on mms_governance.governance_documents(owner_id,status);

create index if not exists governance_documents_reviewer_status_idx
  on mms_governance.governance_documents(reviewer_id,status);

commit;
