-- MMS governance foreign-key index hardening.
-- Non-production until explicitly approved.

begin;

create index if not exists clinical_services_facility_id_idx
  on mms_governance.clinical_services(facility_id)
  where facility_id is not null;

create index if not exists clinician_privileges_service_id_idx
  on mms_governance.clinician_privileges(service_id);

create index if not exists clinician_privileges_facility_id_idx
  on mms_governance.clinician_privileges(facility_id)
  where facility_id is not null;

create index if not exists products_supplier_id_idx
  on mms_governance.products(supplier_id)
  where supplier_id is not null;

create index if not exists risk_control_links_control_id_idx
  on mms_governance.risk_control_links(control_id);

commit;
