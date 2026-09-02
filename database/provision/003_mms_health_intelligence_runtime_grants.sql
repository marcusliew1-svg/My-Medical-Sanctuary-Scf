-- Run after migration 0022. Grants only the dedicated MMS server role access.
begin;
grant select on all tables in schema mms_commercial to mms_commercial_app;
grant insert,update on table
  mms_commercial.health_intelligence_markets,mms_commercial.active_ingredients,
  mms_commercial.brands,mms_commercial.manufacturers,mms_commercial.dosage_forms,
  mms_commercial.routes_of_administration,mms_commercial.release_types,
  mms_commercial.medicine_products,mms_commercial.medicine_product_ingredients,
  mms_commercial.price_sources,mms_commercial.market_registrations,
  mms_commercial.price_observations,
  mms_commercial.generic_relationships,mms_commercial.match_reviews,
  mms_commercial.regulatory_notes
to mms_commercial_app;
grant insert on table
  mms_commercial.fx_rates,
  mms_commercial.verification_events,mms_commercial.health_intelligence_audit_events,
  mms_commercial.medicine_search_events,mms_commercial.generic_search_events,
  mms_commercial.cost_review_events
to mms_commercial_app;
grant usage,select on sequence mms_commercial.health_intelligence_audit_events_id_seq to mms_commercial_app;
grant execute on function mms_commercial.health_intelligence_price_publication_eligibility(uuid) to mms_commercial_app;

do $$ declare v_table text; begin
  foreach v_table in array array[
    'health_intelligence_markets','active_ingredients','brands','manufacturers','dosage_forms',
    'routes_of_administration','release_types','medicine_products','medicine_product_ingredients',
    'price_sources','market_registrations','price_observations','fx_rates','generic_relationships',
    'match_reviews','regulatory_notes','verification_events','health_intelligence_audit_events',
    'medicine_search_events','generic_search_events','cost_review_events'
  ] loop
    execute format('drop policy if exists mms_commercial_app_runtime on mms_commercial.%I',v_table);
    execute format('create policy mms_commercial_app_runtime on mms_commercial.%I for all to mms_commercial_app using (true) with check (true)',v_table);
  end loop;
end $$;
commit;
