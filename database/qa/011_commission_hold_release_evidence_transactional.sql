-- MMS commission hold/release evidence transactional QA.
-- NON-PRODUCTION ONLY. Apply migrations through 0020 first.
-- Validates persisted hold reason, release clearing and exact replay behavior, then rolls back.

begin;

insert into mms_commercial.partners(
  partner_code, crm_record_id, stage, level, selling_enabled, crm_access_enabled,
  agreement_version, agreement_accepted_at, compliance_version, compliance_acknowledged_at, activated_at
) values (
  'MMSP-99990031','99990031','Active','Associate',true,true,
  'QA-AGREEMENT-v1',now()-interval '30 days','QA-COMPLIANCE-v1',now()-interval '30 days',now()-interval '30 days'
);

insert into mms_commercial.leads(
  public_lead_id, registered_by_partner_id, current_partner_id, full_name, email_normalized,
  source, stage, duplicate_status, consent_version, consent_captured_at, registered_at
)
select 'MMSL-QA-HOLD-0001',id,id,'QA Hold Lead','qa-hold@example.invalid',
       'QA','Activated','Clear','MMS-PDPA-MARKETING-2026-08-v1',now()-interval '2 days',now()-interval '2 days'
from mms_commercial.partners where partner_code='MMSP-99990031';

insert into mms_commercial.applications(
  public_application_id,lead_id,partner_id,membership_code,stage,submitted_at,approved_at,activated_at
)
select 'MMSA-QA-HOLD-0001',l.id,p.id,'ASCEND','Activated',now()-interval '2 days',now()-interval '47 hours',now()-interval '1 day'
from mms_commercial.leads l join mms_commercial.partners p on p.partner_code='MMSP-99990031'
where l.public_lead_id='MMSL-QA-HOLD-0001';

insert into mms_commercial.payments(
  public_payment_id,application_id,transaction_reference,amount_minor_units,currency,stage,submitted_at,cleared_at
)
select 'MMSPAY-QA-HOLD-0001',id,'QA-HOLD-TXN-0001',888800,'MYR','Cleared',now()-interval '46 hours',now()-interval '45 hours'
from mms_commercial.applications where public_application_id='MMSA-QA-HOLD-0001';

insert into mms_commercial.memberships(
  public_membership_id,application_id,member_reference,membership_code,status,activated_at
)
select 'MMSM-QA-HOLD-0001',id,'QA-MEMBER-HOLD-0001','ASCEND','Active',now()-interval '1 day'
from mms_commercial.applications where public_application_id='MMSA-QA-HOLD-0001';

insert into mms_commercial.commission_rules(
  version,effective_from,effective_to,rates_by_level,approved_by,approved_at,notes
) values (
  'QA-COMMISSION-HOLD-v1',now()-interval '10 days',now()+interval '10 days',
  '{"Associate":0.10,"Senior":0.10,"Elite":0.10,"Chairman":0.10}'::jsonb,
  'qa-finance',now()-interval '10 days','Synthetic hold/release QA rule.'
);

insert into mms_commercial.commission_transactions(
  public_transaction_id,partner_id,application_id,payment_id,membership_id,member_reference,membership_code,
  payment_transaction_reference,currency,eligible_revenue_minor_units,commission_rule_id,commission_rule_version,
  partner_level_at_eligibility,commission_rate,gross_commission_minor_units,adjustment_minor_units,
  approved_commission_minor_units,status,eligibility_checked_by,eligibility_checked_at
)
select 'MMSC-QA-HOLD-0001',p.id,a.id,pay.id,m.id,m.member_reference,m.membership_code,
       pay.transaction_reference,pay.currency,pay.amount_minor_units,r.id,r.version,
       'Associate',0.10,88880,0,0,'Eligible','qa-eligibility',now()-interval '20 hours'
from mms_commercial.partners p
join mms_commercial.applications a on a.partner_id=p.id and a.public_application_id='MMSA-QA-HOLD-0001'
join mms_commercial.payments pay on pay.application_id=a.id
join mms_commercial.memberships m on m.application_id=a.id
join mms_commercial.commission_rules r on r.version='QA-COMMISSION-HOLD-v1'
where p.partner_code='MMSP-99990031';

do $$
declare
  v_hold_at timestamptz := now()-interval '18 hours';
  v_release_at timestamptz := now()-interval '17 hours';
  v_hold_reason text;
  v_status text;
  v_events integer;
begin
  perform mms_commercial.transition_commission(
    'MMSC-QA-HOLD-0001','Eligible','Held','qa-finance',v_hold_at,'QA evidence hold.',
    null,null,null,null
  );

  select status,hold_reason into v_status,v_hold_reason
  from mms_commercial.commission_transactions where public_transaction_id='MMSC-QA-HOLD-0001';
  if v_status <> 'Held' or v_hold_reason <> 'QA evidence hold.' then
    raise exception 'QA failure: hold evidence not persisted';
  end if;

  -- Exact retry must be a no-op and must not duplicate the immutable event.
  perform mms_commercial.transition_commission(
    'MMSC-QA-HOLD-0001','Eligible','Held','qa-finance',v_hold_at,'QA evidence hold.',
    null,null,null,null
  );

  perform mms_commercial.transition_commission(
    'MMSC-QA-HOLD-0001','Held','Eligible','qa-finance',v_release_at,'QA evidence release.',
    null,null,null,null
  );

  select status,hold_reason into v_status,v_hold_reason
  from mms_commercial.commission_transactions where public_transaction_id='MMSC-QA-HOLD-0001';
  if v_status <> 'Eligible' or v_hold_reason is not null then
    raise exception 'QA failure: hold reason not cleared on release';
  end if;

  -- Exact release retry must also be a no-op.
  perform mms_commercial.transition_commission(
    'MMSC-QA-HOLD-0001','Held','Eligible','qa-finance',v_release_at,'QA evidence release.',
    null,null,null,null
  );

  select count(*) into v_events
  from mms_commercial.commission_events e
  join mms_commercial.commission_transactions c on c.id=e.commission_transaction_id
  where c.public_transaction_id='MMSC-QA-HOLD-0001';
  if v_events <> 2 then raise exception 'QA failure: expected 2 hold/release events, got %',v_events; end if;

  begin
    perform mms_commercial.transition_commission(
      'MMSC-QA-HOLD-0001','Held','Eligible','qa-other',v_release_at,'Different release evidence.',
      null,null,null,null
    );
    raise exception 'QA failure: conflicting release replay was accepted';
  exception when others then
    if position('commission_transition_replay_conflict' in sqlerrm)=0 then raise; end if;
  end;
end;
$$;

rollback;
