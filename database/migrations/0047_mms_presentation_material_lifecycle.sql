-- T6.44: explicit, fail-closed Partner Presentation Centre approval states.
-- New and legacy assets remain PENDING until independently reviewed and approved.
begin;
alter table mms_commercial.presentation_assets
  add column if not exists approval_status text not null default 'PENDING';
alter table mms_commercial.presentation_assets
  drop constraint if exists presentation_assets_approval_status_check;
alter table mms_commercial.presentation_assets
  add constraint presentation_assets_approval_status_check
  check (approval_status in ('PENDING','APPROVED','EXPIRED','WITHDRAWN'));
-- Existing records are not automatically promoted to APPROVED.
-- Approval/withdrawal administration must be implemented separately with
-- authenticated reviewer identity, evidence, audit history and role controls.
commit;
