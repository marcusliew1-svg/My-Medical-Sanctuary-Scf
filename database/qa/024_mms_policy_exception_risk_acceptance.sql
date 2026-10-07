begin;

do $$
declare
  synthetic_id uuid;
begin
  insert into mms_governance.policy_exceptions (
    exception_id, exception_type, domain, subject_reference, rationale,
    owner_role, status, risk_rating
  ) values (
    'MMS-EXC-SYNTHETIC-001','CONTROL_WAIVER','Technology',
    'SYNTHETIC-CONTROL','Synthetic QA only',
    'Technology','UNDER_REVIEW','HIGH'
  )
  returning id into synthetic_id;

  if synthetic_id is null then
    raise exception 'T6.34 synthetic exception row was not created';
  end if;

  begin
    update mms_governance.policy_exceptions
      set status='APPROVED'
      where id=synthetic_id;
    raise exception 'T6.34 expected approval-evidence constraint failure';
  exception
    when check_violation then null;
  end;

  update mms_governance.policy_exceptions
    set approval_reference='SYNTHETIC-APPROVAL',
        approver_role='Synthetic Approver',
        effective_at=now(),
        expires_at=now() + interval '7 days',
        evidence_reference='SYNTHETIC-EVIDENCE',
        compensating_controls='Synthetic compensating control',
        status='APPROVED'
    where id=synthetic_id;

  begin
    update mms_governance.policy_exceptions
      set expires_at=effective_at
      where id=synthetic_id;
    raise exception 'T6.34 expected expiry-ordering constraint failure';
  exception
    when check_violation then null;
  end;
end $$;

rollback;
