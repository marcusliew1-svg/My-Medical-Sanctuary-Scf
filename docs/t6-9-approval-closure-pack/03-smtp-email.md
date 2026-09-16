# Pack 03 — Production SMTP / Email

Owner group: IT, Security, Privacy, Brand and business owner. Current state: **BLOCKED**. `info@scf.center` is a **provisional candidate only**, not an approved permanent sender.

## Approval checklist

| Item | Current status | Required decision/evidence | Approver | Blocking impact |
| --- | --- | --- | --- | --- |
| Transactional provider | **BLOCKED** | Vendor, service region, DPA/subprocessors, security, support, SLA and exit plan | IT + Security + Privacy + business owner | All Auth email |
| SMTP host/port/security | **BLOCKED** | Exact provider endpoint, TLS mode and approved port | IT + Security | Connectivity/security |
| SMTP username/password | **BLOCKED** | Write-only secret custody, rotation/revocation owner and fingerprint evidence | Security + credential custodian | Delivery |
| Sender domain | **BLOCKED** | Approved permanent sending domain and relationship to final MMS domain | Brand + Legal + IT | Identity/alignment |
| Sender address/name | **BLOCKED** | Monitored From/reply behavior and approved display name | Brand + Legal + Operations | User trust/support |
| SPF | **BLOCKED** | Exact provider-authorized record and alignment result | DNS owner + Security | Anti-spoofing/delivery |
| DKIM | **BLOCKED** | Exact selector/record, key ownership/rotation and alignment result | DNS owner + Security | Anti-spoofing/delivery |
| DMARC | **BLOCKED** | Exact policy/reporting addresses, rollout and report owner | DNS owner + Security + Privacy | Spoofing/monitoring |
| Bounce handling | **BLOCKED** | Event source, suppression, retry, support and retention SOP | Email Operations + Privacy | Reputation/delivery |
| Complaint handling | **BLOCKED** | Feedback loop, suppression, investigation and incident thresholds | Email Operations + Privacy + Security | Reputation/compliance |
| Rate limits | **BLOCKED** | Provider and Supabase limits, expected volume, alert thresholds and surge plan | IT + Operations + Security | Availability/abuse |
| Link tracking | **BLOCKED** | Disabled for Auth links; evidence that callbacks are not rewritten | IT + Auth owner + Security | Token integrity |
| Signup E2E | **BLOCKED** | Fresh delivered message, direct callback, no `invalid_link`, `email_confirmed_at` populated | QA + Auth owner | Auth launch |
| Recovery E2E | **BLOCKED** | Fresh delivered message, direct callback, reset page, password change, old rejected/new accepted | QA + Auth owner | Account recovery |

## Secret collection record

Do not paste SMTP credentials here. Record only provider account ID, secret-store location, credential custodian role, creation/rotation date, expiry if any, and safe fingerprint/last four characters.

## Portability requirement

Keep sender address/name in Supabase Auth SMTP configuration or its approved configuration system, separate from application code and templates. When the final MMS domain changes, snapshot/export, verify the new mailbox and SPF/DKIM/DMARC, update configuration, rerun delivered Auth E2E, and only then retire the provisional sender.

## Approval form

Decision: `[ ] APPROVE  [ ] REJECT  [ ] RETURN FOR CHANGES`  
Provider/sender evidence IDs: `<REQUIRED>`  
DNS alignment evidence IDs: `<REQUIRED>`  
Delivered E2E evidence ID: `<REQUIRED>`  
Approver names/capacities and date: `<REQUIRED>`

