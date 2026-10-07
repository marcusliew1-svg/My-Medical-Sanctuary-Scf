begin;

do $$
declare
  synthetic_id uuid;
begin
  insert into mms_governance.training_records (
    training_record_id,subject_id,role_name,module_name,module_version,
    competency_method,status,assessor_role,completed_at,evidence_reference,verified_at
  ) values (
    'TR-SYNTHETIC-T630','SYNTHETIC-SUBJECT','Synthetic Role','Synthetic Module','1.0',
    'Knowledge assessment','COMPETENT','Synthetic Assessor Role',now(),'SYNTHETIC-EVIDENCE',now()
  )
  returning id into synthetic_id;

  if synthetic_id is null then
    raise exception 'T6.30 synthetic competent record was not created';
  end if;

  begin
    update mms_governance.training_records
      set evidence_reference = null
      where id = synthetic_id;
    raise exception 'T6.30 expected competency-evidence constraint failure';
  exception
    when check_violation then null;
  end;

  begin
    update mms_governance.training_records
      set expires_at = completed_at - interval '1 second'
      where id = synthetic_id;
    raise exception 'T6.30 expected expiry ordering constraint failure';
  exception
    when check_violation then null;
  end;
end $$;

rollback;
