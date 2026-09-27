-- MMS private Partner Hub media bucket.
-- Partner-facing media remains private and is delivered only through server-generated signed URLs
-- after Partner Hub capability authorization.

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'partner-media',
  'partner-media',
  false,
  52428800,
  array['video/mp4']::text[]
)
on conflict (id) do nothing;
