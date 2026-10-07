begin;

do $$
declare
  synthetic_id uuid;
begin
  insert into mms_governance.regulatory_obligations (
    obligation_id,jurisdiction,authority_name,domain,obligation_type,title,
    description,source_reference,owner_role,status,recurrence
  ) values (
    'MMS-REG-SYNTHETIC-001','SYNTHETIC','Synthetic Authority','Technology',
    'REPORTING','Synthetic QA Obligation','Synthetic only','SYNTHETIC-SOURCE',
    'Compliance','UNDER_REVIEW','ANNUAL'
  )
  returning id into synthetic_id;

  if synthetic_id is null then
    raise exception 'T6.32 synthetic obligation row was not created';
  end if;

  begin
    update mms_governance.regulatory_obligations
      set status='ACTIVE'
      where id=synthetic_id;
    raise exception 'T6.32 expected active-approval constraint failure';
  exception
    when check_violation then null;
  end;

  update mms_governance.regulatory_obligations
    set approval_reference='SYNTHETIC-APPROVAL',
        applicability_rationale='Synthetic QA only',
        status='ACTIVE'
    where id=synthetic_id;

  begin
    update mms_governance.regulatory_obligations
      set completed_at=now(), completion_reference=null
      where id=synthetic_id;
    raise exception 'T6.32 expected completion-evidence constraint failure';
  exception
    when check_violation then null;
  end;
end $$;

rollback;
