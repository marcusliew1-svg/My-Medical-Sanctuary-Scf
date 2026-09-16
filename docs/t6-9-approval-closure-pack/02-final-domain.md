# Pack 02 — Final Production Domain

Owner group: Business owner, Brand, IT/DNS owner, Legal and Security. Current state: **BLOCKED**. Exactly one Production origin is required. This pack does not choose it.

## Decision form

| Field | Required value/evidence |
| --- | --- |
| Approved HTTPS origin | `https://<FINAL_MMS_HOST>`; one origin, no path, no trailing slash |
| Registrant/control | Registrar/account ownership and named role custodians |
| TLS | Valid certificate, renewal owner and expiry monitoring |
| DNS | Approved records, change owner, TTL/change-window and rollback export |
| Brand/Legal approval | Dated signed decision for public and legal use |
| Security approval | Origin allow-list, HSTS/cookie and redirect-boundary review |
| Effective date/review date | `<REQUIRED>` |

Reject localhost, Preview hosts, Vercel deployment hosts and the temporary `scf.center` fallback as the final canonical unless the business independently supplies and approves an exact host through this form. No inference is permitted.

## Exact values generated after the host is supplied

For approved origin `https://<FINAL_MMS_HOST>`:

| Consumer | Exact value / assertion |
| --- | --- |
| `MMS_SITE_URL` | `https://<FINAL_MMS_HOST>` |
| `NEXT_PUBLIC_SITE_URL` | `https://<FINAL_MMS_HOST>` |
| Canonical | Every indexable route uses the same origin plus its canonical pathname |
| Sitemap | `https://<FINAL_MMS_HOST>/sitemap.xml`; every entry uses the same origin |
| Robots | `https://<FINAL_MMS_HOST>/robots.txt`; sitemap reference uses the exact sitemap URL |
| `hreflang` / `x-default` | Reciprocal localized URLs use the same origin; `x-default` uses the approved default-language route |
| Open Graph | `og:url` and site metadata use the same exact origin; no Preview/temp host |
| JSON-LD | All approved organization/site/page IDs and URLs use the same origin; unverified entity/medical claims remain absent |
| Supabase Auth Site URL | `https://<FINAL_MMS_HOST>` |
| Patient callback allow-list | `https://<FINAL_MMS_HOST>/api/patient-auth/callback` |
| Patient signup href | `https://<FINAL_MMS_HOST>/api/patient-auth/callback?token_hash={{ .TokenHash }}&type=signup` |
| Patient recovery href | `https://<FINAL_MMS_HOST>/api/patient-auth/callback?token_hash={{ .TokenHash }}&type=recovery` |
| Partner callback | Add only the exact separately approved Partner callback contract; do not infer it from Patient approval |

Do not depend on the default `{{ .ConfirmationURL }}` if it routes through `/auth/v1/verify`. Preserve direct application callbacks with `{{ .TokenHash }}`. The Production redirect allow-list must contain exact approved callback paths, not wildcards.

## Validation and rollback

- Snapshot Vercel environment scopes and Supabase Auth URL/template configuration before writes.
- Verify HTTPS/TLS, same-origin metadata, sitemap/robots, localized alternates and negative redirect tests.
- Run fresh delivered signup and recovery tests only after SMTP approval.
- Roll back the Vercel deployment/env snapshot and Supabase Auth export; keep all gates off.

## Approval form

Decision: `[ ] APPROVE  [ ] REJECT  [ ] RETURN FOR CHANGES`  
Approved origin: `<REQUIRED>`  
Evidence IDs: `<REQUIRED>`  
Approver names/capacities: `<REQUIRED>`  
Date/review date: `<REQUIRED>`

