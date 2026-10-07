begin;

do $$
declare
  synthetic_id uuid;
begin
  insert into mms_governance.evidence_artifacts (
    evidence_id,evidence_type,subject_type,subject_reference,source_system,
    source_reference,storage_location,content_digest_sha256,captured_by_role,captured_at
  ) values (
    'MMS-EV-SYNTHETIC-001','TEST_RESULT','CONTROL','SYNTHETIC-CONTROL',
    'Synthetic QA','SYNTHETIC-SOURCE','synthetic://evidence',
    repeat('a',64),'Synthetic Assessor',now()
  )
  returning id into synthetic_id;

  if synthetic_id is null then
    raise exception 'T6.35 synthetic evidence artifact was not created';
  end if;

  begin
    update mms_governance.evidence_artifacts
      set notes='mutation should fail'
      where id=synthetic_id;
    raise exception 'T6.35 expected immutable update failure';
  exception
    when raise_exception then
      if sqlerrm <> 'immutable governance record' then raise; end if;
  end;

  begin
    delete from mms_governance.evidence_artifacts where id=synthetic_id;
    raise exception 'T6.35 expected immutable delete failure';
  exception
    when raise_exception then
      if sqlerrm <> 'immutable governance record' then raise; end if;
  end;
end $$;

rollback;
