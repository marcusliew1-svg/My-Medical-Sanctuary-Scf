-- MMS Partner lead registration eligibility hardening.
-- Apply only to the dedicated MMS commercial database after migration 0016.
-- Commercial lead registration only. No clinical/patient data is accepted here.

begin;

create or replace function mms_commercial.register_partner_lead(
  p_idempotency_key_hash text,
  p_partner_code text,
  p_full_name text,
  p_email_normalized text,
  p_phone_normalized text,
  p_source text,
  p_campaign text,
  p_consent_version text,
  p_consent_captured_at timestamptz,
  p_registered_at timestamptz
)
returns table(public_lead_id text, replayed boolean)
language plpgsql
security definer
set search_path = mms_commercial, pg_temp
as $$
declare
  v_partner mms_commercial.partners%rowtype;
  v_existing_resource text;
  v_lead_id uuid;
  v_public_lead_id text;
  v_contact_lock text;
begin
  if p_idempotency_key_hash is null or length(trim(p_idempotency_key_hash)) < 32 then
    raise exception using errcode = '22023', message = 'invalid_idempotency_key';
  end if;
  if p_partner_code is null or upper(trim(p_partner_code)) !~ '^MMSP-[0-9]{4,}$' then
    raise exception using errcode = '22023', message = 'invalid_partner_code';
  end if;
  if p_full_name is null or length(trim(p_full_name)) = 0 then
    raise exception using errcode = '22023', message = 'lead_name_required';
  end if;
  if nullif(trim(coalesce(p_email_normalized, '')), '') is null
     and nullif(trim(coalesce(p_phone_normalized, '')), '') is null then
    raise exception using errcode = '22023', message = 'lead_contact_required';
  end if;
  if p_consent_version is null or length(trim(p_consent_version)) = 0 then
    raise exception using errcode = '22023', message = 'consent_version_required';
  end if;
  if p_consent_captured_at is null
     or p_registered_at is null
     or p_consent_captured_at > p_registered_at
     or p_registered_at > now() + interval '5 minutes' then
    raise exception using errcode = '22023', message = 'invalid_consent_timestamp';
  end if;

  select * into v_partner
  from mms_commercial.partners
  where upper(partner_code) = upper(trim(p_partner_code))
  for share;

  if v_partner.id is null then
    raise exception using errcode = 'P0001', message = 'partner_not_found';
  end if;
  if v_partner.stage <> 'Active'
     or v_partner.selling_enabled <> true
     or v_partner.crm_access_enabled <> true then
    raise exception using errcode = 'P0001', message = 'partner_not_lead_registration_eligible';
  end if;
  if not exists (
    select 1
    from mms_commercial.partner_certifications c
    where c.partner_id = v_partner.id
      and c.revoked_at is null
      and c.issued_at <= p_registered_at
      and c.expires_at > p_registered_at
  ) then
    raise exception using errcode = 'P0001', message = 'partner_certification_not_current';
  end if;

  -- Serialize equivalent contact registrations so duplicate checking and create
  -- cannot race each other inside separate requests.
  v_contact_lock := lower(trim(coalesce(p_email_normalized, ''))) || '|' || trim(coalesce(p_phone_normalized, ''));
  perform pg_advisory_xact_lock(hashtextextended(v_contact_lock, 0));

  select resource_id into v_existing_resource
  from mms_commercial.idempotency_keys
  where scope = 'partner_lead_registration'
    and key_hash = p_idempotency_key_hash
  for update;

  if v_existing_resource is not null then
    select public_lead_id into v_public_lead_id
    from mms_commercial.leads
    where id::text = v_existing_resource;
    if v_public_lead_id is null then
      raise exception using errcode = 'P0001', message = 'idempotency_resource_missing';
    end if;
    return query select v_public_lead_id, true;
    return;
  end if;

  insert into mms_commercial.idempotency_keys(scope, key_hash, resource_type)
  values ('partner_lead_registration', p_idempotency_key_hash, 'lead')
  on conflict (scope, key_hash) do nothing;

  select resource_id into v_existing_resource
  from mms_commercial.idempotency_keys
  where scope = 'partner_lead_registration'
    and key_hash = p_idempotency_key_hash
  for update;

  if v_existing_resource is not null then
    select public_lead_id into v_public_lead_id
    from mms_commercial.leads
    where id::text = v_existing_resource;
    return query select v_public_lead_id, true;
    return;
  end if;

  if exists (
    select 1
    from mms_commercial.leads
    where (nullif(trim(coalesce(p_email_normalized, '')), '') is not null and email_normalized = lower(trim(p_email_normalized)))
       or (nullif(trim(coalesce(p_phone_normalized, '')), '') is not null and phone_normalized = trim(p_phone_normalized))
  ) then
    raise exception using errcode = 'P0001', message = 'possible_duplicate';
  end if;

  insert into mms_commercial.leads(
    registered_by_partner_id,
    current_partner_id,
    full_name,
    email_normalized,
    phone_normalized,
    source,
    campaign,
    stage,
    duplicate_status,
    consent_version,
    consent_captured_at,
    registered_at,
    last_activity_at
  ) values (
    v_partner.id,
    v_partner.id,
    trim(p_full_name),
    nullif(lower(trim(coalesce(p_email_normalized, ''))), ''),
    nullif(trim(coalesce(p_phone_normalized, '')), ''),
    nullif(trim(coalesce(p_source, '')), ''),
    nullif(trim(coalesce(p_campaign, '')), ''),
    'Registered',
    'Unchecked',
    trim(p_consent_version),
    p_consent_captured_at,
    p_registered_at,
    p_registered_at
  ) returning id, public_lead_id into v_lead_id, v_public_lead_id;

  update mms_commercial.idempotency_keys
    set resource_id = v_lead_id::text
    where scope = 'partner_lead_registration'
      and key_hash = p_idempotency_key_hash;

  return query select v_public_lead_id, false;
end;
$$;

revoke all on function mms_commercial.register_partner_lead(text,text,text,text,text,text,text,text,timestamptz,timestamptz) from public;
grant execute on function mms_commercial.register_partner_lead(text,text,text,text,text,text,text,text,timestamptz,timestamptz) to mms_commercial_app;

insert into mms_commercial.schema_migrations(migration_key,notes)
values(
  '0017_mms_partner_lead_registration_eligibility.sql',
  'Partner lead registration now requires Active status, selling enabled, CRM access enabled and certification issued/current at the registration timestamp.'
)
on conflict(migration_key) do nothing;

commit;
