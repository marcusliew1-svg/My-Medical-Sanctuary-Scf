# MMS Partner Hub production identity

Partner Hub remains fail-closed until the production environment is explicitly enabled.

## Required runtime configuration

- `MMS_PARTNER_HUB_ENABLED=true`
- `MMS_COMMERCIAL_DATABASE_ENABLED=true`
- `MMS_COMMERCIAL_DATABASE_URL=<dedicated MMS commercial PostgreSQL connection>`
- `MMS_PARTNER_SUPABASE_URL=https://<mms-project>.supabase.co`
- `MMS_PARTNER_SUPABASE_PUBLISHABLE_KEY=<Supabase publishable key>`
- `MMS_PARTNER_MEDIA_SUPABASE_URL=https://<mms-project>.supabase.co`
- `MMS_PARTNER_MEDIA_SUPABASE_SECRET_KEY=<server-side Supabase secret/service key>`

Do not expose database or storage secret keys to client-side code.

## Identity binding

Partner authentication is verified by Supabase Auth. The Partner ID is read only from the authenticated user's server-controlled `app_metadata.partner_id` value. Browser fields, query parameters and `user_metadata` are never accepted as Partner authorization.

After Supabase verifies the credentials, MMS immediately issues its own opaque database-backed Partner Hub session and revokes any older active Partner Hub sessions for that Supabase identity. The transient Supabase session is then logged out and is not retained in browser cookies.

## Private Partner materials

Private material is registered in `mms_commercial.presentation_assets.content_url` using:

`storage://partner-media/<object-path>`

The Presentation Centre returns an authenticated MMS proxy URL. The proxy rechecks `ACCESS_PRESENTATION_CENTRE` and issues a short-lived Supabase signed URL. The private bucket has no public read policy.

The Founding Partner film must not be placed in the repository `public/` directory or any permanent public CDN.
