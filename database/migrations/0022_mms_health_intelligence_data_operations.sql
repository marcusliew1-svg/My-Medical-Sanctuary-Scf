-- MMS Health Intelligence Release 2C.1: controlled real-data operations.
-- Generated with Supabase CLI, then aligned to this repository's ordered MMS ledger.
begin;

alter table mms_commercial.price_sources
  add column if not exists organization_provider text,
  add column if not exists access_method text,
  add column if not exists normal_pricing_basis text,
  add column if not exists verification_method text,
  add column if not exists terms_use_notes text,
  add column if not exists geographic_scope text[] not null default '{}',
  add column if not exists medicine_scope text,
  add column if not exists update_frequency text,
  add column if not exists source_status text not null default 'candidate',
  add column if not exists visibility_level text not null default 'internal_only',
  add column if not exists trust_reason text,
  add column if not exists trust_reviewer text,
  add column if not exists trust_reviewed_at timestamptz,
  add column if not exists last_reviewed_at timestamptz,
  add column if not exists next_review_due timestamptz,
  add column if not exists reviewer text,
  add column if not exists private_metadata jsonb not null default '{}'::jsonb;

alter table mms_commercial.price_sources
  drop constraint if exists price_sources_source_type_check;

alter table mms_commercial.price_sources
  add constraint price_sources_source_type_check check (source_type in (
    'government_database','manufacturer','pharmacy','hospital','distributor',
    'reimbursement_database','marketplace','manually_verified','other',
    'formulary','licensed_pharmacy','hospital_clinic','government_regulatory',
    'public_marketplace','manual_quotation','other_verified'
  ));

alter table mms_commercial.price_sources drop constraint if exists price_sources_source_status_check;
alter table mms_commercial.price_sources add constraint price_sources_source_status_check
  check (source_status in ('candidate','under_review','approved','restricted','suspended','retired'));
alter table mms_commercial.price_sources drop constraint if exists price_sources_visibility_level_check;
alter table mms_commercial.price_sources add constraint price_sources_visibility_level_check
  check (visibility_level in ('public_full','public_name_only','public_type_only','internal_only'));

create table if not exists mms_commercial.source_trust_reviews (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references mms_commercial.price_sources(id),
  previous_trust_level text check (previous_trust_level is null or previous_trust_level in ('high','medium','low','unknown')),
  trust_level text not null check (trust_level in ('high','medium','low','unknown')),
  reason text not null,
  reviewer text not null,
  reviewed_at timestamptz not null default now(),
  data_status text not null default 'live' check (data_status in ('demo','live'))
);

create table if not exists mms_commercial.product_creation_candidates (
  id uuid primary key default gen_random_uuid(),
  market_id text not null references mms_commercial.health_intelligence_markets(id),
  original_product_text text not null,
  original_language text not null default 'en',
  normalized_brand text,
  normalized_ingredient text,
  normalized_manufacturer text,
  normalized_strength text,
  normalized_dosage_form text,
  normalized_release_type text,
  normalized_pack text,
  likely_duplicate_product_ids uuid[] not null default '{}',
  review_status text not null default 'candidate' check (review_status in ('candidate','identity_review','approved','rejected','merged')),
  approved_product_id uuid references mms_commercial.medicine_products(id),
  collector text not null,
  reviewer text,
  review_notes text,
  data_status text not null default 'live' check (data_status in ('demo','live')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists mms_commercial.operational_price_observations (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references mms_commercial.price_sources(id),
  market_id text not null references mms_commercial.health_intelligence_markets(id),
  original_observed_product_text text not null,
  original_language text not null default 'en',
  matched_product_id uuid references mms_commercial.medicine_products(id),
  candidate_product_id uuid references mms_commercial.product_creation_candidates(id),
  product_resolution_state text not null default 'unresolved' check (product_resolution_state in ('confirmed_exact','candidate_review','unresolved','rejected')),
  observed_brand text,
  observed_ingredient text,
  observed_manufacturer text,
  observed_strength text,
  observed_dosage_form text,
  observed_release_type text,
  observed_pack text,
  observed_local_price numeric(18,6) not null check (observed_local_price >= 0),
  currency char(3) not null check (currency = upper(currency)),
  pack_quantity numeric(14,4) not null check (pack_quantity > 0),
  comparison_basis text check (comparison_basis in ('retail_cash_price','pharmacy_list_price','hospital_price','manufacturer_list_price','reimbursed_price','wholesale_price','other_verified_basis')),
  basis_status text not null default 'basis_unverified' check (basis_status in ('basis_unverified','basis_verified')),
  availability_status text not null default 'unknown' check (availability_status in ('available','reported_available','out_of_stock','unavailable','unknown')),
  observed_at timestamptz not null,
  source_url_reference text,
  notes text,
  workflow_stage text not null default 'collected' check (workflow_stage in ('collected','identity_review','basis_review','source_review','pending_verification','verified','publication_approved','rejected','needs_reverification','expired')),
  freshness_status text not null default 'fresh' check (freshness_status in ('fresh','review_due','stale','expired')),
  anomaly_flags text[] not null default '{}',
  collector text not null,
  reviewer text,
  publisher text,
  rejection_reason text,
  manual_override_reason text,
  collected_at timestamptz not null default now(),
  verified_at timestamptz,
  publication_approved_at timestamptz,
  review_due_at timestamptz,
  valid_until timestamptz,
  data_class text not null default 'real_unverified' check (data_class in ('demo','real_unverified','real_verified')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((workflow_stage not in ('verified','publication_approved')) or (reviewer is not null and verified_at is not null and data_class='real_verified')),
  check ((workflow_stage <> 'publication_approved') or (publisher is not null and publication_approved_at is not null)),
  check ((product_resolution_state <> 'confirmed_exact') or matched_product_id is not null),
  check ((product_resolution_state <> 'candidate_review') or candidate_product_id is not null)
);

create index if not exists operational_price_observations_queue_idx
  on mms_commercial.operational_price_observations(workflow_stage,review_due_at);
create index if not exists operational_price_observations_history_idx
  on mms_commercial.operational_price_observations(matched_product_id,market_id,comparison_basis,observed_at desc);
create index if not exists operational_price_observations_duplicate_idx
  on mms_commercial.operational_price_observations(source_id,market_id,observed_local_price,pack_quantity,observed_at);

create table if not exists mms_commercial.observation_evidence (
  id uuid primary key default gen_random_uuid(),
  observation_id uuid not null references mms_commercial.operational_price_observations(id),
  evidence_type text not null check (evidence_type in ('source_url','document_reference','captured_text','screenshot_reference','file_reference','quotation_reference','other')),
  reference_value text not null,
  evidence_notes text,
  visibility_level text not null default 'internal_only' check (visibility_level in ('internal_only','reviewer_only','approved_public_reference')),
  captured_by text not null,
  captured_at timestamptz not null default now(),
  data_status text not null default 'live' check (data_status in ('demo','live'))
);

create table if not exists mms_commercial.freshness_policies (
  id uuid primary key default gen_random_uuid(),
  policy_name text not null unique,
  source_id uuid references mms_commercial.price_sources(id),
  market_id text references mms_commercial.health_intelligence_markets(id),
  medicine_category text,
  review_interval_days integer check (review_interval_days is null or review_interval_days in (7,30,60,90)),
  manual_only boolean not null default false,
  variance_threshold_percent numeric(8,3) not null default 35 check (variance_threshold_percent > 0),
  active boolean not null default true,
  created_by text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (manual_only or review_interval_days is not null)
);

create table if not exists mms_commercial.observation_import_batches (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  row_count integer not null check (row_count between 1 and 500),
  import_status text not null default 'dry_run' check (import_status in ('dry_run','validated','confirmed','imported','rejected')),
  validation_summary jsonb not null default '{}'::jsonb,
  submitted_by text not null,
  confirmed_by text,
  created_at timestamptz not null default now(),
  imported_at timestamptz
);

create table if not exists mms_commercial.observation_import_rows (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references mms_commercial.observation_import_batches(id) on delete cascade,
  row_number integer not null check (row_number > 0),
  raw_row jsonb not null,
  normalized_row jsonb,
  validation_errors text[] not null default '{}',
  observation_id uuid references mms_commercial.operational_price_observations(id),
  created_at timestamptz not null default now(),
  unique(batch_id,row_number)
);

create or replace function mms_commercial.reject_health_intelligence_evidence_mutation()
returns trigger language plpgsql security invoker set search_path=mms_commercial,pg_temp as $$
begin raise exception 'health_intelligence_evidence_is_immutable'; end $$;

drop trigger if exists observation_evidence_immutable on mms_commercial.observation_evidence;
create trigger observation_evidence_immutable before update or delete on mms_commercial.observation_evidence
for each row execute function mms_commercial.reject_health_intelligence_evidence_mutation();

alter table mms_commercial.price_observations add column if not exists operational_observation_id uuid references mms_commercial.operational_price_observations(id);

create or replace function mms_commercial.health_intelligence_price_publication_eligibility(requested_id uuid)
returns table(eligible boolean,reasons text[]) language sql stable security invoker set search_path=mms_commercial,pg_temp as $$
  select
    coalesce(cardinality(array_remove(array[
      case when p.record_state <> 'verified' then 'price_not_verified' end,
      case when p.price_verification_status <> 'verified' then 'price_confidence_not_verified' end,
      case when p.verified_at is null or p.reviewer is null then 'verification_evidence_missing' end,
      case when s.id is null or not s.active then 'active_source_missing' end,
      case when s.source_status <> 'approved' then 'source_not_approved' end,
      case when s.trust_level in ('low','unknown') then 'source_trust_insufficient' end,
      case when p.comparison_basis is null then 'comparison_basis_missing' end,
      case when p.observed_at is null then 'observation_date_missing' end,
      case when product.verification_status <> 'verified' then 'product_identity_not_verified' end,
      case when p.data_status <> 'live' then 'demo_data_never_public' end,
      case when p.valid_until is not null and p.valid_until < now() then 'verification_expired' end,
      case when op.id is not null and op.workflow_stage <> 'publication_approved' then 'operational_publication_not_approved' end,
      case when op.id is not null and op.basis_status <> 'basis_verified' then 'operational_basis_not_verified' end,
      case when op.id is not null and op.product_resolution_state <> 'confirmed_exact' then 'operational_product_unresolved' end
    ],null)),0)=0,
    coalesce(array_remove(array[
      case when p.record_state <> 'verified' then 'price_not_verified' end,
      case when p.price_verification_status <> 'verified' then 'price_confidence_not_verified' end,
      case when p.verified_at is null or p.reviewer is null then 'verification_evidence_missing' end,
      case when s.id is null or not s.active then 'active_source_missing' end,
      case when s.source_status <> 'approved' then 'source_not_approved' end,
      case when s.trust_level in ('low','unknown') then 'source_trust_insufficient' end,
      case when p.comparison_basis is null then 'comparison_basis_missing' end,
      case when p.observed_at is null then 'observation_date_missing' end,
      case when product.verification_status <> 'verified' then 'product_identity_not_verified' end,
      case when p.data_status <> 'live' then 'demo_data_never_public' end,
      case when p.valid_until is not null and p.valid_until < now() then 'verification_expired' end,
      case when op.id is not null and op.workflow_stage <> 'publication_approved' then 'operational_publication_not_approved' end,
      case when op.id is not null and op.basis_status <> 'basis_verified' then 'operational_basis_not_verified' end,
      case when op.id is not null and op.product_resolution_state <> 'confirmed_exact' then 'operational_product_unresolved' end
    ],null),array[]::text[])
  from (select requested_id) requested
  left join mms_commercial.price_observations p on p.id=requested.requested_id
  left join mms_commercial.price_sources s on s.id=p.source_id
  left join mms_commercial.medicine_products product on product.id=p.product_id
  left join mms_commercial.operational_price_observations op on op.id=p.operational_observation_id;
$$;

do $$ declare v_table text; begin
  foreach v_table in array array[
    'source_trust_reviews','product_creation_candidates','operational_price_observations',
    'observation_evidence','freshness_policies','observation_import_batches','observation_import_rows'
  ] loop
    execute format('alter table mms_commercial.%I enable row level security',v_table);
    execute format('revoke all on table mms_commercial.%I from public,anon,authenticated',v_table);
  end loop;
end $$;

insert into mms_commercial.schema_migrations(migration_key)
values ('0022_mms_health_intelligence_data_operations.sql') on conflict do nothing;

commit;
