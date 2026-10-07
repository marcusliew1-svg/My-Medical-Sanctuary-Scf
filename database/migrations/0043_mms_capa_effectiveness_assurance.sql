-- T6.39 CAPA/remediation implementation and effectiveness assurance.
-- Preview/integration only until separately approved for Production.
-- No CAPA is closed or reclassified by this migration.

begin;

alter table mms_governance.capa_actions
  add column if not exists root_cause_reference text,
  add column if not exists implementation_evidence_reference text,
  add column if not exists effectiveness_result text not null default 'NOT_ASSESSED'
    check (effectiveness_result in ('NOT_ASSESSED','EFFECTIVE','PARTIALLY_EFFECTIVE','INEFFECTIVE')),
  add column if not exists verified_at timestamptz,
  add column if not exists closure_reference text;

alter table mms_governance.capa_actions
  drop constraint if exists capa_actions_implementation_evidence_check,
  drop constraint if exists capa_actions_effectiveness_review_check,
  drop constraint if exists capa_actions_closure_evidence_check;

alter table mms_governance.capa_actions
  add constraint capa_actions_implementation_evidence_check
  check (
    status not in ('IMPLEMENTED','EFFECTIVENESS_REVIEW','CLOSED')
    or (
      root_cause_reference is not null
      and implemented_at is not null
      and implementation_evidence_reference is not null
    )
  ),
  add constraint capa_actions_effectiveness_review_check
  check (
    status not in ('EFFECTIVENESS_REVIEW','CLOSED')
    or (
      effectiveness_evidence is not null
      and verified_by_role is not null
      and verified_at is not null
      and effectiveness_result <> 'NOT_ASSESSED'
    )
  ),
  add constraint capa_actions_closure_evidence_check
  check (
    status <> 'CLOSED'
    or (
      effectiveness_result = 'EFFECTIVE'
      and closure_reference is not null
      and closed_at is not null
    )
  );

create table if not exists mms_governance.capa_effectiveness_reviews (
  id uuid primary key default gen_random_uuid(),
  review_id text not null unique,
  capa_action_id uuid not null references mms_governance.capa_actions(id) on delete restrict,
  review_scope text not null,
  result text not null check (result in ('EFFECTIVE','PARTIALLY_EFFECTIVE','INEFFECTIVE','BLOCKED')),
  evidence_id uuid references mms_governance.evidence_artifacts(id) on delete restrict,
  reviewer_role text not null,
  reviewed_at timestamptz not null,
  follow_up_required boolean not null default false,
  follow_up_reference text,
  limitations text,
  created_at timestamptz not null default now(),
  check (
    result in ('BLOCKED','INEFFECTIVE')
    or evidence_id is not null
  ),
  check (
    follow_up_required = false
    or follow_up_reference is not null
  )
);

create index if not exists capa_effectiveness_reviews_capa_idx
  on mms_governance.capa_effectiveness_reviews(capa_action_id,reviewed_at desc);

drop trigger if exists capa_effectiveness_reviews_immutable on mms_governance.capa_effectiveness_reviews;
create trigger capa_effectiveness_reviews_immutable
  before update or delete on mms_governance.capa_effectiveness_reviews
  for each row execute function mms_governance.reject_immutable_mutation();

alter table mms_governance.capa_effectiveness_reviews enable row level security;
alter table mms_governance.capa_effectiveness_reviews force row level security;
revoke all on table mms_governance.capa_effectiveness_reviews from public, anon, authenticated;

commit;
