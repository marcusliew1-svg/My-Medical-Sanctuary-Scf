-- Non-production Partner Hub commerce fixture.
-- Requires database/qa/001_partner_hub_fixture.sql first.
-- Commercial data only. Never use in production, clinical, patient or iPivot databases.

begin;

do $$
declare
  v_partner uuid;
  v_pending_lead uuid;
  v_pending_app uuid;
  v_active_lead uuid;
  v_active_app uuid;
  v_active_payment uuid;
  v_now timestamptz := now();
begin
  select id into v_partner
  from mms_commercial.partners
  where partner_code = 'MMSP-99990001'
    and stage = 'Active'
    and selling_enabled = true;

  if v_partner is null then
    raise exception 'QA Partner MMSP-99990001 is missing or not Active/selling-enabled';
  end if;

  insert into mms_commercial.leads (
    public_lead_id, registered_by_partner_id, current_partner_id, full_name,
    email_normalized, source, campaign, stage, duplicate_status,
    consent_version, consent_captured_at, registered_at, last_activity_at
  ) values (
    'MMSL-QA-PENDING-0001', v_partner, v_partner, 'QA Commercial Pending',
    'qa.pending@example.invalid', 'QA Fixture', 'Partner Hub Commerce', 'Application', 'Clear',
    'MMS-PDPA-MARKETING-2026-08-v1', v_now - interval '2 days', v_now - interval '2 days', v_now - interval '1 day'
  ) on conflict (public_lead_id) do nothing;

  select id into v_pending_lead from mms_commercial.leads where public_lead_id = 'MMSL-QA-PENDING-0001';

  insert into mms_commercial.applications (
    public_application_id, lead_id, partner_id, membership_code, stage, submitted_at, approved_at
  ) values (
    'MMSA-QA-PENDING-0001', v_pending_lead, v_partner, 'EVOLVE', 'Payment Pending',
    v_now - interval '36 hours', v_now - interval '24 hours'
  ) on conflict (public_application_id) do nothing;

  select id into v_pending_app from mms_commercial.applications where public_application_id = 'MMSA-QA-PENDING-0001';

  insert into mms_commercial.payments (
    public_payment_id, application_id, transaction_reference, amount_minor_units,
    currency, stage, submitted_at
  ) values (
    'MMSPAY-QA-PENDING-0001', v_pending_app, 'QA-PENDING-TXN-0001', 2888800,
    'MYR', 'Submitted', v_now - interval '20 hours'
  ) on conflict (public_payment_id) do nothing;

  insert into mms_commercial.leads (
    public_lead_id, registered_by_partner_id, current_partner_id, full_name,
    email_normalized, source, campaign, stage, duplicate_status,
    consent_version, consent_captured_at, registered_at, last_activity_at
  ) values (
    'MMSL-QA-ACTIVE-0001', v_partner, v_partner, 'QA Commercial Activated',
    'qa.active@example.invalid', 'QA Fixture', 'Partner Hub Commerce', 'Activated', 'Clear',
    'MMS-PDPA-MARKETING-2026-08-v1', v_now - interval '8 days', v_now - interval '8 days', v_now - interval '1 hour'
  ) on conflict (public_lead_id) do nothing;

  select id into v_active_lead from mms_commercial.leads where public_lead_id = 'MMSL-QA-ACTIVE-0001';

  insert into mms_commercial.applications (
    public_application_id, lead_id, partner_id, membership_code, stage,
    submitted_at, approved_at, activated_at
  ) values (
    'MMSA-QA-ACTIVE-0001', v_active_lead, v_partner, 'ASCEND', 'Activated',
    v_now - interval '7 days', v_now - interval '6 days', v_now - interval '5 days'
  ) on conflict (public_application_id) do nothing;

  select id into v_active_app from mms_commercial.applications where public_application_id = 'MMSA-QA-ACTIVE-0001';

  insert into mms_commercial.payments (
    public_payment_id, application_id, transaction_reference, amount_minor_units,
    currency, stage, submitted_at, cleared_at
  ) values (
    'MMSPAY-QA-ACTIVE-0001', v_active_app, 'QA-ACTIVE-TXN-0001', 888800,
    'MYR', 'Cleared', v_now - interval '6 days', v_now - interval '5 days 1 hour'
  ) on conflict (public_payment_id) do nothing;

  select id into v_active_payment from mms_commercial.payments where public_payment_id = 'MMSPAY-QA-ACTIVE-0001';

  insert into mms_commercial.payment_verifications (
    payment_id, verified_by, verified_at, cleared_amount_minor_units,
    currency, source, source_reference
  ) values (
    v_active_payment, 'qa-fixture', v_now - interval '5 days 1 hour', 888800,
    'MYR', 'Finance Manual Review', 'QA-VERIFY-0001'
  ) on conflict (payment_id, source, source_reference) do nothing;

  insert into mms_commercial.memberships (
    public_membership_id, application_id, member_reference, membership_code,
    status, activated_at
  ) values (
    'MMSM-QA-ACTIVE-0001', v_active_app, 'QA-MEMBER-0001', 'ASCEND',
    'Active', v_now - interval '5 days'
  ) on conflict (public_membership_id) do nothing;
end $$;

commit;
