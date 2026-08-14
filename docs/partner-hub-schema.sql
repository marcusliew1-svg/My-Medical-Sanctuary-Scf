-- MMS Partner Hub reference schema (PostgreSQL-style)
-- Reference only: deploy through an approved migration system after infrastructure selection.

create table if not exists mms_partners (
  id text primary key,
  partner_code text unique,
  name text not null,
  status text not null check (status in ('pending','certified','suspended')),
  certification_status text not null check (certification_status in ('not_started','in_progress','passed','expired')),
  tier text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists mms_partner_leads (
  id text primary key,
  owner_partner_id text not null references mms_partners(id),
  full_name text not null,
  mobile text not null,
  normalized_mobile text not null,
  email text,
  normalized_email text,
  source text,
  package_interest text,
  stage text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists uq_mms_active_lead_mobile
  on mms_partner_leads(normalized_mobile) where active = true;
create unique index if not exists uq_mms_active_lead_email
  on mms_partner_leads(normalized_email) where active = true and normalized_email is not null;

create table if not exists mms_lead_ownership_events (
  id text primary key,
  lead_id text not null references mms_partner_leads(id),
  from_partner_id text references mms_partners(id),
  to_partner_id text not null references mms_partners(id),
  event text not null check (event in ('granted','transferred','released')),
  reason text not null,
  approved_by text,
  created_at timestamptz not null default now()
);

create table if not exists mms_membership_applications (
  id text primary key,
  lead_id text not null references mms_partner_leads(id),
  partner_id text not null references mms_partners(id),
  package_name text not null check (package_name in ('Ascend','Evolve','Eterna','Pinnacle')),
  status text not null,
  payment_reference text,
  payment_verified_at timestamptz,
  cancelled_at timestamptz,
  refunded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists mms_commission_ledger (
  id text primary key,
  application_id text not null references mms_membership_applications(id),
  partner_id text not null references mms_partners(id),
  rule_version text not null,
  kind text not null check (kind in ('accrual','approval','payout','reversal','recovery')),
  amount_minor bigint not null,
  currency text not null check (currency = 'MYR'),
  note text not null,
  created_at timestamptz not null default now()
);

-- Ledger rows are append-only. Do not grant UPDATE/DELETE to application roles.
-- Cancellation/refund workflow must append reversal/recovery entries rather than edit prior rows.
-- Active-lead unique indexes provide the final database-level duplicate guard.
