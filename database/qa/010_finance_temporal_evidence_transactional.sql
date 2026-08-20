-- Rollback-safe QA for migration 0019 finance temporal-evidence hardening.
-- Dedicated non-production MMS commercial database only.

begin;

do $$
declare
  v_partner uuid;
  v_lead uuid;
  v_app uuid;
  v_app_public text;
  v_pay uuid;
  v_pay_public text;
  v_mem uuid;
  v_mem_public text;
  v_submission timestamptz := now() - interval '10 minutes';
  v_verified timestamptz := now() - interval '5 minutes';
  v_activated timestamptz := now() - interval '4 minutes';
begin
  insert into mms_commercial.partners(stage, level, selling_enabled, crm_access_enabled)
  values ('Active', 'Associate', true, true)
  returning id into v_partner;

  insert into mms_commercial.leads(
    registered_by_partner_id, current_partner_id, full_name, email_normalized,
    stage, duplicate_status, consent_version, consent_captured_at, registered_at
  ) values (
    v_partner, v_partner, 'Temporal QA Lead',
    'temporal-' || replace(gen_random_uuid()::text, '-', '') || '@example.invalid',
    'Payment Pending', 'Clear', 'QA-ONLY', v_submission - interval '1 day', v_submission - interval '1 day'
  ) returning id into v_lead;

  insert into mms_commercial.applications(lead_id, partner_id, membership_code, stage, submitted_at)
  values (v_lead, v_partner, 'ASCEND', 'Payment Pending', v_submission - interval '30 minutes')
  returning id, public_application_id into v_app, v_app_public;

  insert into mms_commercial.payments(
    application_id, transaction_reference, amount_minor_units, currency, stage, submitted_at
  ) values (
    v_app, 'QA-TEMP-' || replace(gen_random_uuid()::text, '-', ''), 888800, 'MYR', 'Submitted', v_submission
  ) returning id, public_payment_id into v_pay, v_pay_public;

  insert into mms_commercial.memberships(application_id, member_reference, membership_code, status)
  values (v_app, 'QA-MEMBER-' || replace(gen_random_uuid()::text, '-', ''), 'ASCEND', 'Pending Activation')
  returning id, public_membership_id into v_mem, v_mem_public;

  begin
    perform mms_commercial.finance_verify_payment(
      v_app_public, v_pay_public, 'qa-finance', v_submission - interval '1 second',
      888800, 'MYR', 'Finance Manual Review', 'QA-BEFORE-SUBMISSION'
    );
    raise exception 'qa_expected_before_submission_rejection_missing';
  exception when others then
    if sqlerrm = 'qa_expected_before_submission_rejection_missing' then raise; end if;
    if sqlerrm <> 'payment_verification_precedes_submission' then raise; end if;
  end;

  begin
    perform mms_commercial.finance_verify_payment(
      v_app_public, v_pay_public, 'qa-finance', now() + interval '10 minutes',
      888800, 'MYR', 'Finance Manual Review', 'QA-FUTURE-VERIFY'
    );
    raise exception 'qa_expected_future_verification_rejection_missing';
  exception when others then
    if sqlerrm = 'qa_expected_future_verification_rejection_missing' then raise; end if;
    if sqlerrm <> 'invalid_payment_verification_evidence' then raise; end if;
  end;

  perform mms_commercial.finance_verify_payment(
    v_app_public, v_pay_public, 'qa-finance', v_verified,
    888800, 'MYR', 'Finance Manual Review', 'QA-VALID-VERIFY'
  );

  -- Exact replay must remain harmless.
  perform mms_commercial.finance_verify_payment(
    v_app_public, v_pay_public, 'qa-finance', v_verified,
    888800, 'MYR', 'Finance Manual Review', 'QA-VALID-VERIFY'
  );

  begin
    perform mms_commercial.activate_membership(
      v_app_public, v_pay_public, v_mem_public, 'qa-ops', now() + interval '10 minutes', v_verified
    );
    raise exception 'qa_expected_future_activation_rejection_missing';
  exception when others then
    if sqlerrm = 'qa_expected_future_activation_rejection_missing' then raise; end if;
    if sqlerrm <> 'invalid_membership_activation_evidence' then raise; end if;
  end;

  begin
    perform mms_commercial.activate_membership(
      v_app_public, v_pay_public, v_mem_public, 'qa-ops', v_verified - interval '1 second', v_verified
    );
    raise exception 'qa_expected_activation_order_rejection_missing';
  exception when others then
    if sqlerrm = 'qa_expected_activation_order_rejection_missing' then raise; end if;
    if sqlerrm <> 'activation_precedes_finance_verification' then raise; end if;
  end;

  perform mms_commercial.activate_membership(
    v_app_public, v_pay_public, v_mem_public, 'qa-ops', v_activated, v_verified
  );

  -- Exact replay must remain harmless.
  perform mms_commercial.activate_membership(
    v_app_public, v_pay_public, v_mem_public, 'qa-ops', v_activated, v_verified
  );

  if (select stage from mms_commercial.applications where id = v_app) <> 'Activated' then
    raise exception 'qa_application_not_activated';
  end if;
  if (select stage from mms_commercial.payments where id = v_pay) <> 'Cleared' then
    raise exception 'qa_payment_not_cleared';
  end if;
  if (select status from mms_commercial.memberships where id = v_mem) <> 'Active' then
    raise exception 'qa_membership_not_active';
  end if;
  if (select count(*) from mms_commercial.payment_verifications where payment_id = v_pay) <> 1 then
    raise exception 'qa_payment_verification_replay_duplicated_evidence';
  end if;
end $$;

rollback;
