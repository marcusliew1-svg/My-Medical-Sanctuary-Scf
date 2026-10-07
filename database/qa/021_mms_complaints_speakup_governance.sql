begin;

do $$
declare
  synthetic_id uuid;
begin
  insert into mms_governance.complaints_and_concerns (
    case_id,case_type,source_channel,severity,summary,owner_role,status,received_at
  ) values (
    'MMS-CC-SYNTHETIC-001','SPEAK_UP','INTERNAL','MAJOR',
    'Synthetic QA concern','Compliance','OPEN',now()
  )
  returning id into synthetic_id;

  if synthetic_id is null then
    raise exception 'T6.31 synthetic complaint/concern row was not created';
  end if;

  begin
    update mms_governance.complaints_and_concerns
      set status='RESOLVED'
      where id=synthetic_id;
    raise exception 'T6.31 expected resolution evidence constraint failure';
  exception
    when check_violation then null;
  end;

  update mms_governance.complaints_and_concerns
    set resolution_summary='Synthetic resolution',
        evidence_reference='SYNTHETIC-EVIDENCE-001',
        resolved_at=now(),
        regulator_assessment_state='NOT_REQUIRED',
        status='RESOLVED'
    where id=synthetic_id;

  if not exists (
    select 1 from mms_governance.complaints_and_concerns
    where id=synthetic_id and status='RESOLVED'
  ) then
    raise exception 'T6.31 evidenced resolution transition failed';
  end if;

  begin
    update mms_governance.complaints_and_concerns
      set status='CLOSED',
          regulator_assessment_state='NOT_ASSESSED'
      where id=synthetic_id;
    raise exception 'T6.31 expected closure assessment constraint failure';
  exception
    when check_violation then null;
  end;
end $$;

rollback;
