-- T6.14 committed synthetic evidence for the MMS Preview commercial database only.
-- This intentionally retains one closed synthetic enquiry and its immutable audit
-- history. Never run against Production, iPivot or a patient/clinical database.

begin;

insert into mms_commercial.crm_idempotency_reservations(scope,key_hash,request_fingerprint,state)
values ('synthetic_crm_enquiry','t614-live-preview-key','t614-live-preview-fingerprint','Reserved')
on conflict (scope,key_hash) do nothing;

with reservation as (
  select id from mms_commercial.crm_idempotency_reservations
  where scope='synthetic_crm_enquiry' and key_hash='t614-live-preview-key'
), enquiry as (
  insert into mms_commercial.crm_enquiries(
    idempotency_reservation_id,full_name,email_normalized,country,preferred_location,preferred_language,
    source,campaign,utm_source,partner_id,referral_code,landing_page,broad_interest_category,
    preferred_contact_channel,preferred_contact_time,lead_status,contact_consent_at,
    contact_consent_version,marketing_consent,source_consent_evidence,do_not_contact
  )
  select id,'Synthetic T6.14 Preview Operator','synthetic.t614@example.invalid','Synthetic','Preview',
    'en','Synthetic Preview T6.14','T6.14 Live Preview','preview','SYNTH-PARTNER-T614',
    'SYNTH-REF-T614','/synthetic-t614','Synthetic administrative information','email',
    'Synthetic weekday morning','New Enquiry',now(),'SYNTH-T6.14-v1',false,
    'Authenticated synthetic Preview E2E',false
  from reservation
  where not exists (
    select 1 from mms_commercial.crm_enquiries existing where existing.idempotency_reservation_id=reservation.id
  )
  returning id
)
insert into mms_commercial.crm_queue_state(enquiry_id,queue_state,next_action,next_action_due_at)
select id,'New','Acknowledge synthetic enquiry',now()-interval '10 minutes' from enquiry;

insert into mms_commercial.crm_sync_state(enquiry_id,provider,sync_status)
select e.id,'Synthetic Adapter','Pending'
from mms_commercial.crm_enquiries e
join mms_commercial.crm_idempotency_reservations r on r.id=e.idempotency_reservation_id
where r.key_hash='t614-live-preview-key'
on conflict (enquiry_id) do nothing;

insert into mms_commercial.crm_audit_events(
  enquiry_id,event_type,actor_id,actor_type,new_state,reason,suggestion_source,human_approved,occurred_at
)
select e.id,'enquiry_created','operator-synthetic-t614','Operator',
  jsonb_build_object('leadStatus','New Enquiry','queueState','New'),
  'T6.14 live Preview synthetic evidence','Human',true,now()
from mms_commercial.crm_enquiries e
join mms_commercial.crm_idempotency_reservations r on r.id=e.idempotency_reservation_id
where r.key_hash='t614-live-preview-key'
and not exists (
  select 1 from mms_commercial.crm_audit_events a where a.enquiry_id=e.id and a.event_type='enquiry_created'
);

update mms_commercial.crm_idempotency_reservations r
set state='Completed',enquiry_id=e.id,completed_at=coalesce(r.completed_at,now())
from mms_commercial.crm_enquiries e
where e.idempotency_reservation_id=r.id and r.key_hash='t614-live-preview-key';

-- Exact replay must not create a second reservation or enquiry.
insert into mms_commercial.crm_idempotency_reservations(scope,key_hash,request_fingerprint,state)
values ('synthetic_crm_enquiry','t614-live-preview-key','t614-live-preview-fingerprint','Reserved')
on conflict (scope,key_hash) do nothing;

do $$ begin
  if (select count(*) from mms_commercial.crm_idempotency_reservations where key_hash='t614-live-preview-key') <> 1
    or (select count(*) from mms_commercial.crm_enquiries e join mms_commercial.crm_idempotency_reservations r on r.id=e.idempotency_reservation_id where r.key_hash='t614-live-preview-key') <> 1
  then raise exception 'T6.14 idempotency replay failed'; end if;
end $$;

with target as (
  select e.id,q.version from mms_commercial.crm_enquiries e
  join mms_commercial.crm_queue_state q on q.enquiry_id=e.id
  join mms_commercial.crm_idempotency_reservations r on r.id=e.idempotency_reservation_id
  where r.key_hash='t614-live-preview-key'
), updated as (
  update mms_commercial.crm_queue_state q
  set assigned_owner_id='operator-synthetic-t614',version=q.version+1
  from target t where q.enquiry_id=t.id returning q.enquiry_id
)
insert into mms_commercial.crm_audit_events(
  enquiry_id,event_type,actor_id,actor_type,new_state,reason,suggestion_source,human_approved,occurred_at
)
select t.id,'assign','operator-synthetic-t614','Operator',
  jsonb_build_object('owner','operator-synthetic-t614','version',t.version+1),
  'Synthetic assignment','Human',true,now() from target t join updated u on u.enquiry_id=t.id;

with target as (
  select e.id,q.version from mms_commercial.crm_enquiries e
  join mms_commercial.crm_queue_state q on q.enquiry_id=e.id
  join mms_commercial.crm_idempotency_reservations r on r.id=e.idempotency_reservation_id
  where r.key_hash='t614-live-preview-key'
), updated as (
  update mms_commercial.crm_queue_state q
  set next_action='Synthetic follow-up confirmation',next_action_due_at=now()-interval '5 minutes',
      queue_state='Follow-Up Due',version=q.version+1
  from target t where q.enquiry_id=t.id returning q.enquiry_id
)
insert into mms_commercial.crm_audit_events(
  enquiry_id,event_type,actor_id,actor_type,new_state,reason,suggestion_source,human_approved,occurred_at
)
select t.id,'next_action','operator-synthetic-t614','Operator',
  jsonb_build_object('nextAction','Synthetic follow-up confirmation','queueState','Follow-Up Due','version',t.version+1),
  'Synthetic next action','AI Advisory',true,now() from target t join updated u on u.enquiry_id=t.id;

with target as (
  select e.id,q.version from mms_commercial.crm_enquiries e
  join mms_commercial.crm_queue_state q on q.enquiry_id=e.id
  join mms_commercial.crm_idempotency_reservations r on r.id=e.idempotency_reservation_id
  where r.key_hash='t614-live-preview-key'
), updated_lead as (
  update mms_commercial.crm_enquiries e set lead_status='Contact Attempted'
  from target t where e.id=t.id returning e.id
), updated_queue as (
  update mms_commercial.crm_queue_state q
  set queue_state='Awaiting Contact',first_response_at=coalesce(q.first_response_at,now()),version=q.version+1
  from target t where q.enquiry_id=t.id returning q.enquiry_id
)
insert into mms_commercial.crm_audit_events(
  enquiry_id,event_type,actor_id,actor_type,new_state,reason,suggestion_source,human_approved,occurred_at
)
select t.id,'contact','operator-synthetic-t614','Operator',
  jsonb_build_object('leadStatus','Contact Attempted','queueState','Awaiting Contact','version',t.version+1),
  'Synthetic contact attempt','Human',true,now()
from target t join updated_lead l on l.id=t.id join updated_queue q on q.enquiry_id=t.id;

with target as (
  select e.id,q.version from mms_commercial.crm_enquiries e
  join mms_commercial.crm_queue_state q on q.enquiry_id=e.id
  join mms_commercial.crm_idempotency_reservations r on r.id=e.idempotency_reservation_id
  where r.key_hash='t614-live-preview-key'
), updated as (
  update mms_commercial.crm_queue_state q set queue_state='Escalated',escalated=true,version=q.version+1
  from target t where q.enquiry_id=t.id returning q.enquiry_id
)
insert into mms_commercial.crm_audit_events(
  enquiry_id,event_type,actor_id,actor_type,new_state,reason,suggestion_source,human_approved,occurred_at
)
select t.id,'escalate','operator-synthetic-t614','Operator',
  jsonb_build_object('queueState','Escalated','escalated',true,'version',t.version+1),
  'Synthetic SLA escalation','Human',true,now() from target t join updated u on u.enquiry_id=t.id;

with target as (
  select e.id,q.version from mms_commercial.crm_enquiries e
  join mms_commercial.crm_queue_state q on q.enquiry_id=e.id
  join mms_commercial.crm_idempotency_reservations r on r.id=e.idempotency_reservation_id
  where r.key_hash='t614-live-preview-key'
), updated_lead as (
  update mms_commercial.crm_enquiries e set lead_status='Not Proceeding'
  from target t where e.id=t.id returning e.id
), updated_queue as (
  update mms_commercial.crm_queue_state q
  set queue_state='Completed',closed_reason='Synthetic T6.14 E2E complete',version=q.version+1
  from target t where q.enquiry_id=t.id returning q.enquiry_id
)
insert into mms_commercial.crm_audit_events(
  enquiry_id,event_type,actor_id,actor_type,new_state,reason,suggestion_source,human_approved,occurred_at
)
select t.id,'close','operator-synthetic-t614','Operator',
  jsonb_build_object('leadStatus','Not Proceeding','queueState','Completed','version',t.version+1),
  'Synthetic T6.14 E2E complete','Human',true,now()
from target t join updated_lead l on l.id=t.id join updated_queue q on q.enquiry_id=t.id;

update mms_commercial.crm_sync_state s
set sync_status='Permanent Failure',attempt_count=2,next_retry_at=null,
    last_error_class='Permanent',last_error_code='SYNTHETIC_PERMANENT',last_attempt_at=now()
from mms_commercial.crm_enquiries e
join mms_commercial.crm_idempotency_reservations r on r.id=e.idempotency_reservation_id
where s.enquiry_id=e.id and r.key_hash='t614-live-preview-key';

commit;
