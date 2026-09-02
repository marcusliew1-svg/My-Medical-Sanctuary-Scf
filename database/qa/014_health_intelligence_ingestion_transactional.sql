begin;

do $$ begin
  if not exists (select 1 from mms_commercial.schema_migrations where migration_key='0024_mms_health_intelligence_assisted_ingestion.sql') then
    raise exception '0024 migration ledger entry missing';
  end if;
  if not exists (select 1 from pg_tables where schemaname='mms_commercial' and tablename='source_connectors' and rowsecurity) then
    raise exception 'source_connectors RLS missing';
  end if;
  if has_table_privilege('anon','mms_commercial.source_connectors','select') or
     has_table_privilege('authenticated','mms_commercial.observation_import_rows','select') then
    raise exception 'public ingestion access must be denied';
  end if;
end $$;

insert into mms_commercial.source_connectors(
  source_id,connector_key,connector_type,display_name,market_id,status,
  created_by,approved_by,approved_at,connector_config
)
select id,'qa-connector-0024','csv','QA controlled CSV connector',market_id,'approved',
  'qa','qa',now(),'{}'::jsonb
from mms_commercial.price_sources limit 1;

do $$ begin
  begin
    insert into mms_commercial.source_connectors(
      source_id,connector_key,connector_type,display_name,market_id,status,
      created_by,approved_by,approved_at,connector_config
    )
    select id,'qa-secret-rejection-0024','api','QA secret rejection',market_id,'approved',
      'qa','qa',now(),'{"api_key":"must-not-store"}'::jsonb
    from mms_commercial.price_sources limit 1;
    raise exception 'plaintext credential control failed';
  exception when check_violation then null;
  end;
end $$;

rollback;
