-- T6.34 policy exceptions, waivers and risk acceptance governance.
-- Preview/integration only until separately approved for Production.
-- Governance metadata only; no exception or risk acceptance is asserted by this migration.

begin;

create table if not exists mms_governance.policy_exceptions (
  id uuid primary key default gen_random_uuid(),
  exception_id text not null unique,
  exception_type text not null check (exception_type in (
    'POLICY_EXCEPTION',
    'CONTROL_WAIVER',
    'RISK_ACCEPTANCE',
    'TEMPORARY_DEVIATION',
    'EMERGENCY_EXCEPTION',
    'OTHER'
  )),
  domain text not null,
  subject_reference text not null,
  rationale text not null,
  owner_role text not null,
  status text not null check (status in (
    'DRAFT',
    'UNDER_REVIEW',
    'APPROVED',
    'APPROVED_WITH_CONDITIONS',
    'REJECTED',
    'EXPIRED',
    'REVOKED',
    'CLOSED'
  )),
  risk_rating text not null check (risk_rating in ('LOW','MODERATE','HIGH','CRITICAL')),
  compensating_controls text,
  approval_reference text,
  approver_role text,
  effective_at timestamptz,
  expires_at timestamptz,
  review_due_at timestamptz,
  evidence_reference text,
  closure_reference text,
  closed_at timestamptz,
  conditions jsonb not null default '[]'::jsonb,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    status not in ('APPROVED','APPROVED_WITH_CONDITIONS')
    or (
      approval_reference is not null
      and approver_role is not null
      and effective_at is not null
      and expires_at is not null
      and evidence_reference is not null
    )
  ),
  check (
    status not in ('APPROVED','APPROVED_WITH_CONDITIONS')
    or risk_rating not in ('HIGH','CRITICAL')
    or compensating_controls is not null
  ),
  check (
    expires_at is null
    or effective_at is null
    or expires_at > effective_at
  ),
  check (
    status <> 'CLOSED'
    or (closure_reference is not null and closed_at is not null)
  )
);

create index if not exists policy_exceptions_status_expiry_idx
  on mms_governance.policy_exceptions(status,expires_at);

create index if not exists policy_exceptions_domain_risk_idx
  on mms_governance.policy_exceptions(domain,risk_rating);

drop trigger if exists policy_exceptions_touch_updated_at on mms_governance.policy_exceptions;
create trigger policy_exceptions_touch_updated_at
  before update on mms_governance.policy_exceptions
  for each row execute function mms_governance.touch_updated_at();

alter table mms_governance.policy_exceptions enable row level security;
alter table mms_governance.policy_exceptions force row level security;
revoke all on table mms_governance.policy_exceptions from public, anon, authenticated;

commit;
