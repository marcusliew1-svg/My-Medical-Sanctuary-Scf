begin;

do $$
declare
  incident_uuid uuid;
  evidence_uuid uuid;
  assessment_uuid uuid;
begin
  insert into mms_governance.incidents (
    incident_id,incident_type,domain,severity,summary,owner_role,status,detected_at
  ) values (
    'INC-SYNTHETIC-T642','PRIVACY_SECURITY_EVENT','Privacy / Data','P1',
    'Synthetic privacy/security QA event','Privacy','OPEN',now()
  )
  returning id into incident_uuid;

  begin
    insert into mms_governance.privacy_security_assessments (
      assessment_id,incident_id,jurisdiction,assessment_type,risk_to_individuals,
      notification_assessment_state,owner_role,assessed_at
    ) values (
      'MMS-PSA-SYNTHETIC-BAD',incident_uuid,'SYNTHETIC','POTENTIAL_PERSONAL_DATA_BREACH',
      'HIGH','REQUIRED','Privacy',now()
    );
    raise exception 'T6.42 expected notification-evidence constraint failure';
  exception
    when check_violation then null;
  end;

  insert into mms_governance.evidence_artifacts (
    evidence_id,evidence_type,subject_type,subject_reference,source_system,
    source_reference,storage_location,content_digest_sha256,captured_by_role,captured_at
  ) values (
    'MMS-EV-SYNTHETIC-T642','REPORT','INCIDENT','INC-SYNTHETIC-T642',
    'Synthetic QA','SYNTHETIC-SOURCE','synthetic://privacy-security-assessment',
    repeat('2',64),'Synthetic Privacy Reviewer',now()
  ) returning id into evidence_uuid;

  insert into mms_governance.privacy_security_assessments (
    assessment_id,incident_id,jurisdiction,assessment_type,affected_data_classes,
    affected_subject_count_estimate,risk_to_individuals,notification_assessment_state,
    authority_notification_state,subject_notification_state,legal_privacy_review_reference,
    decision_reference,evidence_id,owner_role,assessed_at
  ) values (
    'MMS-PSA-SYNTHETIC-T642',incident_uuid,'SYNTHETIC','POTENTIAL_PERSONAL_DATA_BREACH',
    '["Synthetic"]'::jsonb,1,'HIGH','PENDING_AUTHORITY_REVIEW',
    'PENDING','PENDING','SYNTHETIC-REVIEW','SYNTHETIC-DECISION',
    evidence_uuid,'Privacy',now()
  ) returning id into assessment_uuid;

  begin
    update mms_governance.privacy_security_assessments
      set risk_to_individuals='LOW'
      where id=assessment_uuid;
    raise exception 'T6.42 expected immutable assessment update failure';
  exception
    when raise_exception then
      if sqlerrm <> 'immutable governance record' then raise; end if;
  end;
end $$;

rollback;
