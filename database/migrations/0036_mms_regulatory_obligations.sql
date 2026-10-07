-- T6.32 regulatory obligations, compliance calendar and evidence tracking.
-- Preview/integration only until separately approved for Production.
-- Governance metadata only; no statutory obligation is asserted by this migration.

begin;

create table if not exists mms_governance.regulatory_obligations (
  id uuid primary key default gen_random_uuid(),
  obligation_id text not null unique,
  jurisdiction text not null,
  authority_name text not null,
  domain text not null,
  obligation_type text not null check (obligation_type in (
    'LICENCE',
    'REGISTRATION',
    'FILING',
    'REPORTING',
    'NOTIFICATION',
    'RENEWAL',
    'ATTESTATION',
    'RECORDKEEPING',
    'INSPECTION',
    'OTHER'
  )),
  title text not null,
  description text not null,
  source_reference text not null,
  owner_role text not null,
  status text not null check (status in (
    'DRAFT',
    'UNDER_REVIEW',
    'ACTIVE',
    'NOT_APPLICABLE',
    'SUSPENDED',
    'RETIRED'
  )),
  recurrence text not null default 'EVENT_DRIVEN' check (recurrence in (
    'EVENT_DRIVEN',
    'ONE_TIME',
    'MONTHLY',
    'QUARTERLY',
    'SEMI_ANNUAL',
    'ANNUAL',
    'CUSTOM'
  )),
  due_at timestamptz,
  review_due_at timestamptz,
  completion_reference text,
  completed_at timestamptz,
  approval_reference text,
  applicability_rationale text,
  escalation_state text not null default 'NONE' check (escalation_state in (
    'NONE',
    'DUE_SOON',
    'OVERDUE',
    'BLOCKED',
    'ESCALATED'
  )),
  restrictions jsonb not null default '[]'::jsonb,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    status <> 'ACTIVE'
    or (
      source_reference is not null
      and owner_role is not null
      and approval_reference is not null
      and applicability_rationale is not null
    )
  ),
  check (
    completed_at is null
    or completion_reference is not null
  ),
  check (
    status <> 'NOT_APPLICABLE'
    or applicability_rationale is not null
  )
);

create index if not exists regulatory_obligations_status_due_idx
  on mms_governance.regulatory_obligations(status,due_at);

create index if not exists regulatory_obligations_authority_domain_idx
  on mms_governance.regulatory_obligations(authority_name,domain);

drop trigger if exists regulatory_obligations_touch_updated_at on mms_governance.regulatory_obligations;
create trigger regulatory_obligations_touch_updated_at
  before update on mms_governance.regulatory_obligations
  for each row execute function mms_governance.touch_updated_at();

alter table mms_governance.regulatory_obligations enable row level security;
alter table mms_governance.regulatory_obligations force row level security;
revoke all on table mms_governance.regulatory_obligations from public, anon, authenticated;

commit;
