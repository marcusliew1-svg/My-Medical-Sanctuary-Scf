-- T6.36 metrics, KPI/KRI and control-performance monitoring.
-- Preview/integration only until separately approved for Production.
-- Governance metadata and measurements only; no KPI target is asserted by this migration.

begin;

create table if not exists mms_governance.metric_definitions (
  id uuid primary key default gen_random_uuid(),
  metric_id text not null unique,
  name text not null,
  domain text not null,
  metric_type text not null check (metric_type in (
    'KPI','KRI','CONTROL_EFFECTIVENESS','SLA','SLO','QUALITY_INDICATOR','COMPLIANCE_INDICATOR','OTHER'
  )),
  owner_role text not null,
  definition text not null,
  calculation_method text not null,
  source_system text not null,
  unit text not null,
  direction text not null check (direction in ('HIGHER_IS_BETTER','LOWER_IS_BETTER','TARGET_RANGE','INFORMATIONAL')),
  frequency text not null,
  green_threshold text,
  amber_threshold text,
  red_threshold text,
  status text not null check (status in ('DRAFT','UNDER_REVIEW','APPROVED','ACTIVE','SUSPENDED','RETIRED')),
  approval_reference text,
  review_due_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    status not in ('APPROVED','ACTIVE')
    or (
      approval_reference is not null
      and calculation_method is not null
      and source_system is not null
      and owner_role is not null
    )
  ),
  check (
    direction = 'INFORMATIONAL'
    or status not in ('APPROVED','ACTIVE')
    or (
      green_threshold is not null
      and amber_threshold is not null
      and red_threshold is not null
    )
  )
);

create table if not exists mms_governance.metric_observations (
  id uuid primary key default gen_random_uuid(),
  observation_id text not null unique,
  metric_definition_id uuid not null references mms_governance.metric_definitions(id) on delete restrict,
  period_start timestamptz,
  period_end timestamptz,
  value_numeric numeric,
  value_text text,
  threshold_state text not null default 'NOT_ASSESSED'
    check (threshold_state in ('NOT_ASSESSED','GREEN','AMBER','RED')),
  source_reference text not null,
  evidence_id uuid references mms_governance.evidence_artifacts(id) on delete restrict,
  captured_by_role text not null,
  captured_at timestamptz not null,
  notes text,
  created_at timestamptz not null default now(),
  check (value_numeric is not null or value_text is not null),
  check (period_start is null or period_end is null or period_end >= period_start),
  check (
    threshold_state = 'NOT_ASSESSED'
    or evidence_id is not null
  )
);

create index if not exists metric_definitions_status_domain_idx
  on mms_governance.metric_definitions(status,domain,metric_type);

create index if not exists metric_observations_metric_period_idx
  on mms_governance.metric_observations(metric_definition_id,period_end desc,captured_at desc);

drop trigger if exists metric_definitions_touch_updated_at on mms_governance.metric_definitions;
create trigger metric_definitions_touch_updated_at
  before update on mms_governance.metric_definitions
  for each row execute function mms_governance.touch_updated_at();

drop trigger if exists metric_observations_immutable on mms_governance.metric_observations;
create trigger metric_observations_immutable
  before update or delete on mms_governance.metric_observations
  for each row execute function mms_governance.reject_immutable_mutation();

alter table mms_governance.metric_definitions enable row level security;
alter table mms_governance.metric_definitions force row level security;
revoke all on table mms_governance.metric_definitions from public, anon, authenticated;

alter table mms_governance.metric_observations enable row level security;
alter table mms_governance.metric_observations force row level security;
revoke all on table mms_governance.metric_observations from public, anon, authenticated;

commit;
