begin;

alter table mms_commercial.price_sources
  add column if not exists approved_collection_methods text[] not null default array['manual']::text[],
  add column if not exists collection_restrictions text,
  add column if not exists connector_activation_status text not null default 'inactive'
    check (connector_activation_status in ('inactive','approved','suspended','retired'));

create table if not exists mms_commercial.source_connectors (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references mms_commercial.price_sources(id),
  connector_key text not null unique,
  connector_type text not null check (connector_type in ('manual','csv','api','structured_file','assisted_extraction','other_approved')),
  display_name text not null,
  market_id text not null references mms_commercial.health_intelligence_markets(id),
  status text not null default 'inactive' check (status in ('inactive','approved','suspended','retired')),
  authentication_type text not null default 'none' check (authentication_type in ('none','api_key','bearer','basic','oauth2','other_server_side')),
  environment_secret_names text[] not null default '{}',
  request_rate_per_minute integer not null default 10 check (request_rate_per_minute between 1 and 120),
  request_timeout_ms integer not null default 10000 check (request_timeout_ms between 1000 and 60000),
  retry_limit integer not null default 2 check (retry_limit between 0 and 5),
  failure_limit integer not null default 3 check (failure_limit between 1 and 10),
  backoff_ms integer not null default 1000 check (backoff_ms between 100 and 60000),
  schedule_mode text not null default 'manual' check (schedule_mode in ('manual','daily','weekly','monthly')),
  connector_config jsonb not null default '{}'::jsonb,
  restrictions text,
  created_by text not null,
  approved_by text,
  approved_at timestamptz,
  last_run_at timestamptz,
  consecutive_failures integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (not (connector_config ?| array['api_key','token','secret','password','authorization','credential'])),
  check ((status <> 'approved') or (approved_by is not null and approved_at is not null))
);

alter table mms_commercial.observation_import_batches
  alter column filename drop not null,
  alter column row_count set default 0;

alter table mms_commercial.observation_import_batches
  drop constraint if exists observation_import_batches_row_count_check,
  drop constraint if exists observation_import_batches_import_status_check;

alter table mms_commercial.observation_import_batches
  add column if not exists source_id uuid references mms_commercial.price_sources(id),
  add column if not exists connector_id uuid references mms_commercial.source_connectors(id),
  add column if not exists connector_type text check (connector_type in ('manual','csv','api','structured_file','assisted_extraction','other_approved')),
  add column if not exists market_id text references mms_commercial.health_intelligence_markets(id),
  add column if not exists started_at timestamptz,
  add column if not exists completed_at timestamptz,
  add column if not exists initiated_by text,
  add column if not exists total_items integer not null default 0 check (total_items between 0 and 5000),
  add column if not exists accepted_count integer not null default 0 check (accepted_count >= 0),
  add column if not exists rejected_count integer not null default 0 check (rejected_count >= 0),
  add column if not exists unresolved_count integer not null default 0 check (unresolved_count >= 0),
  add column if not exists warning_count integer not null default 0 check (warning_count >= 0),
  add column if not exists failure_count integer not null default 0 check (failure_count >= 0),
  add column if not exists source_file_reference text,
  add column if not exists batch_fingerprint text,
  add column if not exists idempotency_key text,
  add column if not exists field_mapping jsonb not null default '{}'::jsonb,
  add column if not exists confirmation_status text not null default 'not_confirmed'
    check (confirmation_status in ('not_confirmed','confirmed','cancelled')),
  add column if not exists confirmed_at timestamptz,
  add column if not exists data_class text not null default 'real_unverified'
    check (data_class in ('demo','real_unverified'));

alter table mms_commercial.observation_import_batches
  add constraint observation_import_batches_row_count_check check (row_count between 0 and 5000),
  add constraint observation_import_batches_import_status_check check (import_status in (
    'dry_run','validated','confirmed','imported','rejected',
    'created','validating','ready','importing','completed','completed_with_errors','failed','cancelled'
  ));

create unique index if not exists observation_import_batches_idempotency_idx
  on mms_commercial.observation_import_batches(source_id,idempotency_key)
  where idempotency_key is not null;

alter table mms_commercial.observation_import_rows
  add column if not exists source_item_identifier text,
  add column if not exists original_source_value text,
  add column if not exists original_language text,
  add column if not exists normalization_result jsonb not null default '{}'::jsonb,
  add column if not exists parsing_confidence jsonb not null default '{}'::jsonb,
  add column if not exists product_resolution_result jsonb not null default '{}'::jsonb,
  add column if not exists row_status text not null default 'pending'
    check (row_status in ('pending','valid','warning','unresolved','rejected','imported')),
  add column if not exists row_warnings text[] not null default '{}',
  add column if not exists row_errors text[] not null default '{}',
  add column if not exists row_fingerprint text,
  add column if not exists imported_at timestamptz;

create unique index if not exists observation_import_rows_source_item_idx
  on mms_commercial.observation_import_rows(batch_id,source_item_identifier)
  where source_item_identifier is not null;

alter table mms_commercial.operational_price_observations
  add column if not exists ingestion_batch_id uuid references mms_commercial.observation_import_batches(id),
  add column if not exists ingestion_row_id uuid references mms_commercial.observation_import_rows(id),
  add column if not exists external_item_id text,
  add column if not exists observation_signature text;

create index if not exists operational_price_observations_ingestion_idx
  on mms_commercial.operational_price_observations(ingestion_batch_id,ingestion_row_id);
create unique index if not exists operational_price_observations_signature_idx
  on mms_commercial.operational_price_observations(source_id,observation_signature)
  where observation_signature is not null;

create or replace function mms_commercial.reject_import_lineage_mutation()
returns trigger language plpgsql security invoker set search_path=mms_commercial,pg_temp as $$
begin
  if old.observation_id is not null and (
    old.raw_row is distinct from new.raw_row or
    old.original_source_value is distinct from new.original_source_value or
    old.original_language is distinct from new.original_language or
    old.normalization_result is distinct from new.normalization_result or
    old.source_item_identifier is distinct from new.source_item_identifier
  ) then raise exception 'health_intelligence_import_lineage_is_immutable'; end if;
  return new;
end $$;

drop trigger if exists observation_import_rows_lineage_immutable on mms_commercial.observation_import_rows;
create trigger observation_import_rows_lineage_immutable
before update on mms_commercial.observation_import_rows
for each row execute function mms_commercial.reject_import_lineage_mutation();

do $$ declare v_table text; begin
  foreach v_table in array array['source_connectors'] loop
    execute format('alter table mms_commercial.%I enable row level security',v_table);
    execute format('revoke all on table mms_commercial.%I from public,anon,authenticated',v_table);
  end loop;
end $$;

insert into mms_commercial.schema_migrations(migration_key,notes)
values ('0024_mms_health_intelligence_assisted_ingestion.sql','Controlled connectors, traceable batches, row lineage, idempotency and assisted ingestion controls.')
on conflict do nothing;

commit;
