-- Run after migration 0022. The application role is a trusted server-only role;
-- collector/reviewer/publisher authorization is enforced by the internal API.
begin;

grant select,insert,update on table
  mms_commercial.price_sources,
  mms_commercial.product_creation_candidates,
  mms_commercial.operational_price_observations,
  mms_commercial.freshness_policies,
  mms_commercial.observation_import_batches,
  mms_commercial.observation_import_rows
to mms_commercial_app;

grant select,insert on table
  mms_commercial.source_trust_reviews,
  mms_commercial.observation_evidence
to mms_commercial_app;

grant execute on function mms_commercial.health_intelligence_price_publication_eligibility(uuid) to mms_commercial_app;

do $$ declare v_table text; begin
  foreach v_table in array array[
    'source_trust_reviews','product_creation_candidates','operational_price_observations',
    'observation_evidence','freshness_policies','observation_import_batches','observation_import_rows'
  ] loop
    execute format('drop policy if exists mms_commercial_app_runtime on mms_commercial.%I',v_table);
    execute format('create policy mms_commercial_app_runtime on mms_commercial.%I for all to mms_commercial_app using (true) with check (true)',v_table);
  end loop;
end $$;

commit;

