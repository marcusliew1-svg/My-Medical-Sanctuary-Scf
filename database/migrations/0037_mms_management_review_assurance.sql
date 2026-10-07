-- T6.33 management review, governance reporting and executive assurance.
-- Preview/integration only until separately approved for Production.
-- Governance metadata only; no management conclusion or approval is asserted by this migration.

begin;

create table if not exists mms_governance.management_reviews (
  id uuid primary key default gen_random_uuid(),
  review_id text not null unique,
  review_type text not null check (review_type in (
    'MONTHLY_GOVERNANCE',
    'QUARTERLY_MANAGEMENT',
    'ANNUAL_MANAGEMENT',
    'EXTRAORDINARY',
    'PRE_LAUNCH',
    'POST_INCIDENT',
    'OTHER'
  )),
  period_start date,
  period_end date,
  chair_role text,
  recorder_role text,
  status text not null check (status in (
    'PLANNED',
    'IN_PREPARATION',
    'IN_REVIEW',
    'ACTIONS_OPEN',
    'COMPLETE',
    'CANCELLED'
  )),
  agenda_reference text,
  evidence_pack_reference text,
  minutes_reference text,
  decision_reference text,
  action_register_reference text,
  overall_assurance text not null default 'NOT_ASSESSED'
    check (overall_assurance in ('NOT_ASSESSED','ADEQUATE','ADEQUATE_WITH_CONDITIONS','INADEQUATE')),
  unresolved_critical_items integer not null default 0 check (unresolved_critical_items >= 0),
  unresolved_major_items integer not null default 0 check (unresolved_major_items >= 0),
  reviewed_at timestamptz,
  completed_at timestamptz,
  approval_reference text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    period_start is null
    or period_end is null
    or period_end >= period_start
  ),
  check (
    status <> 'COMPLETE'
    or (
      evidence_pack_reference is not null
      and minutes_reference is not null
      and action_register_reference is not null
      and overall_assurance <> 'NOT_ASSESSED'
      and completed_at is not null
      and approval_reference is not null
    )
  )
);

create index if not exists management_reviews_status_period_idx
  on mms_governance.management_reviews(status,period_end desc);

drop trigger if exists management_reviews_touch_updated_at on mms_governance.management_reviews;
create trigger management_reviews_touch_updated_at
  before update on mms_governance.management_reviews
  for each row execute function mms_governance.touch_updated_at();

alter table mms_governance.management_reviews enable row level security;
alter table mms_governance.management_reviews force row level security;
revoke all on table mms_governance.management_reviews from public, anon, authenticated;

commit;
