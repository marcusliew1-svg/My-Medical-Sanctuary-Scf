-- MMS transactional QA for migrations 0015-0016.
-- NON-PRODUCTION ONLY. Apply migrations through 0016 first.
-- Validates commission provenance evidence and certification-time ownership gating.
-- Rolls back all synthetic rows on success.

begin;

insert into mms_commercial.partners(
  partner_code, crm_record_id, stage, level, selling_enabled, crm_access_enabled,
  agreement_version, agreement_accepted_at, compliance_version, compliance_acknowledged_at, activated_at
) values
  ('MMSP-99990031','99990031','Active','Associate',true,true,
   'QA-AGREEMENT-v1',now()-interval '30 days','QA-COMPLIANCE-v1',now()-interval '30 days',now()-interval '30 days'),
  ('MMSP-99990032','99990032','Active','Senior',true,true,
   'QA-AGREEMENT-v1',now()-interval '30 days','QA-COMPLIANCE-v1',now()-interval '30 days',now()-interval '30 days');

insert into mms_commercial.partner_certifications(
  partner_id, certification_version, issued_at, renewal_due_at, expires_at, issued_by
)
select id,'MMS-SP-CERT-QA-0015-v1',now()-interval '30 days',now()+interval '245 days',now()+interval '335 days','qa-suite'
from mms_commercial.partners where partner_code='MMSP-99990031';

-- Destination Partner has a certification that is valid in the future but not yet issued at the attempted transfer time.
insert into mms_commercial.partner_certifications(
  partner_id, certification_version, issued_at, renewal_due_at, expires_at, issued_by
)
select id,'MMS-SP-CERT-QA-FUTURE-v1',now()+interval '1 hour',now()+interval '246 days',now()+interval '336 days','qa-suite'
from mms_commercial.partners where partner_code='MMSP-99990032';

insert into mms_commercial.leads(
  public_lead_id, registered_by_partner_id, current_partner_id, full_name, email_normalized,
  source, stage, duplicate_status, consent_version, consent_captured_at, registered_at, last_activity_at
)
select 'MMSL-QA-HARDENING-0001',id,id,'QA Hardening Lead','qa-hardening@example.invalid',
       'QA','Qualified','Clear','MMS-PDPA-MARKETING-2026-08-v1',now()-interval '3 hours',now()-interval '3 hours',now()-interval '2 hours'
from mms_commercial.partners where partner_code='MMSP-99990031';

-- Migration 0016: future-issued certification must not qualify a destination Partner.
do $$
begin
  begin
    perform public_lead_id
    from mms_commercial.transfer_lead_ownership(
      'MMSL-QA-HARDENING-0001','MMSP-99990031','MMSP-99990032','qa-routing',now(),'QA future-certification rejection.'
    );
    raise exception 'QA failure: future-issued certification qualified for lead transfer';
  exception when others then
    if position('new_partner_certification_not_current' in sqlerrm)=0 then raise; end if;
  end;
end;
$$;

-- Add a certification that is actually current, then transfer succeeds.
insert into mms_commercial.partner_certifications(
  partner_id, certification_version, issued_at, renewal_due_at, expires_at, issued_by
)
select id,'MMS-SP-CERT-QA-CURRENT-v1',now()-interval '1 day',now()+interval '245 days',now()+interval '335 days','qa-suite'
from mms_commercial.partners where partner_code='MMSP-99990032';

select * from mms_commercial.transfer_lead_ownership(
  'MMSL-QA-HARDENING-0001','MMSP-99990031','MMSP-99990032','qa-routing',now(),'QA current-certification transfer.'
);

-- Build an activated commercial chain attributed to Partner 32.
insert into mms_commercial.applications(public_application_id,lead_id,partner_id,membership_code,stage,submitted_at,approved_at,activated_at)
select 'MMSA-QA-HARDENING-0001',l.id,p.id,'ASCEND','Activated',now()-interval '90 minutes',now()-interval '80 minutes',now()-interval '60 minutes'
from mms_commercial.leads l join mms_commercial.partners p on p.partner_code='MMSP-99990032'
where l.public_lead_id='MMSL-QA-HARDENING-0001';

insert into mms_commercial.payments(public_payment_id,application_id,transaction_reference,amount_minor_units,currency,stage,submitted_at,cleared_at)
select 'MMSPAY-QA-HARDENING-0001',id,'QA-HARDENING-TXN-0001',888800,'MYR','Cleared',now()-interval '75 minutes',now()-interval '70 minutes'
from mms_commercial.applications where public_application_id='MMSA-QA-HARDENING-0001';

insert into mms_commercial.payment_verifications(payment_id,verified_by,verified_at,cleared_amount_minor_units,currency,source,source_reference)
select id,'qa-finance',cleared_at,amount_minor_units,currency,'Finance Manual Review','QA-HARDENING-VERIFY-0001'
from mms_commercial.payments where public_payment_id='MMSPAY-QA-HARDENING-0001';

insert into mms_commercial.memberships(public_membership_id,application_id,member_reference,membership_code,status,activated_at)
select 'MMSM-QA-HARDENING-0001',id,'QA-MEMBER-HARDENING-0001','ASCEND','Active',now()-interval '60 minutes'
from mms_commercial.applications where public_application_id='MMSA-QA-HARDENING-0001';

insert into mms_commercial.commission_rules(version,effective_from,effective_to,rates_by_level,approved_by,approved_at,notes)
values('QA-COMMISSION-RULE-HARDENING-v1',now()-interval '10 days',now()+interval '10 days',
       '{"Associate":0.10,"Senior":0.10,"Elite":0.10,"Chairman":0.10}'::jsonb,
       'qa-finance',now()-interval '10 days','Synthetic non-production rule for migrations 0015-0016 QA only.');

-- Migration 0015: duplicate clearance is independently required at commission creation time.
update mms_commercial.leads set duplicate_status='Possible Duplicate' where public_lead_id='MMSL-QA-HARDENING-0001';
do $$
begin
  begin
    perform public_transaction_id from mms_commercial.create_eligible_commission('MMSA-QA-HARDENING-0001','qa-eligibility',now());
    raise exception 'QA failure: commission created without Clear duplicate status';
  exception when others then
    if position('lead_duplicate_clearance_required' in sqlerrm)=0 then raise; end if;
  end;
end;
$$;
update mms_commercial.leads set duplicate_status='Clear' where public_lead_id='MMSL-QA-HARDENING-0001';

-- Migration 0015: accepted agreement evidence is independently required.
update mms_commercial.partners set agreement_accepted_at=null where partner_code='MMSP-99990032';
do $$
begin
  begin
    perform public_transaction_id from mms_commercial.create_eligible_commission('MMSA-QA-HARDENING-0001','qa-eligibility',now());
    raise exception 'QA failure: commission created without accepted agreement evidence';
  exception when others then
    if position('partner_not_commission_eligible' in sqlerrm)=0 then raise; end if;
  end;
end;
$$;
update mms_commercial.partners set agreement_accepted_at=now()-interval '30 days' where partner_code='MMSP-99990032';

-- Fully valid provenance now succeeds.
do $$
declare
  v_transaction text;
  v_replayed boolean;
begin
  select public_transaction_id,replayed into v_transaction,v_replayed
  from mms_commercial.create_eligible_commission('MMSA-QA-HARDENING-0001','qa-eligibility',now());
  if v_transaction is null or v_replayed then raise exception 'QA failure: valid commission eligibility did not create a new transaction'; end if;
end;
$$;

rollback;
