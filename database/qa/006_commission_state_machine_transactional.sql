-- MMS commission-state transactional QA.
-- NON-PRODUCTION ONLY. Apply migrations through 0014 first.
-- This script validates the persisted commission state machine and rolls back all synthetic rows.

begin;

insert into mms_commercial.partners(
  partner_code, crm_record_id, stage, level, selling_enabled, crm_access_enabled,
  agreement_version, agreement_accepted_at, compliance_version, compliance_acknowledged_at, activated_at
) values (
  'MMSP-99990021','99990021','Active','Associate',true,true,
  'QA-AGREEMENT-v1',now()-interval '30 days','QA-COMPLIANCE-v1',now()-interval '30 days',now()-interval '30 days'
);

insert into mms_commercial.leads(
  public_lead_id, registered_by_partner_id, current_partner_id, full_name, email_normalized,
  source, stage, duplicate_status, consent_version, consent_captured_at, registered_at, last_activity_at
)
select 'MMSL-QA-COMMISSION-0001',id,id,'QA Commission Lead','qa-commission@example.invalid',
       'QA','Activated','Clear','MMS-PDPA-MARKETING-2026-08-v1',now()-interval '2 days',now()-interval '2 days',now()-interval '1 day'
from mms_commercial.partners where partner_code='MMSP-99990021';

insert into mms_commercial.applications(
  public_application_id,lead_id,partner_id,membership_code,stage,submitted_at,approved_at,activated_at
)
select 'MMSA-QA-COMMISSION-0001',l.id,p.id,'ASCEND','Activated',now()-interval '2 days',now()-interval '1 day 23 hours',now()-interval '1 day'
from mms_commercial.leads l
join mms_commercial.partners p on p.partner_code='MMSP-99990021'
where l.public_lead_id='MMSL-QA-COMMISSION-0001';

insert into mms_commercial.payments(
  public_payment_id,application_id,transaction_reference,amount_minor_units,currency,stage,submitted_at,cleared_at
)
select 'MMSPAY-QA-COMMISSION-0001',id,'QA-COMMISSION-TXN-0001',888800,'MYR','Cleared',now()-interval '1 day 22 hours',now()-interval '1 day 21 hours'
from mms_commercial.applications where public_application_id='MMSA-QA-COMMISSION-0001';

insert into mms_commercial.memberships(
  public_membership_id,application_id,member_reference,membership_code,status,activated_at
)
select 'MMSM-QA-COMMISSION-0001',id,'QA-MEMBER-COMMISSION-0001','ASCEND','Active',now()-interval '1 day'
from mms_commercial.applications where public_application_id='MMSA-QA-COMMISSION-0001';

insert into mms_commercial.commission_rules(
  version,effective_from,effective_to,rates_by_level,approved_by,approved_at,notes
) values (
  'QA-COMMISSION-RULE-STATE-v1',now()-interval '10 days',now()+interval '10 days',
  '{"Associate":0.10,"Senior":0.10,"Elite":0.10,"Chairman":0.10}'::jsonb,
  'qa-finance',now()-interval '10 days','Synthetic non-production rule for commission state-machine QA only.'
);

insert into mms_commercial.commission_transactions(
  public_transaction_id,partner_id,application_id,payment_id,membership_id,member_reference,membership_code,
  payment_transaction_reference,currency,eligible_revenue_minor_units,commission_rule_id,commission_rule_version,
  partner_level_at_eligibility,commission_rate,gross_commission_minor_units,adjustment_minor_units,
  approved_commission_minor_units,status,eligibility_checked_by,eligibility_checked_at
)
select 'MMSC-QA-STATE-0001',p.id,a.id,pay.id,m.id,m.member_reference,m.membership_code,
       pay.transaction_reference,pay.currency,pay.amount_minor_units,r.id,r.version,
       'Associate',0.10,88880,0,0,'Eligible','qa-eligibility',now()-interval '20 hours'
from mms_commercial.partners p
join mms_commercial.applications a on a.partner_id=p.id and a.public_application_id='MMSA-QA-COMMISSION-0001'
join mms_commercial.payments pay on pay.application_id=a.id
join mms_commercial.memberships m on m.application_id=a.id
join mms_commercial.commission_rules r on r.version='QA-COMMISSION-RULE-STATE-v1'
where p.partner_code='MMSP-99990021';

-- Eligible cannot jump directly to Paid.
do $$
begin
  begin
    perform mms_commercial.transition_commission(
      'MMSC-QA-STATE-0001','Eligible','Paid','qa-finance',now()-interval '19 hours','Invalid direct payout.',
      null,'QA-BATCH-INVALID','QA-PAYOUT-INVALID',null
    );
    raise exception 'QA failure: Eligible commission moved directly to Paid';
  exception when others then
    if position('commission_transition_not_allowed' in sqlerrm)=0 then raise; end if;
  end;
end;
$$;

select mms_commercial.transition_commission(
  'MMSC-QA-STATE-0001','Eligible','Held','qa-finance',now()-interval '18 hours','QA compliance hold.',
  null,null,null,null
);

-- Held commission must be released before approval.
do $$
begin
  begin
    perform mms_commercial.transition_commission(
      'MMSC-QA-STATE-0001','Held','Approved','qa-finance-approver',now()-interval '17 hours','Invalid approval while held.',
      88880,null,null,null
    );
    raise exception 'QA failure: Held commission was approved without release';
  exception when others then
    if position('commission_transition_not_allowed' in sqlerrm)=0 then raise; end if;
  end;
end;
$$;

select mms_commercial.transition_commission(
  'MMSC-QA-STATE-0001','Held','Eligible','qa-finance',now()-interval '16 hours','QA hold released.',
  null,null,null,null
);

select mms_commercial.transition_commission(
  'MMSC-QA-STATE-0001','Eligible','Approved','qa-finance-approver',now()-interval '15 hours','QA payout approved after hold release.',
  88880,null,null,null
);

select mms_commercial.transition_commission(
  'MMSC-QA-STATE-0001','Approved','Paid','qa-finance-payer',now()-interval '14 hours','QA payout completed.',
  null,'QA-BATCH-0001','QA-PAYOUT-0001',null
);

-- Paid commission cannot be reversed with a partial clawback.
do $$
begin
  begin
    perform mms_commercial.transition_commission(
      'MMSC-QA-STATE-0001','Paid','Reversed','qa-finance',now()-interval '12 hours','QA cancellation reversal.',
      null,null,null,44440
    );
    raise exception 'QA failure: Paid commission accepted a partial clawback';
  exception when others then
    if position('paid_commission_requires_full_clawback' in sqlerrm)=0 then raise; end if;
  end;
end;
$$;

select mms_commercial.transition_commission(
  'MMSC-QA-STATE-0001','Paid','Reversed','qa-finance',now()-interval '10 hours','QA cancellation reversal.',
  null,null,null,88880
);

do $$
declare
  v_status text;
  v_approved bigint;
  v_clawback bigint;
  v_batch text;
  v_payout text;
  v_events integer;
begin
  select status,approved_commission_minor_units,clawback_minor_units,payout_batch_id,payout_reference
    into v_status,v_approved,v_clawback,v_batch,v_payout
  from mms_commercial.commission_transactions
  where public_transaction_id='MMSC-QA-STATE-0001';

  select count(*) into v_events
  from mms_commercial.commission_events e
  join mms_commercial.commission_transactions c on c.id=e.commission_transaction_id
  where c.public_transaction_id='MMSC-QA-STATE-0001';

  if v_status <> 'Reversed' then raise exception 'QA failure: final status %',v_status; end if;
  if v_approved <> 88880 then raise exception 'QA failure: approved amount %',v_approved; end if;
  if v_clawback <> 88880 then raise exception 'QA failure: clawback %',v_clawback; end if;
  if v_batch <> 'QA-BATCH-0001' or v_payout <> 'QA-PAYOUT-0001' then
    raise exception 'QA failure: payout evidence not retained';
  end if;
  if v_events <> 5 then raise exception 'QA failure: commission event count %',v_events; end if;
end;
$$;

rollback;
