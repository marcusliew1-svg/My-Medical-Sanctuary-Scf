begin;

do $$
declare
  consent_uuid uuid;
  evidence_uuid uuid;
  event_uuid uuid;
begin
  insert into mms_governance.consent_authorizations (
    consent_id,subject_reference,consent_type,jurisdiction,document_reference,
    document_version,scope_summary,status
  ) values (
    'MMS-CONS-SYNTHETIC-T641','SYNTHETIC-SUBJECT','DATA_PROCESSING','SYNTHETIC',
    'SYNTHETIC-DOC','v0','Synthetic QA scope','PENDING'
  )
  returning id into consent_uuid;

  begin
    update mms_governance.consent_authorizations
      set status='ACTIVE'
      where id=consent_uuid;
    raise exception 'T6.41 expected activation-evidence constraint failure';
  exception
    when check_violation then null;
  end;

  begin
    insert into mms_governance.consent_events (
      event_id,consent_authorization_id,event_type,event_summary,actor_role,occurred_at
    ) values (
      'MMS-CONS-EVT-SYNTHETIC-BAD',consent_uuid,'GRANTED',
      'Synthetic evidence-free grant','Synthetic Consent Reviewer',now()
    );
    raise exception 'T6.41 expected material-event evidence constraint failure';
  exception
    when check_violation then null;
  end;

  insert into mms_governance.evidence_artifacts (
    evidence_id,evidence_type,subject_type,subject_reference,source_system,
    source_reference,storage_location,content_digest_sha256,captured_by_role,captured_at
  ) values (
    'MMS-EV-SYNTHETIC-T641','APPROVAL_RECORD','CONSENT','MMS-CONS-SYNTHETIC-T641',
    'Synthetic QA','SYNTHETIC-SOURCE','synthetic://consent',
    repeat('1',64),'Synthetic Consent Reviewer',now()
  )
  returning id into evidence_uuid;

  update mms_governance.consent_authorizations
    set capture_method='Synthetic QA',
        captured_by_role='Synthetic Consent Reviewer',
        granted_at=now(),
        evidence_id=evidence_uuid,
        status='ACTIVE'
    where id=consent_uuid;

  begin
    update mms_governance.consent_authorizations
      set status='WITHDRAWN'
      where id=consent_uuid;
    raise exception 'T6.41 expected withdrawal-evidence constraint failure';
  exception
    when check_violation then null;
  end;

  insert into mms_governance.consent_events (
    event_id,consent_authorization_id,event_type,event_summary,actor_role,occurred_at,evidence_id
  ) values (
    'MMS-CONS-EVT-SYNTHETIC-T641',consent_uuid,'GRANTED',
    'Synthetic grant event','Synthetic Consent Reviewer',now(),evidence_uuid
  )
  returning id into event_uuid;

  begin
    update mms_governance.consent_events
      set event_summary='mutation should fail'
      where id=event_uuid;
    raise exception 'T6.41 expected immutable consent-event update failure';
  exception
    when raise_exception then
      if sqlerrm <> 'immutable governance record' then raise; end if;
  end;
end $$;

rollback;
