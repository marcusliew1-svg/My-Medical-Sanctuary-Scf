begin;

do $$
declare
  metric_uuid uuid;
  evidence_uuid uuid;
  obs_uuid uuid;
begin
  insert into mms_governance.metric_definitions (
    metric_id,name,domain,metric_type,owner_role,definition,
    calculation_method,source_system,unit,direction,frequency,status
  ) values (
    'MMS-MET-SYNTHETIC-001','Synthetic Metric','Technology','KPI','Technology',
    'Synthetic QA metric','Synthetic calculation','Synthetic source','count',
    'LOWER_IS_BETTER','MONTHLY','UNDER_REVIEW'
  )
  returning id into metric_uuid;

  begin
    update mms_governance.metric_definitions
      set status='ACTIVE'
      where id=metric_uuid;
    raise exception 'T6.36 expected activation evidence/threshold constraint failure';
  exception
    when check_violation then null;
  end;

  insert into mms_governance.evidence_artifacts (
    evidence_id,evidence_type,subject_type,subject_reference,source_system,
    source_reference,storage_location,content_digest_sha256,captured_by_role,captured_at
  ) values (
    'MMS-EV-SYNTHETIC-T636','TEST_RESULT','METRIC','MMS-MET-SYNTHETIC-001',
    'Synthetic QA','SYNTHETIC-SOURCE','synthetic://metric-evidence',
    repeat('b',64),'Synthetic Assessor',now()
  ) returning id into evidence_uuid;

  update mms_governance.metric_definitions
    set approval_reference='SYNTHETIC-APPROVAL',
        green_threshold='<= 1',
        amber_threshold='> 1 and <= 3',
        red_threshold='> 3',
        status='ACTIVE'
    where id=metric_uuid;

  begin
    insert into mms_governance.metric_observations (
      observation_id,metric_definition_id,value_numeric,threshold_state,
      source_reference,captured_by_role,captured_at
    ) values (
      'MMS-OBS-SYNTHETIC-BAD',metric_uuid,2,'AMBER',
      'SYNTHETIC-SOURCE','Synthetic Assessor',now()
    );
    raise exception 'T6.36 expected assessed-observation evidence constraint failure';
  exception
    when check_violation then null;
  end;

  insert into mms_governance.metric_observations (
    observation_id,metric_definition_id,value_numeric,threshold_state,
    source_reference,evidence_id,captured_by_role,captured_at
  ) values (
    'MMS-OBS-SYNTHETIC-001',metric_uuid,2,'AMBER',
    'SYNTHETIC-SOURCE',evidence_uuid,'Synthetic Assessor',now()
  ) returning id into obs_uuid;

  begin
    update mms_governance.metric_observations
      set value_numeric=1
      where id=obs_uuid;
    raise exception 'T6.36 expected immutable observation update failure';
  exception
    when raise_exception then
      if sqlerrm <> 'immutable governance record' then raise; end if;
  end;
end $$;

rollback;
