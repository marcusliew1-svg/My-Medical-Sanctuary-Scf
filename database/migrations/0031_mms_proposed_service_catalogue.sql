-- MMS proposed service catalogue baseline.
-- All records are intentionally non-active and fail closed.
-- This is governance metadata, not a claim of licence, availability, safety, suitability or regulatory approval.

begin;

insert into mms_governance.facilities
(facility_id,name,jurisdiction,legal_entity,capability_level,medical_director_role,status,emergency_readiness,restrictions)
values
('FAC-MY-SS2-001','MMS SS2 Flagship (planned)','Malaysia',null,1,'Medical Director','PROPOSED','RED',
 '["Planned facility only","No clinical service authorization","Final legal entity, facility approval and capability level pending"]'::jsonb)
on conflict (facility_id) do nothing;

insert into mms_governance.clinical_services
(service_id,service_name,category,jurisdiction,risk_tier,responsible_medical_director_role,clinical_status,public_exposure_status,
 booking_enabled,crm_enabled,partner_enabled,ling_enabled,facility_id,restrictions)
select x.service_id,x.service_name,x.category,'Malaysia',x.risk_tier,'Medical Director','PROPOSED','INTERNAL_ONLY',
 false,false,false,false,f.id,x.restrictions::jsonb
from (values
('SVC-MY-PREV-001','Preventive Health Assessment','Preventive Care',1,'["Proposed only","Clinical protocol and regulatory review pending"]'),
('SVC-MY-IV-001','Monitored IV / NAD+ Therapy Pathway','Monitored Treatment',2,'["Proposed only","Medication/product, prescribing, facility and emergency approvals pending"]'),
('SVC-MY-EXO-001','Exosome Therapy Pathway','Advanced Therapy',3,'["Proposed only","No public availability claim","Regulatory, evidence, product and protocol review pending"]'),
('SVC-MY-SC-001','Stem Cell Therapy Pathway','Advanced Cellular Therapy',4,'["Proposed only","No public availability claim","Jurisdiction, product, specialist, facility and protocol approval pending"]'),
('SVC-MY-NK-001','NK Cell Therapy Pathway','Advanced Cellular / Oncology',4,'["Proposed only","No public availability claim","Specialist oncology governance and regulatory review pending"]'),
('SVC-MY-DC-001','Dendritic Cell Therapy Pathway','Advanced Cellular / Oncology',4,'["Proposed only","No public availability claim","Specialist oncology governance and regulatory review pending"]'),
('SVC-MY-CART-001','CAR-T Specialist Referral / Coordination Pathway','Hospital-Integrated Specialist Referral',4,'["Proposed referral pathway only","MMS is not authorized by this record to deliver CAR-T","Approved tertiary-centre pathway required"]')
) x(service_id,service_name,category,risk_tier,restrictions)
join mms_governance.facilities f on f.facility_id='FAC-MY-SS2-001'
on conflict (service_id) do nothing;

insert into mms_governance.clinical_service_dependencies
(service_id,dependency_type,dependency_reference,required,status,evidence_reference,owner_role)
select s.id,d.dependency_type,d.dependency_reference,true,'NOT_READY',null,d.owner_role
from mms_governance.clinical_services s
cross join (values
('REGULATORY','Jurisdiction-specific regulatory permissibility','Compliance'),
('PROTOCOL','Approved clinical protocol','Medical Director'),
('FACILITY','Approved facility capability','Clinical Operations'),
('CREDENTIAL','Required clinician credential','Medical Director'),
('PRIVILEGE','Required service-specific clinical privilege','Medical Director'),
('COMPETENCY','Current service competency','Medical Director'),
('STAFFING','Minimum safe staffing condition','Clinical Operations'),
('EMERGENCY','Emergency readiness and transfer pathway','Clinical Operations'),
('CONSENT','Approved service-specific consent','Medical Director'),
('INSURANCE','Insurance / indemnity scope confirmation','Management')
) d(dependency_type,dependency_reference,owner_role)
where s.service_id in (
  'SVC-MY-PREV-001','SVC-MY-IV-001','SVC-MY-EXO-001','SVC-MY-SC-001',
  'SVC-MY-NK-001','SVC-MY-DC-001','SVC-MY-CART-001'
)
on conflict (service_id,dependency_type,dependency_reference) do nothing;

insert into mms_governance.clinical_service_dependencies
(service_id,dependency_type,dependency_reference,required,status,evidence_reference,owner_role)
select s.id,'PRODUCT','Approved product / supplier / batch-release framework',true,'NOT_READY',null,'Quality / Compliance'
from mms_governance.clinical_services s
where s.service_id in ('SVC-MY-IV-001','SVC-MY-EXO-001','SVC-MY-SC-001','SVC-MY-NK-001','SVC-MY-DC-001')
on conflict (service_id,dependency_type,dependency_reference) do nothing;

insert into mms_governance.clinical_service_dependencies
(service_id,dependency_type,dependency_reference,required,status,evidence_reference,owner_role)
select s.id,'DIAGNOSTIC','Approved diagnostic / monitoring pathway',true,'NOT_READY',null,'Medical Director'
from mms_governance.clinical_services s
where s.service_id in ('SVC-MY-PREV-001','SVC-MY-SC-001','SVC-MY-NK-001','SVC-MY-DC-001','SVC-MY-CART-001')
on conflict (service_id,dependency_type,dependency_reference) do nothing;

commit;
