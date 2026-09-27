-- Apply only to the dedicated non-production MMS commercial database after 0025.
begin;

grant select,insert,update on table
  mms_commercial.crm_idempotency_reservations,
  mms_commercial.crm_enquiries,
  mms_commercial.crm_sync_state,
  mms_commercial.crm_queue_state
to mms_commercial_app;

grant select,insert on table mms_commercial.crm_audit_events to mms_commercial_app;

drop policy if exists crm_idempotency_runtime on mms_commercial.crm_idempotency_reservations;
create policy crm_idempotency_runtime on mms_commercial.crm_idempotency_reservations for all to mms_commercial_app
using (scope='synthetic_crm_enquiry') with check (scope='synthetic_crm_enquiry');
drop policy if exists crm_enquiries_runtime on mms_commercial.crm_enquiries;
create policy crm_enquiries_runtime on mms_commercial.crm_enquiries for all to mms_commercial_app using (true) with check (data_classification='Synthetic Preview');
drop policy if exists crm_sync_runtime on mms_commercial.crm_sync_state;
create policy crm_sync_runtime on mms_commercial.crm_sync_state for all to mms_commercial_app
using (exists (select 1 from mms_commercial.crm_enquiries e where e.id=enquiry_id and e.data_classification='Synthetic Preview'))
with check (exists (select 1 from mms_commercial.crm_enquiries e where e.id=enquiry_id and e.data_classification='Synthetic Preview'));
drop policy if exists crm_queue_runtime on mms_commercial.crm_queue_state;
create policy crm_queue_runtime on mms_commercial.crm_queue_state for all to mms_commercial_app
using (exists (select 1 from mms_commercial.crm_enquiries e where e.id=enquiry_id and e.data_classification='Synthetic Preview'))
with check (exists (select 1 from mms_commercial.crm_enquiries e where e.id=enquiry_id and e.data_classification='Synthetic Preview'));
drop policy if exists crm_audit_runtime on mms_commercial.crm_audit_events;
create policy crm_audit_runtime on mms_commercial.crm_audit_events for select to mms_commercial_app
using (exists (select 1 from mms_commercial.crm_enquiries e where e.id=enquiry_id and e.data_classification='Synthetic Preview'));
create policy crm_audit_insert_runtime on mms_commercial.crm_audit_events for insert to mms_commercial_app
with check (exists (select 1 from mms_commercial.crm_enquiries e where e.id=enquiry_id and e.data_classification='Synthetic Preview'));

revoke update,delete on table mms_commercial.crm_audit_events from mms_commercial_app;
revoke delete on table
  mms_commercial.crm_idempotency_reservations,
  mms_commercial.crm_enquiries,
  mms_commercial.crm_sync_state,
  mms_commercial.crm_queue_state
from mms_commercial_app;

commit;
