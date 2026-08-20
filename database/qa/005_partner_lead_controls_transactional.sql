-- MMS Partner Hub transactional QA for duplicate review, lead lifecycle and ownership transfer.
-- NON-PRODUCTION ONLY. Apply migrations through 0013 first.
-- This script rolls back all synthetic data on success.

begin;

insert into mms_commercial.partners(
  partner_code, crm_record_id, stage, level, selling_enabled, crm_access_enabled,
  agreement_version, agreement_accepted_at, compliance_version, compliance_acknowledged_at,
  activated_at
) values
  ('MMSP-99990011','99990011','Active','Associate',true,true,
   'QA-AGREEMENT-v1',now()-interval '30 days','QA-COMPLIANCE-v1',now()-interval '30 days',now()-interval '30 days'),
  ('MMSP-99990012','99990012','Active','Senior',true,true,
   'QA-AGREEMENT-v1',now()-interval '30 days','QA-COMPLIANCE-v1',now()-interval '30 days',now()-interval '30 days');

insert into mms_commercial.partner_certifications(
  partner_id, certification_version, issued_at, renewal_due_at, expires_at, issued_by
)
select id,'MMS-SP-CERT-QA-v1',now()-interval '30 days',now()+interval '245 days',now()+interval '335 days','qa-suite'
from mms_commercial.partners
where partner_code in ('MMSP-99990011','MMSP-99990012');

insert into mms_commercial.leads(
  public_lead_id, registered_by_partner_id, current_partner_id, full_name,
  email_normalized, source, campaign, stage, duplicate_status,
  consent_version, consent_captured_at, registered_at, last_activity_at
)
select
  'MMSL-QA-LIFECYCLE-0001', p.id, p.id, 'QA Commercial Lead',
  'qa-lifecycle@example.invalid', 'QA', 'Lifecycle controls', 'Registered', 'Unchecked',
  'MMS-PDPA-MARKETING-2026-08-v1', now()-interval '2 hours', now()-interval '2 hours', now()-interval '2 hours'
from mms_commercial.partners p
where p.partner_code='MMSP-99990011';

-- An Unchecked lead must not progress.
do $$
begin
  begin
    perform public_lead_id
    from mms_commercial.transition_partner_lead_stage(
      'MMSP-99990011','MMSL-QA-LIFECYCLE-0001','Registered','Accepted',now()-interval '100 minutes',now()-interval '80 minutes'
    );
    raise exception 'QA failure: Unchecked lead was allowed to progress';
  exception when others then
    if position('lead_duplicate_review_not_clear' in sqlerrm)=0 then
      raise;
    end if;
  end;
end;
$$;

select * from mms_commercial.review_lead_duplicate_status(
  'MMSL-QA-LIFECYCLE-0001','Clear','{}'::text[],'qa-duplicate-review',now()-interval '95 minutes'
);

select * from mms_commercial.transition_partner_lead_stage(
  'MMSP-99990011','MMSL-QA-LIFECYCLE-0001','Registered','Accepted',now()-interval '90 minutes',now()-interval '70 minutes'
);
select * from mms_commercial.transition_partner_lead_stage(
  'MMSP-99990011','MMSL-QA-LIFECYCLE-0001','Accepted','Contacted',now()-interval '60 minutes',now()-interval '40 minutes'
);
select * from mms_commercial.transition_partner_lead_stage(
  'MMSP-99990011','MMSL-QA-LIFECYCLE-0001','Contacted','Qualified',now()-interval '30 minutes',now()-interval '10 minutes'
);

-- A stale expected-stage update must fail.
do $$
begin
  begin
    perform public_lead_id
    from mms_commercial.transition_partner_lead_stage(
      'MMSP-99990011','MMSL-QA-LIFECYCLE-0001','Registered','Accepted',now()-interval '20 minutes',null
    );
    raise exception 'QA failure: stale expected lead stage was accepted';
  exception when others then
    if position('lead_stage_conflict' in sqlerrm)=0 then
      raise;
    end if;
  end;
end;
$$;

select * from mms_commercial.transfer_lead_ownership(
  'MMSL-QA-LIFECYCLE-0001','MMSP-99990011','MMSP-99990012','qa-routing',now()-interval '8 minutes','QA ownership transfer before application.'
);

-- Exact transfer replay must be safe.
do $$
declare
  v_replayed boolean;
begin
  select replayed into v_replayed
  from mms_commercial.transfer_lead_ownership(
    'MMSL-QA-LIFECYCLE-0001','MMSP-99990011','MMSP-99990012','qa-routing',now()-interval '8 minutes','QA ownership transfer before application.'
  );
  if v_replayed is not true then
    raise exception 'QA failure: exact ownership transfer replay was not reported as replayed';
  end if;
end;
$$;

select * from mms_commercial.submit_partner_application(
  repeat('a',64),'MMSP-99990012','MMSL-QA-LIFECYCLE-0001','ASCEND',now()-interval '5 minutes'
);

-- Ownership becomes immutable after application creation.
do $$
begin
  begin
    perform public_lead_id
    from mms_commercial.transfer_lead_ownership(
      'MMSL-QA-LIFECYCLE-0001','MMSP-99990012','MMSP-99990011','qa-routing',now()-interval '2 minutes','QA transfer should be blocked after application.'
    );
    raise exception 'QA failure: ownership changed after application attribution';
  exception when others then
    if position('lead_ownership_locked_after_application' in sqlerrm)=0 then
      raise;
    end if;
  end;
end;
$$;

-- Final state assertions.
do $$
declare
  v_stage text;
  v_duplicate text;
  v_owner text;
  v_app_stage text;
  v_ownership_events integer;
  v_lifecycle_events integer;
begin
  select l.stage,l.duplicate_status,p.partner_code
    into v_stage,v_duplicate,v_owner
  from mms_commercial.leads l
  join mms_commercial.partners p on p.id=l.current_partner_id
  where l.public_lead_id='MMSL-QA-LIFECYCLE-0001';

  select a.stage into v_app_stage
  from mms_commercial.applications a
  join mms_commercial.leads l on l.id=a.lead_id
  where l.public_lead_id='MMSL-QA-LIFECYCLE-0001';

  select count(*) into v_ownership_events
  from mms_commercial.lead_ownership_events e
  join mms_commercial.leads l on l.id=e.lead_id
  where l.public_lead_id='MMSL-QA-LIFECYCLE-0001';

  select count(*) into v_lifecycle_events
  from mms_commercial.lead_lifecycle_events e
  join mms_commercial.leads l on l.id=e.lead_id
  where l.public_lead_id='MMSL-QA-LIFECYCLE-0001';

  if v_duplicate <> 'Clear' then raise exception 'QA failure: duplicate status %',v_duplicate; end if;
  if v_stage <> 'Application' then raise exception 'QA failure: lead stage %',v_stage; end if;
  if v_owner <> 'MMSP-99990012' then raise exception 'QA failure: owner %',v_owner; end if;
  if v_app_stage <> 'Submitted' then raise exception 'QA failure: application stage %',v_app_stage; end if;
  if v_ownership_events <> 1 then raise exception 'QA failure: ownership event count %',v_ownership_events; end if;
  if v_lifecycle_events <> 4 then raise exception 'QA failure: lifecycle event count %',v_lifecycle_events; end if;
end;
$$;

rollback;
