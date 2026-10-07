begin;

do $$
declare
  request_uuid uuid;
  evidence_uuid uuid;
  action_uuid uuid;
begin
  insert into mms_governance.privacy_rights_requests (
    request_id,request_type,jurisdiction,subject_reference,source_channel,
    owner_role,status,received_at
  ) values (
    'MMS-PRR-SYNTHETIC-T640','DELETION_OR_ERASURE','SYNTHETIC',
    'SYNTHETIC-SUBJECT','INTERNAL','Privacy','RECEIVED',now()
  )
  returning id into request_uuid;

  begin
    update mms_governance.privacy_rights_requests
      set status='UNDER_REVIEW'
      where id=request_uuid;
    raise exception 'T6.40 expected identity/jurisdiction evidence constraint failure';
  exception
    when check_violation then null;
  end;

  update mms_governance.privacy_rights_requests
    set identity_verified_at=now(),
        identity_verification_reference='SYNTHETIC-IDV',
        jurisdiction_assessment_reference='SYNTHETIC-JURISDICTION',
        status='UNDER_REVIEW'
    where id=request_uuid;

  begin
    update mms_governance.privacy_rights_requests
      set decision_reference='SYNTHETIC-DECISION',
          response_reference='SYNTHETIC-RESPONSE',
          completed_at=now(),
          status='FULFILLED'
      where id=request_uuid;
    raise exception 'T6.40 expected deletion hold/retention constraint failure';
  exception
    when check_violation then null;
  end;

  insert into mms_governance.evidence_artifacts (
    evidence_id,evidence_type,subject_type,subject_reference,source_system,
    source_reference,storage_location,content_digest_sha256,captured_by_role,captured_at
  ) values (
    'MMS-EV-SYNTHETIC-T640','TEST_RESULT','PRIVACY_REQUEST','MMS-PRR-SYNTHETIC-T640',
    'Synthetic QA','SYNTHETIC-SOURCE','synthetic://privacy-rights',
    repeat('f',64),'Synthetic Privacy Reviewer',now()
  )
  returning id into evidence_uuid;

  insert into mms_governance.privacy_rights_request_actions (
    action_id,privacy_request_id,action_type,action_summary,actor_role,occurred_at,evidence_id
  ) values (
    'MMS-PRA-SYNTHETIC-T640',request_uuid,'RESPONSE_SENT',
    'Synthetic response only','Synthetic Privacy Reviewer',now(),evidence_uuid
  )
  returning id into action_uuid;

  begin
    update mms_governance.privacy_rights_request_actions
      set action_summary='mutation should fail'
      where id=action_uuid;
    raise exception 'T6.40 expected immutable privacy-action update failure';
  exception
    when raise_exception then
      if sqlerrm <> 'immutable governance record' then raise; end if;
  end;
end $$;

rollback;
