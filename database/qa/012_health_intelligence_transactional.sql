-- Transactional Release 2A schema/security verification. Ends with rollback.
begin;

do $$ begin
  if (select count(*) from mms_commercial.health_intelligence_markets) <> 7 then
    raise exception 'expected_seven_health_intelligence_markets';
  end if;
  if has_table_privilege('anon','mms_commercial.price_observations','select') then
    raise exception 'anon_must_not_read_price_observations';
  end if;
  if has_table_privilege('authenticated','mms_commercial.health_intelligence_audit_events','select') then
    raise exception 'authenticated_must_not_read_internal_audit';
  end if;
end $$;

insert into mms_commercial.active_ingredients(canonical_name,data_status)
values('Demo Ingredient QA','demo') on conflict(canonical_name) do nothing;
insert into mms_commercial.brands(name,normalized_name,data_status)
values('Demo Brand QA','demo brand qa','demo') on conflict(normalized_name) do nothing;
insert into mms_commercial.manufacturers(name,normalized_name,data_status)
values('Demo Manufacturer QA','demo manufacturer qa','demo') on conflict(normalized_name) do nothing;
insert into mms_commercial.medicine_products(
  product_code,generic_name,brand_id,manufacturer_id,dosage_form_id,route_id,release_type_id,
  pack_size,units_per_pack,verification_status,publication_status,data_status
) select 'DEMO-QA-001','Demo Ingredient QA',b.id,m.id,'tablet','oral','immediate',30,30,'collected','not_eligible','demo'
from mms_commercial.brands b,mms_commercial.manufacturers m
where b.normalized_name='demo brand qa' and m.normalized_name='demo manufacturer qa';

do $$ begin
  if not exists(select 1 from mms_commercial.medicine_products where product_code='DEMO-QA-001' and data_status='demo') then
    raise exception 'demo_product_creation_failed';
  end if;
end $$;

rollback;
