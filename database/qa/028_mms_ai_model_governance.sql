begin;

do $$
declare
  synthetic_use_case uuid;
  evidence_uuid uuid;
  validation_uuid uuid;
begin
  insert into mms_governance.ai_use_cases (
    use_case_id,name,domain,intended_use,data_classification,status,
    human_review_required,clinical_governance_required,privacy_review_required
  ) values (
    'AI-SYNTHETIC-T638','Synthetic AI Use Case','Technology','Synthetic QA only',
    'INTERNAL','REVIEW',true,false,true
  )
  returning id into synthetic_use_case;

  begin
    update mms_governance.ai_use_cases
      set status='ACTIVE'
      where id=synthetic_use_case;
    raise exception 'T6.38 expected activation evidence constraint failure';
  exception
    when check_violation then null;
  end;

  insert into mms_governance.evidence_artifacts (
    evidence_id,evidence_type,subject_type,subject_reference,source_system,
    source_reference,storage_location,content_digest_sha256,captured_by_role,captured_at
  ) values (
    'MMS-EV-SYNTHETIC-T638','TEST_RESULT','AI_USE_CASE','AI-SYNTHETIC-T638',
    'Synthetic QA','SYNTHETIC-SOURCE','synthetic://ai-validation',
    repeat('d',64),'Synthetic Assessor',now()
  ) returning id into evidence_uuid;

  insert into mms_governance.ai_validation_assessments (
    validation_id,ai_use_case_id,validation_type,scope,result,evidence_id,assessor_role,validated_at
  ) values (
    'AI-VAL-SYNTHETIC-T638',synthetic_use_case,'SAFETY','Synthetic validation scope',
    'PASS',evidence_uuid,'Synthetic Assessor',now()
  )
  returning id into validation_uuid;

  begin
    update mms_governance.ai_validation_assessments
      set result='FAIL'
      where id=validation_uuid;
    raise exception 'T6.38 expected immutable validation update failure';
  exception
    when raise_exception then
      if sqlerrm <> 'immutable governance record' then raise; end if;
  end;
end $$;

rollback;
