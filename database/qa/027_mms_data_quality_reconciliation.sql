begin;

do $$
declare
  evidence_uuid uuid;
  assessment_uuid uuid;
begin
  insert into mms_governance.evidence_artifacts (
    evidence_id,evidence_type,subject_type,subject_reference,source_system,
    source_reference,storage_location,content_digest_sha256,captured_by_role,captured_at
  ) values (
    'MMS-EV-SYNTHETIC-T637','TEST_RESULT','DATASET','Synthetic Dataset',
    'Synthetic QA','SYNTHETIC-SOURCE','synthetic://dq-evidence',
    repeat('c',64),'Synthetic Assessor',now()
  ) returning id into evidence_uuid;

  begin
    insert into mms_governance.data_quality_assessments (
      assessment_id,dataset_name,source_system,source_reference,owner_role,assessed_at,status,
      freshness_state,completeness_state,duplicate_state,reconciliation_state,lineage_state,evidence_id
    ) values (
      'MMS-DQ-SYNTHETIC-BAD','Synthetic Dataset','Synthetic QA','SYNTHETIC-SOURCE','Data',
      now(),'PASS','STALE','COMPLETE','CLEAR','RECONCILED','COMPLETE',evidence_uuid
    );
    raise exception 'T6.37 expected PASS quality-state constraint failure';
  exception
    when check_violation then null;
  end;

  insert into mms_governance.data_quality_assessments (
    assessment_id,dataset_name,source_system,source_reference,owner_role,assessed_at,status,
    freshness_state,completeness_state,duplicate_state,reconciliation_state,lineage_state,evidence_id
  ) values (
    'MMS-DQ-SYNTHETIC-001','Synthetic Dataset','Synthetic QA','SYNTHETIC-SOURCE','Data',
    now(),'PASS_WITH_LIMITATIONS','CURRENT','INCOMPLETE','CLEAR','RECONCILED','PARTIAL',evidence_uuid
  )
  returning id into assessment_uuid;

  begin
    update mms_governance.data_quality_assessments
      set status='PASS'
      where id=assessment_uuid;
    raise exception 'T6.37 expected immutable assessment update failure';
  exception
    when raise_exception then
      if sqlerrm <> 'immutable governance record' then raise; end if;
  end;
end $$;

rollback;
