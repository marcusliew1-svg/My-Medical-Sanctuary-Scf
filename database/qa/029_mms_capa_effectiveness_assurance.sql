begin;

do $$
declare
  synthetic_capa uuid;
  evidence_uuid uuid;
  review_uuid uuid;
begin
  insert into mms_governance.capa_actions (
    capa_id,source_type,source_reference,finding,severity,owner_role,action,status
  ) values (
    'CAPA-SYNTHETIC-T639','CONTROL_TEST','SYNTHETIC-CONTROL',
    'Synthetic QA finding','MAJOR','Quality','Synthetic remediation','IN_PROGRESS'
  )
  returning id into synthetic_capa;

  begin
    update mms_governance.capa_actions
      set status='IMPLEMENTED'
      where id=synthetic_capa;
    raise exception 'T6.39 expected implementation-evidence constraint failure';
  exception
    when check_violation then null;
  end;

  update mms_governance.capa_actions
    set root_cause_reference='SYNTHETIC-ROOT-CAUSE',
        implemented_at=now(),
        implementation_evidence_reference='SYNTHETIC-IMPLEMENTATION-EVIDENCE',
        status='IMPLEMENTED'
    where id=synthetic_capa;

  begin
    update mms_governance.capa_actions
      set status='CLOSED'
      where id=synthetic_capa;
    raise exception 'T6.39 expected closure/effectiveness constraint failure';
  exception
    when check_violation then null;
  end;

  insert into mms_governance.evidence_artifacts (
    evidence_id,evidence_type,subject_type,subject_reference,source_system,
    source_reference,storage_location,content_digest_sha256,captured_by_role,captured_at
  ) values (
    'MMS-EV-SYNTHETIC-T639','TEST_RESULT','CAPA','CAPA-SYNTHETIC-T639',
    'Synthetic QA','SYNTHETIC-SOURCE','synthetic://capa-effectiveness',
    repeat('e',64),'Synthetic Reviewer',now()
  )
  returning id into evidence_uuid;

  insert into mms_governance.capa_effectiveness_reviews (
    review_id,capa_action_id,review_scope,result,evidence_id,reviewer_role,reviewed_at
  ) values (
    'CAPA-REV-SYNTHETIC-T639',synthetic_capa,'Synthetic effectiveness scope',
    'EFFECTIVE',evidence_uuid,'Synthetic Reviewer',now()
  )
  returning id into review_uuid;

  begin
    update mms_governance.capa_effectiveness_reviews
      set result='INEFFECTIVE'
      where id=review_uuid;
    raise exception 'T6.39 expected immutable effectiveness-review update failure';
  exception
    when raise_exception then
      if sqlerrm <> 'immutable governance record' then raise; end if;
  end;

  update mms_governance.capa_actions
    set effectiveness_evidence='MMS-EV-SYNTHETIC-T639',
        effectiveness_result='EFFECTIVE',
        verified_by_role='Synthetic Reviewer',
        verified_at=now(),
        closure_reference='SYNTHETIC-CLOSURE',
        closed_at=now(),
        status='CLOSED'
    where id=synthetic_capa;
end $$;

rollback;
