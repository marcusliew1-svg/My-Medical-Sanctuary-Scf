begin;

do $$
declare
  synthetic_id uuid;
begin
  insert into mms_governance.management_reviews (
    review_id, review_type, status
  ) values (
    'MMS-MR-SYNTHETIC-001','QUARTERLY_MANAGEMENT','IN_REVIEW'
  )
  returning id into synthetic_id;

  if synthetic_id is null then
    raise exception 'T6.33 synthetic management review row was not created';
  end if;

  begin
    update mms_governance.management_reviews
      set status='COMPLETE'
      where id=synthetic_id;
    raise exception 'T6.33 expected completion-evidence constraint failure';
  exception
    when check_violation then null;
  end;

  update mms_governance.management_reviews
    set evidence_pack_reference='SYNTHETIC-EVIDENCE-PACK',
        minutes_reference='SYNTHETIC-MINUTES',
        action_register_reference='SYNTHETIC-ACTIONS',
        overall_assurance='ADEQUATE_WITH_CONDITIONS',
        completed_at=now(),
        approval_reference='SYNTHETIC-APPROVAL',
        status='COMPLETE'
    where id=synthetic_id;

  if not exists (
    select 1 from mms_governance.management_reviews
    where id=synthetic_id and status='COMPLETE'
  ) then
    raise exception 'T6.33 evidenced management-review completion failed';
  end if;
end $$;

rollback;
