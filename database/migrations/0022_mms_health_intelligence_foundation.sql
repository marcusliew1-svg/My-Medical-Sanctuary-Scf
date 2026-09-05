-- MMS Health Intelligence data foundation.
-- Market/product intelligence only. Never store patient records, diagnoses,
-- prescriptions, uploads or clinical notes in these tables.
-- Additive PostgreSQL 15+ migration. Apply only to the dedicated MMS database.

begin;

create table if not exists mms_commercial.health_intelligence_markets (
  id text primary key,
  country_code char(2) not null unique check (country_code = upper(country_code)),
  country_name text not null unique,
  default_currency char(3) not null check (default_currency = upper(default_currency)),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into mms_commercial.health_intelligence_markets(id,country_code,country_name,default_currency)
values
  ('market-my','MY','Malaysia','MYR'),
  ('market-th','TH','Thailand','THB'),
  ('market-sg','SG','Singapore','SGD'),
  ('market-id','ID','Indonesia','IDR'),
  ('market-au','AU','Australia','AUD'),
  ('market-us','US','United States','USD'),
  ('market-ae','AE','United Arab Emirates','AED')
on conflict (id) do update set
  country_code=excluded.country_code,
  country_name=excluded.country_name,
  default_currency=excluded.default_currency,
  updated_at=now();

create table if not exists mms_commercial.active_ingredients (
  id uuid primary key default gen_random_uuid(),
  canonical_name text not null unique,
  inn_name text,
  ingredient_kind text not null default 'small_molecule' check (ingredient_kind in ('small_molecule','biologic','vaccine','other')),
  data_status text not null default 'collected' check (data_status in ('demo','collected','pending_review','verified','published','rejected','expired','needs_reverification')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists mms_commercial.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  normalized_name text not null,
  data_status text not null default 'collected' check (data_status in ('demo','collected','pending_review','verified','published','rejected','expired','needs_reverification')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(normalized_name)
);

create table if not exists mms_commercial.manufacturers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  normalized_name text not null,
  country_code char(2) check (country_code is null or country_code = upper(country_code)),
  data_status text not null default 'collected' check (data_status in ('demo','collected','pending_review','verified','published','rejected','expired','needs_reverification')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(normalized_name)
);

create table if not exists mms_commercial.dosage_forms (
  id text primary key,
  name text not null unique,
  normalization_unit text check (normalization_unit in ('tablet','capsule','vial','pen','syringe','bottle','ml','unit','none')),
  active boolean not null default true
);

insert into mms_commercial.dosage_forms(id,name,normalization_unit) values
  ('tablet','Tablet','tablet'),('capsule','Capsule','capsule'),('vial','Vial','vial'),
  ('pen','Pen','pen'),('prefilled-syringe','Prefilled syringe','syringe'),
  ('oral-solution','Oral solution','ml'),('bottle','Bottle','bottle'),('other','Other','none')
on conflict (id) do nothing;

create table if not exists mms_commercial.routes_of_administration (
  id text primary key,
  name text not null unique,
  active boolean not null default true
);

insert into mms_commercial.routes_of_administration(id,name) values
  ('oral','Oral'),('intravenous','Intravenous'),('subcutaneous','Subcutaneous'),
  ('intramuscular','Intramuscular'),('topical','Topical'),('inhaled','Inhaled'),('other','Other')
on conflict (id) do nothing;

create table if not exists mms_commercial.release_types (
  id text primary key,
  name text not null unique,
  modified_release boolean not null default false,
  active boolean not null default true
);

insert into mms_commercial.release_types(id,name,modified_release) values
  ('immediate','Immediate release',false),('extended','Extended release',true),
  ('delayed','Delayed release',true),('modified','Modified release',true),('not-applicable','Not applicable',false)
on conflict (id) do nothing;

create table if not exists mms_commercial.medicine_products (
  id uuid primary key default gen_random_uuid(),
  product_code text not null unique,
  generic_name text not null,
  brand_id uuid references mms_commercial.brands(id),
  manufacturer_id uuid references mms_commercial.manufacturers(id),
  dosage_form_id text not null references mms_commercial.dosage_forms(id),
  route_id text not null references mms_commercial.routes_of_administration(id),
  release_type_id text not null references mms_commercial.release_types(id),
  pack_size numeric(14,4) not null check (pack_size > 0),
  units_per_pack numeric(14,4) not null check (units_per_pack > 0),
  device_or_presentation text,
  combination_product boolean not null default false,
  biologic boolean not null default false,
  biosimilar boolean not null default false,
  narrow_therapeutic_index boolean not null default false,
  complex_injectable boolean not null default false,
  special_device boolean not null default false,
  oncology_medicine boolean not null default false,
  special_formulation boolean not null default false,
  active boolean not null default true,
  verification_status text not null default 'collected' check (verification_status in ('collected','pending_review','verified','published','rejected','expired','needs_reverification')),
  publication_status text not null default 'not_eligible' check (publication_status in ('not_eligible','eligible','approved','published','unpublished')),
  data_status text not null default 'collected' check (data_status in ('demo','live')),
  verified_at timestamptz,
  valid_until timestamptz,
  review_due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((verification_status not in ('verified','published')) or verified_at is not null),
  check ((publication_status not in ('approved','published')) or verification_status in ('verified','published'))
);

create table if not exists mms_commercial.medicine_product_ingredients (
  product_id uuid not null references mms_commercial.medicine_products(id) on delete cascade,
  active_ingredient_id uuid not null references mms_commercial.active_ingredients(id),
  strength_value numeric(18,6) not null check (strength_value > 0),
  strength_unit text not null,
  salt_or_ester text,
  clinically_meaningful_variant boolean not null default false,
  sequence_number integer not null default 1 check (sequence_number > 0),
  created_at timestamptz not null default now(),
  primary key(product_id,active_ingredient_id,sequence_number)
);

create table if not exists mms_commercial.price_sources (
  id uuid primary key default gen_random_uuid(),
  source_code text not null unique,
  source_name text not null,
  source_type text not null check (source_type in ('pharmacy','hospital','manufacturer','distributor','government_database','reimbursement_database','marketplace','manually_verified','other')),
  market_id text not null references mms_commercial.health_intelligence_markets(id),
  website_domain text,
  provider_name text,
  source_url text,
  trust_level text not null default 'unknown' check (trust_level in ('high','medium','low','unknown')),
  notes text,
  active boolean not null default true,
  data_status text not null default 'demo' check (data_status in ('demo','live')),
  verification_status text not null default 'collected' check (verification_status in ('collected','pending_review','verified','published','rejected','expired','needs_reverification')),
  verified_at timestamptz,
  valid_until timestamptz,
  review_due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((verification_status not in ('verified','published')) or verified_at is not null)
);

create table if not exists mms_commercial.market_registrations (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references mms_commercial.medicine_products(id),
  market_id text not null references mms_commercial.health_intelligence_markets(id),
  registration_number text,
  regulator text,
  registration_status text not null default 'unknown' check (registration_status in ('verified_registered','reported_registered','not_verified','not_registered','unknown')),
  prescription_classification text,
  approved_presentation text,
  market_availability_status text not null default 'unknown' check (market_availability_status in ('available','reported_available','unavailable','restricted','unknown')),
  access_feasibility_status text not null default 'not_assessed' check (access_feasibility_status in ('not_assessed','review_required','potentially_accessible','restricted','not_accessible','unknown')),
  source_id uuid references mms_commercial.price_sources(id),
  last_checked_at timestamptz,
  verification_status text not null default 'collected' check (verification_status in ('collected','pending_review','verified','published','rejected','expired','needs_reverification')),
  publication_status text not null default 'not_eligible' check (publication_status in ('not_eligible','eligible','approved','published','unpublished')),
  verified_at timestamptz,
  valid_until timestamptz,
  review_due_at timestamptz,
  price_opportunity_score numeric(8,4),
  demand_score numeric(8,4),
  execution_score numeric(8,4),
  mms_opportunity_score numeric(8,4),
  market_notes text,
  sourcing_notes text,
  supplier_notes text,
  data_status text not null default 'demo' check (data_status in ('demo','live')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(product_id,market_id),
  check ((verification_status not in ('verified','published')) or verified_at is not null),
  check ((publication_status not in ('approved','published')) or verification_status in ('verified','published'))
);

create table if not exists mms_commercial.price_observations (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references mms_commercial.medicine_products(id),
  market_id text not null references mms_commercial.health_intelligence_markets(id),
  source_id uuid not null references mms_commercial.price_sources(id),
  observed_local_price numeric(18,6) not null check (observed_local_price >= 0),
  currency char(3) not null check (currency = upper(currency)),
  pack_quantity numeric(14,4) not null check (pack_quantity > 0),
  comparison_basis text not null check (comparison_basis in ('retail_cash_price','pharmacy_list_price','hospital_price','manufacturer_list_price','reimbursed_price','wholesale_price','other_verified_basis')),
  normalization_unit text check (normalization_unit in ('tablet','capsule','vial','pen','syringe','bottle','ml','unit','none')),
  normalized_quantity numeric(18,6) check (normalized_quantity is null or normalized_quantity > 0),
  observed_at timestamptz not null,
  source_date timestamptz,
  price_notes text,
  availability_status text not null default 'unknown' check (availability_status in ('available','reported_available','out_of_stock','unavailable','unknown')),
  price_verification_status text not null default 'unverified' check (price_verification_status in ('verified','reported','indicative','unverified','expired')),
  record_state text not null default 'collected' check (record_state in ('collected','pending_review','verified','published','rejected','expired','needs_reverification')),
  publication_status text not null default 'not_eligible' check (publication_status in ('not_eligible','eligible','approved','published','unpublished')),
  reviewer text,
  verified_at timestamptz,
  valid_until timestamptz,
  review_due_at timestamptz,
  data_status text not null default 'demo' check (data_status in ('demo','live')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((record_state not in ('verified','published')) or (verified_at is not null and reviewer is not null and price_verification_status = 'verified')),
  check ((publication_status not in ('approved','published')) or record_state in ('verified','published'))
);

create index if not exists price_observations_history_idx on mms_commercial.price_observations(product_id,market_id,observed_at desc);
create index if not exists price_observations_review_idx on mms_commercial.price_observations(record_state,review_due_at);

create table if not exists mms_commercial.fx_rates (
  id uuid primary key default gen_random_uuid(),
  base_currency char(3) not null check (base_currency = upper(base_currency)),
  quote_currency char(3) not null check (quote_currency = upper(quote_currency)),
  rate numeric(24,12) not null check (rate > 0),
  effective_at timestamptz not null,
  source_id uuid references mms_commercial.price_sources(id),
  source_name text not null,
  quality_status text not null default 'unknown' check (quality_status in ('verified','reported','indicative','unknown')),
  data_status text not null default 'demo' check (data_status in ('demo','live')),
  created_at timestamptz not null default now(),
  unique(base_currency,quote_currency,effective_at,source_name),
  check (base_currency <> quote_currency)
);

create table if not exists mms_commercial.generic_relationships (
  id uuid primary key default gen_random_uuid(),
  source_product_id uuid not null references mms_commercial.medicine_products(id),
  candidate_product_id uuid not null references mms_commercial.medicine_products(id),
  relationship_type text not null check (relationship_type in ('potential_generic_match','verified_generic_relationship','possible_equivalent_review_required','not_suitable_for_automatic_comparison')),
  match_confidence text not null default 'possible' check (match_confidence in ('exact_verified','close_verified','possible','not_comparable','review_required')),
  confidence_score numeric(5,2) check (confidence_score is null or (confidence_score >= 0 and confidence_score <= 100)),
  evidence_source_id uuid references mms_commercial.price_sources(id),
  evidence_notes text,
  verification_status text not null default 'collected' check (verification_status in ('collected','pending_review','verified','published','rejected','expired','needs_reverification')),
  publication_status text not null default 'not_eligible' check (publication_status in ('not_eligible','eligible','approved','published','unpublished')),
  reviewer text,
  review_notes text,
  verified_at timestamptz,
  valid_until timestamptz,
  review_due_at timestamptz,
  data_status text not null default 'demo' check (data_status in ('demo','live')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(source_product_id,candidate_product_id,relationship_type),
  check (source_product_id <> candidate_product_id),
  check ((verification_status not in ('verified','published')) or (verified_at is not null and reviewer is not null)),
  check ((publication_status not in ('approved','published')) or verification_status in ('verified','published'))
);

create table if not exists mms_commercial.match_reviews (
  id uuid primary key default gen_random_uuid(),
  source_product_id uuid not null references mms_commercial.medicine_products(id),
  candidate_product_id uuid not null references mms_commercial.medicine_products(id),
  classification text not null check (classification in ('exact_match','close_equivalent','not_comparable','review_required_due_to_exception')),
  match_confidence text not null check (match_confidence in ('exact_verified','close_verified','possible','not_comparable','review_required')),
  score numeric(5,2) not null check (score >= 0 and score <= 100),
  rule_version text not null,
  explanation jsonb not null default '{}'::jsonb,
  hard_exception_codes text[] not null default '{}',
  verification_status text not null default 'pending_review' check (verification_status in ('collected','pending_review','verified','published','rejected','expired','needs_reverification')),
  reviewer text,
  verified_at timestamptz,
  data_status text not null default 'demo' check (data_status in ('demo','live')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (source_product_id <> candidate_product_id),
  check ((verification_status not in ('verified','published')) or (verified_at is not null and reviewer is not null))
);

create table if not exists mms_commercial.regulatory_notes (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references mms_commercial.medicine_products(id),
  market_id text references mms_commercial.health_intelligence_markets(id),
  source_id uuid references mms_commercial.price_sources(id),
  note_type text not null check (note_type in ('registration','classification','access','import','safety','other')),
  note text not null,
  verification_status text not null default 'collected' check (verification_status in ('collected','pending_review','verified','published','rejected','expired','needs_reverification')),
  reviewer text,
  verified_at timestamptz,
  valid_until timestamptz,
  data_status text not null default 'demo' check (data_status in ('demo','live')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists mms_commercial.verification_events (
  id uuid primary key default gen_random_uuid(),
  target_type text not null,
  target_id uuid not null,
  reviewer text not null,
  decision text not null check (decision in ('submit_for_review','verify','reject','publish','unpublish','mark_stale','reverify')),
  reason_notes text,
  previous_state text,
  new_state text not null,
  occurred_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  data_status text not null default 'demo' check (data_status in ('demo','live'))
);

create table if not exists mms_commercial.health_intelligence_audit_events (
  id bigserial primary key,
  actor text not null,
  action text not null check (action in ('create','update','verify','reject','publish','unpublish','mark_stale','relationship_change')),
  target_type text not null,
  target_id text not null,
  occurred_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  data_status text not null default 'demo' check (data_status in ('demo','live'))
);

create table if not exists mms_commercial.medicine_search_events (
  id uuid primary key default gen_random_uuid(), query_text text not null, product_id uuid references mms_commercial.medicine_products(id),
  country_code char(2), session_reference_hash text, result_status text, occurred_at timestamptz not null default now()
);
create table if not exists mms_commercial.generic_search_events (
  id uuid primary key default gen_random_uuid(), query_text text not null, product_id uuid references mms_commercial.medicine_products(id),
  country_code char(2), session_reference_hash text, result_status text, occurred_at timestamptz not null default now()
);
create table if not exists mms_commercial.cost_review_events (
  id uuid primary key default gen_random_uuid(), product_id uuid references mms_commercial.medicine_products(id),
  country_code char(2), session_reference_hash text, result_status text, converted_enquiry boolean not null default false,
  occurred_at timestamptz not null default now()
);

create or replace function mms_commercial.health_intelligence_price_publication_eligibility(p_observation_id uuid)
returns table(eligible boolean, reasons text[])
language sql
security invoker
set search_path = mms_commercial, pg_temp
as $$
  select
    cardinality(array_remove(array[
      case when p.id is null then 'observation_not_found' end,
      case when p.record_state <> 'verified' then 'price_not_verified' end,
      case when p.price_verification_status <> 'verified' then 'price_confidence_not_verified' end,
      case when p.verified_at is null or p.reviewer is null then 'verification_evidence_missing' end,
      case when p.source_id is null or s.id is null or not s.active then 'active_source_missing' end,
      case when p.comparison_basis is null then 'comparison_basis_missing' end,
      case when p.observed_at is null then 'observation_date_missing' end,
      case when product.verification_status not in ('verified','published') then 'product_identity_not_verified' end,
      case when p.data_status = 'demo' then 'demo_data_never_public' end,
      case when p.valid_until is not null and p.valid_until < now() then 'verification_expired' end
    ], null)) = 0,
    array_remove(array[
      case when p.id is null then 'observation_not_found' end,
      case when p.record_state <> 'verified' then 'price_not_verified' end,
      case when p.price_verification_status <> 'verified' then 'price_confidence_not_verified' end,
      case when p.verified_at is null or p.reviewer is null then 'verification_evidence_missing' end,
      case when p.source_id is null or s.id is null or not s.active then 'active_source_missing' end,
      case when p.comparison_basis is null then 'comparison_basis_missing' end,
      case when p.observed_at is null then 'observation_date_missing' end,
      case when product.verification_status not in ('verified','published') then 'product_identity_not_verified' end,
      case when p.data_status = 'demo' then 'demo_data_never_public' end,
      case when p.valid_until is not null and p.valid_until < now() then 'verification_expired' end
    ], null)
  from (select p_observation_id as requested_id) requested
  left join mms_commercial.price_observations p on p.id=requested.requested_id
  left join mms_commercial.price_sources s on s.id=p.source_id
  left join mms_commercial.medicine_products product on product.id=p.product_id;
$$;

revoke all on function mms_commercial.health_intelligence_price_publication_eligibility(uuid) from public, anon, authenticated;

create or replace function mms_commercial.protect_price_observation_evidence()
returns trigger language plpgsql security invoker set search_path=mms_commercial,pg_temp as $$
begin
  if old.product_id is distinct from new.product_id
     or old.market_id is distinct from new.market_id
     or old.source_id is distinct from new.source_id
     or old.observed_local_price is distinct from new.observed_local_price
     or old.currency is distinct from new.currency
     or old.pack_quantity is distinct from new.pack_quantity
     or old.comparison_basis is distinct from new.comparison_basis
     or old.normalization_unit is distinct from new.normalization_unit
     or old.normalized_quantity is distinct from new.normalized_quantity
     or old.observed_at is distinct from new.observed_at
     or old.source_date is distinct from new.source_date
     or old.data_status is distinct from new.data_status then
    raise exception using errcode='55000', message='price_observation_evidence_is_immutable';
  end if;
  return new;
end;
$$;

create or replace function mms_commercial.reject_health_intelligence_history_mutation()
returns trigger language plpgsql security invoker set search_path=mms_commercial,pg_temp as $$
begin raise exception using errcode='55000', message='health_intelligence_history_is_immutable'; end;
$$;

create trigger price_observations_evidence_immutable before update on mms_commercial.price_observations for each row execute function mms_commercial.protect_price_observation_evidence();
create trigger price_observations_delete_forbidden before delete on mms_commercial.price_observations for each row execute function mms_commercial.reject_health_intelligence_history_mutation();
create trigger fx_rates_immutable before update or delete on mms_commercial.fx_rates for each row execute function mms_commercial.reject_health_intelligence_history_mutation();
create trigger verification_events_immutable before update or delete on mms_commercial.verification_events for each row execute function mms_commercial.reject_health_intelligence_history_mutation();
create trigger health_intelligence_audit_events_immutable before update or delete on mms_commercial.health_intelligence_audit_events for each row execute function mms_commercial.reject_health_intelligence_history_mutation();

do $$ declare v_table text; begin
  foreach v_table in array array[
    'health_intelligence_markets','active_ingredients','brands','manufacturers','dosage_forms',
    'routes_of_administration','release_types','medicine_products','medicine_product_ingredients',
    'price_sources','market_registrations','price_observations','fx_rates','generic_relationships',
    'match_reviews','regulatory_notes','verification_events','health_intelligence_audit_events',
    'medicine_search_events','generic_search_events','cost_review_events'
  ] loop
    execute format('alter table mms_commercial.%I enable row level security',v_table);
    execute format('revoke all on table mms_commercial.%I from public, anon, authenticated',v_table);
  end loop;
end $$;

insert into mms_commercial.schema_migrations(migration_key,notes)
values('0022_mms_health_intelligence_foundation.sql','Normalized product identity, market/source provenance, immutable price/FX history, deterministic review records, publication eligibility and audit controls.')
on conflict(migration_key) do nothing;

commit;
