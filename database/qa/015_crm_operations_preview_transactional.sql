-- Transactional synthetic-only QA for migration 0025. Always rolls back.
begin;

do $$
begin
  if not exists (select 1 from mms_commercial.schema_migrations where migration_key='0025_mms_crm_operations_preview_pilot.sql') then
    raise exception '0025 migration ledger entry missing';
  end if;
end $$;

insert into mms_commercial.crm_idempotency_reservations(scope,key_hash,request_fingerprint,state)
values ('synthetic_crm_enquiry','qa-t613-key','qa-t613-fingerprint','Reserved');

with reservation as (
  select id from mms_commercial.crm_idempotency_reservations where scope='synthetic_crm_enquiry' and key_hash='qa-t613-key'
), enquiry as (
  insert into mms_commercial.crm_enquiries(
    idempotency_reservation_id,full_name,email_normalized,source,partner_id,lead_status,
    contact_consent_at,contact_consent_version,source_consent_evidence
  ) select id,'Synthetic Preview Person','synthetic.t613@example.invalid','T6.13 QA','SYNTH-PARTNER-001','New Enquiry',now(),'SYNTH-T6.13-v1','Transactional synthetic fixture'
    from reservation returning id
)
insert into mms_commercial.crm_queue_state(enquiry_id,queue_state,next_action,next_action_due_at)
select id,'New','Acknowledge synthetic enquiry',now()+interval '60 minutes' from enquiry;

update mms_commercial.crm_idempotency_reservations r
set state='Completed',enquiry_id=e.id,completed_at=now()
from mms_commercial.crm_enquiries e where e.idempotency_reservation_id=r.id and r.key_hash='qa-t613-key';

insert into mms_commercial.crm_audit_events(enquiry_id,event_type,actor_id,actor_type,new_state,suggestion_source,human_approved,occurred_at)
select id,'Enquiry Created','qa-system','System',jsonb_build_object('leadStatus',lead_status),'System',true,now()
from mms_commercial.crm_enquiries where email_normalized='synthetic.t613@example.invalid';

do $$
declare
  duplicate_count integer;
begin
  insert into mms_commercial.crm_idempotency_reservations(scope,key_hash,request_fingerprint,state)
  values ('synthetic_crm_enquiry','qa-t613-key','qa-t613-fingerprint','Reserved')
  on conflict(scope,key_hash) do nothing;
  select count(*) into duplicate_count from mms_commercial.crm_idempotency_reservations where key_hash='qa-t613-key';
  if duplicate_count <> 1 then raise exception 'atomic idempotency reservation failed'; end if;
end $$;

do $$
begin
  begin
    update mms_commercial.crm_audit_events set reason='mutation must fail' where actor_id='qa-system';
    raise exception 'immutable CRM audit update unexpectedly succeeded';
  exception when raise_exception then
    if sqlerrm not like '%immutable MMS commercial audit/event rows%' then raise; end if;
  end;
end $$;

select
  (select count(*) from mms_commercial.crm_enquiries where data_classification='Synthetic Preview') as synthetic_enquiries,
  (select count(*) from mms_commercial.crm_queue_state) as queue_rows,
  (select count(*) from mms_commercial.crm_audit_events) as immutable_events;

rollback;
