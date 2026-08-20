-- MMS commercial migration manifest
-- Apply after 0001, 0002 and 0003 on the dedicated MMS commercial PostgreSQL database only.

begin;

create table if not exists mms_commercial.schema_migrations (
  migration_key text primary key,
  applied_at timestamptz not null default now(),
  applied_by text not null default current_user,
  notes text
);

insert into mms_commercial.schema_migrations (migration_key, notes)
values
  ('0001_mms_commercial_foundation.sql', 'MMS commercial foundation schema acknowledged by manifest migration.'),
  ('0002_mms_commercial_atomic_operations.sql', 'MMS Partner ID and Lead Registry atomic operations acknowledged by manifest migration.'),
  ('0003_mms_commerce_and_commission_atomic_ops.sql', 'MMS commerce and commission atomic operations acknowledged by manifest migration.'),
  ('0004_mms_commercial_migration_manifest.sql', 'MMS migration manifest installed.')
on conflict (migration_key) do nothing;

alter table mms_commercial.schema_migrations enable row level security;

commit;
