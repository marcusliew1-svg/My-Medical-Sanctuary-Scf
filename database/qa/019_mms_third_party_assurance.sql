-- T6.28 transactional assurance checks. Must roll back all synthetic data.

begin;

do $$
declare
  synthetic_id uuid;
begin
  insert into mms_governance.third_party_assessments (
    third_party_id, legal_name, category, criticality, data_access_class,
    status, owner_role
  ) values (
    'MMS-TP-SYNTHETIC-001', 'Synthetic QA Vendor', 'SAAS_APPLICATION',
    'HIGH', 'PERSONAL', 'DUE_DILIGENCE', 'Technology'
  )
  returning id into synthetic_id;

  if synthetic_id is null then
    raise exception 'T6.28 synthetic third-party row was not created';
  end if;

  begin
    update mms_governance.third_party_assessments
      set status = 'APPROVED'
      where id = synthetic_id;
    raise exception 'T6.28 expected approval-evidence constraint failure';
  exception
    when check_violation then null;
  end;

  update mms_governance.third_party_assessments
    set due_diligence_reference = 'SYNTHETIC-DD-001',
        approval_reference = 'SYNTHETIC-APPROVAL-001',
        assessed_at = now(),
        status = 'APPROVED'
    where id = synthetic_id;

  if not exists (
    select 1 from mms_governance.third_party_assessments
    where id = synthetic_id and status = 'APPROVED'
  ) then
    raise exception 'T6.28 evidenced approval transition failed';
  end if;
end $$;

rollback;
