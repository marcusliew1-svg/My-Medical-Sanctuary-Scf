-- MMS Partner lead-registration eligibility transactional QA.
-- NON-PRODUCTION ONLY. Apply migrations through 0017 first.
-- This script validates Partner registration gating and rolls back all synthetic rows.

begin;

insert into mms_commercial.partners(
  partner_code, crm_record_id, stage, level, selling_enabled, crm_access_enabled,
  agreement_version, agreement_accepted_at, compliance_version, compliance_acknowledged_at,
  activated_at
) values (
  'MMSP-99990031','99990031','Active','Associate',true,true,
  'QA-AGREEMENT-v1',now()-interval '30 days','QA-COMPLIANCE-v1',now()-interval '30 days',now()-interval '30 days'
);

-- A future-issued certification must not qualify the Partner for a registration timestamp before issue.
insert into mms_commercial.partner_certifications(
  partner_id, certification_version, issued_at, renewal_due_at, expires_at, issued_by
)
select id,'MMS-SP-CERT-QA-FUTURE-v1',now()+interval '1 day',now()+interval '245 days',now()+interval '335 days','qa-suite'
from mms_commercial.partners
where partner_code='MMSP-99990031';

do $$
begin
  begin
    perform public_lead_id
    from mms_commercial.register_partner_lead(
      repeat('b',64),'MMSP-99990031','QA Future Cert Lead','qa-future-cert@example.invalid',null,
      'QA','Lead registration eligibility','MMS-PDPA-MARKETING-2026-08-v1',
      now()-interval '10 minutes',now()-interval '5 minutes'
    );
    raise exception 'QA failure: future-issued certification allowed lead registration';
  exception when others then
    if position('partner_certification_not_current' in sqlerrm)=0 then raise; end if;
  end;
end;
$$;

-- Replace the future certification with a certification issued before registration time.
delete from mms_commercial.partner_certifications c
using mms_commercial.partners p
where c.partner_id=p.id and p.partner_code='MMSP-99990031';

insert into mms_commercial.partner_certifications(
  partner_id, certification_version, issued_at, renewal_due_at, expires_at, issued_by
)
select id,'MMS-SP-CERT-QA-CURRENT-v1',now()-interval '30 days',now()+interval '245 days',now()+interval '335 days','qa-suite'
from mms_commercial.partners
where partner_code='MMSP-99990031';

-- CRM access is a mandatory database-level gate.
update mms_commercial.partners
set crm_access_enabled=false
where partner_code='MMSP-99990031';

do $$
begin
  begin
    perform public_lead_id
    from mms_commercial.register_partner_lead(
      repeat('c',64),'MMSP-99990031','QA CRM Gate Lead','qa-crm-gate@example.invalid',null,
      'QA','Lead registration eligibility','MMS-PDPA-MARKETING-2026-08-v1',
      now()-interval '10 minutes',now()-interval '5 minutes'
    );
    raise exception 'QA failure: CRM-disabled Partner registered a lead';
  exception when others then
    if position('partner_not_lead_registration_eligible' in sqlerrm)=0 then raise; end if;
  end;
end;
$$;

update mms_commercial.partners
set crm_access_enabled=true
where partner_code='MMSP-99990031';

-- Valid registration succeeds and exact idempotency replay returns the same lead.
do $$
declare
  v_lead text;
  v_replay_lead text;
  v_replayed boolean;
begin
  select public_lead_id into v_lead
  from mms_commercial.register_partner_lead(
    repeat('d',64),'MMSP-99990031','QA Valid Lead','qa-valid-registration@example.invalid',null,
    'QA','Lead registration eligibility','MMS-PDPA-MARKETING-2026-08-v1',
    now()-interval '10 minutes',now()-interval '5 minutes'
  );

  select public_lead_id,replayed into v_replay_lead,v_replayed
  from mms_commercial.register_partner_lead(
    repeat('d',64),'MMSP-99990031','QA Valid Lead','qa-valid-registration@example.invalid',null,
    'QA','Lead registration eligibility','MMS-PDPA-MARKETING-2026-08-v1',
    now()-interval '10 minutes',now()-interval '5 minutes'
  );

  if v_lead is null then raise exception 'QA failure: valid lead registration returned no lead'; end if;
  if v_replay_lead <> v_lead then raise exception 'QA failure: idempotency replay returned different lead'; end if;
  if v_replayed is not true then raise exception 'QA failure: exact registration replay was not marked replayed'; end if;
end;
$$;

-- Persisted state assertions.
do $$
declare
  v_count integer;
  v_stage text;
  v_duplicate text;
  v_owner text;
begin
  select count(*) into v_count
  from mms_commercial.leads
  where email_normalized='qa-valid-registration@example.invalid';

  select l.stage,l.duplicate_status,p.partner_code
    into v_stage,v_duplicate,v_owner
  from mms_commercial.leads l
  join mms_commercial.partners p on p.id=l.current_partner_id
  where l.email_normalized='qa-valid-registration@example.invalid';

  if v_count <> 1 then raise exception 'QA failure: valid registration row count %',v_count; end if;
  if v_stage <> 'Registered' then raise exception 'QA failure: lead stage %',v_stage; end if;
  if v_duplicate <> 'Unchecked' then raise exception 'QA failure: duplicate status %',v_duplicate; end if;
  if v_owner <> 'MMSP-99990031' then raise exception 'QA failure: current owner %',v_owner; end if;
end;
$$;

rollback;
