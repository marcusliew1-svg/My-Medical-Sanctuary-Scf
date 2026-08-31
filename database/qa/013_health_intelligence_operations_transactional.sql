begin;

do $$ begin
  if has_table_privilege('anon','mms_commercial.operational_price_observations','select') then
    raise exception 'anon_must_not_read_operational_observations';
  end if;
  if has_table_privilege('authenticated','mms_commercial.observation_evidence','select') then
    raise exception 'authenticated_must_not_read_private_evidence';
  end if;
  if not exists (select 1 from mms_commercial.health_intelligence_markets where country_code in ('MY','TH','SG') group by true having count(*)=3) then
    raise exception 'initial_operational_markets_missing';
  end if;
end $$;

rollback;

