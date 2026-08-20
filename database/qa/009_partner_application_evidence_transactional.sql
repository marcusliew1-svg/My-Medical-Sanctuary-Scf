-- MMS Partner application evidence transactional QA.
-- NON-PRODUCTION ONLY. Apply migrations through 0018 first.
-- Validates duplicate-clearance and Partner agreement/compliance evidence gates.
-- Rolls back all synthetic rows on success.

begin;

insert into mms_commercial.partners(
  partner_code, crm_record_id, stage, level, selling_enabled, crm_access_enabled,
  agreement_version, agreement_accepted_at, compliance_version, compliance_acknowledged_at,
  activated_at
) values (
  'MMSP-99990041','99990041','Active','Associate',true,true,
  'QA-AGREEMENT-v1',now()-interval '30 days','QA-COMPLIANCE-v1',now()-interval '30 days',now()-interval '30 days'
);

insert into mms_commercial.partner_certifications(
  partner_id, certification_version, issued_at, renewal_due_at, expires_at, issued_by
)
select id,'MMS-SP-CERT-QA-APP-v1',now()-interval '30 days',now()+interval '245 days',now()+interval '335 days','qa-suite'
from mms_commercial.partners where partner_code='MMSP-99990041';

insert into mms_commercial.leads(
  public_lead_id, registered_by_partner_id, current_partner_id, full_name, email_normalized,
  source, stage, duplicate_status, consent_version, consent_captured_at, registered_at, last_activity_at
)
select 'MMSL-QA-APP-EVIDENCE-0001',id,id,'QA Application Evidence Lead','qa-application-evidence@example.invalid',
       'QA','Qualified','Possible Duplicate','MMS-PDPA-MARKETING-2026-08-v1',now()-interval '2 hours',now()-interval '2 hours',now()-interval '1 hour'
from mms_commercial.partners where partner_code='MMSP-99990041';

-- Duplicate clearance must be independently enforced at application submission time.
do $$
begin
  begin
    perform public_application_id
    from mms_commercial.submit_partner_application(
      repeat('e',64),'MMSP-99990041','MMSL-QA-APP-EVIDENCE-0001','ASCEND',now()-interval '5 minutes'
    );
    raise exception 'QA failure: application submitted without Clear duplicate status';
  exception when others then
    if position('lead_duplicate_clearance_required' in sqlerrm)=0 then raise; end if;
  end;
end;
$$;

update mms_commercial.leads
set duplicate_status='Clear'
where public_lead_id='MMSL-QA-APP-EVIDENCE-0001';

-- Accepted Partner agreement evidence must exist at or before submission time.
update mms_commercial.partners
set agreement_accepted_at=null
where partner_code='MMSP-99990041';

do $$
begin
  begin
    perform public_application_id
    from mms_commercial.submit_partner_application(
      repeat('f',64),'MMSP-99990041','MMSL-QA-APP-EVIDENCE-0001','ASCEND',now()-interval '5 minutes'
    );
    raise exception 'QA failure: application submitted without accepted agreement evidence';
  exception when others then
    if position('partner_not_eligible_to_submit_application' in sqlerrm)=0 then raise; end if;
  end;
end;
$$;

update mms_commercial.partners
set agreement_accepted_at=now()-interval '30 days'
where partner_code='MMSP-99990041';

-- Compliance acknowledgement must also exist at or before submission time.
update mms_commercial.partners
set compliance_acknowledged_at=null
where partner_code='MMSP-99990041';

do $$
begin
  begin
    perform public_application_id
    from mms_commercial.submit_partner_application(
      repeat('g',64),'MMSP-99990041','MMSL-QA-APP-EVIDENCE-0001','ASCEND',now()-interval '5 minutes'
    );
    raise exception 'QA failure: application submitted without compliance acknowledgement';
  exception when others then
    if position('partner_not_eligible_to_submit_application' in sqlerrm)=0 then raise; end if;
  end;
end;
$$;

update mms_commercial.partners
set compliance_acknowledged_at=now()-interval '30 days'
where partner_code='MMSP-99990041';

-- Fully valid evidence succeeds, and exact idempotency replay returns the same application.
do $$
declare
  v_application text;
  v_replay_application text;
  v_replayed boolean;
begin
  select public_application_id into v_application
  from mms_commercial.submit_partner_application(
    repeat('h',64),'MMSP-99990041','MMSL-QA-APP-EVIDENCE-0001','ASCEND',now()-interval '5 minutes'
  );

  select public_application_id,replayed into v_replay_application,v_replayed
  from mms_commercial.submit_partner_application(
    repeat('h',64),'MMSP-99990041','MMSL-QA-APP-EVIDENCE-0001','ASCEND',now()-interval '5 minutes'
  );

  if v_application is null then raise exception 'QA failure: valid application returned no ID'; end if;
  if v_replay_application <> v_application then raise exception 'QA failure: replay returned a different application'; end if;
  if v_replayed is not true then raise exception 'QA failure: exact application replay was not marked replayed'; end if;
end;
$$;

rollback;
