-- Read-only assertions for the non-production Partner Hub commerce fixture.
-- Expected result: every boolean column is true and counts are non-zero as labelled.

select
  exists(
    select 1
    from mms_commercial.applications a
    join mms_commercial.partners p on p.id = a.partner_id
    where p.partner_code = 'MMSP-99990001'
      and a.public_application_id = 'MMSA-QA-PENDING-0001'
      and a.stage = 'Payment Pending'
  ) as pending_application_visible,
  exists(
    select 1
    from mms_commercial.payments pay
    join mms_commercial.applications a on a.id = pay.application_id
    join mms_commercial.partners p on p.id = a.partner_id
    where p.partner_code = 'MMSP-99990001'
      and pay.public_payment_id = 'MMSPAY-QA-PENDING-0001'
      and pay.stage = 'Submitted'
  ) as pending_payment_visible,
  exists(
    select 1
    from mms_commercial.memberships m
    join mms_commercial.applications a on a.id = m.application_id
    join mms_commercial.partners p on p.id = a.partner_id
    where p.partner_code = 'MMSP-99990001'
      and m.public_membership_id = 'MMSM-QA-ACTIVE-0001'
      and m.status = 'Active'
  ) as active_membership_visible,
  exists(
    select 1
    from mms_commercial.payment_verifications v
    join mms_commercial.payments pay on pay.id = v.payment_id
    where pay.public_payment_id = 'MMSPAY-QA-ACTIVE-0001'
      and v.source_reference = 'QA-VERIFY-0001'
  ) as finance_verification_persisted;

select
  count(*) filter (where a.stage = 'Payment Pending') as payment_pending_count,
  count(*) filter (where a.stage = 'Activated') as activated_count
from mms_commercial.applications a
join mms_commercial.partners p on p.id = a.partner_id
where p.partner_code = 'MMSP-99990001';
