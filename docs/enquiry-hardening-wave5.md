# Wave 5 Enquiry Hardening

## Historical comparison

| Capability | Historical branch | Current baseline before Wave 5 | Decision |
| --- | --- | --- | --- |
| Rate limiting | None in booking change | 6 requests per 10 minutes, in memory | Already stronger; retained and extended to other anonymous submit endpoints |
| Honeypot | Present and rejected with 400 | Present in API, but ContactForm did not submit its value | Adapted; client now submits it and APIs continue quiet 202 handling |
| Body size | Relied on field limits | 32 KB `Content-Length` check | Adapted; retained header check and added post-read byte ceiling |
| Request shape | Unknown fields rejected | Known fields selected but extras ignored | Ported through one booking validator |
| Consent | Exact value/version | Exact value/version | Retained and centralised |
| Normalisation | Trimmed strings | Trimmed and truncated strings | Adapted; reject oversize before bounded normalisation |
| Email | Basic regex | Shared basic regex with 254 limit | Retained |
| Phone | Presence only | Six-character minimum | Adapted to practical character and digit bounds |
| URL/query | Source path prefix check | Safe language-switch query allowlist | Adapted with strict source path, campaign-key and value checks |
| Referral | Not integrated | Secure first-party referral cookie | Current is stronger; cookie remains authoritative |
| UTM | Not integrated | Safe values carried during language switching | Adapted into bounded booking campaign context |
| Origin | None | None for public forms | Added compatible same-origin browser-post check |
| Spam | Honeypot only | Honeypot plus rate limit | Current is stronger; retained |
| Errors | 400/503 responses | 400/413/415/429 plus placeholder success | Adapted; truthful 503 and non-sensitive status-specific responses |
| Duplicate submit | Disabled button | CSS pointer suppression after state update | Ported with synchronous client lock and disabled control |
| Server metadata | Consent timestamp | Consent timestamp | Retained; partner identity also server-derived |
| Logging | None | No booking PII logs | Retained |
| International/locale | English form only | Regional summary pages and safe handoff | Adapted; locale plus attribution are preserved into English contact handoff |
| Membership/programme enquiry | Shared contact form | Shared contact form | Canonical option codes added |
| Ling handoff | No change | Education-only route to contact | Retained and bounded; no clinical intake expansion |
| Tests | No dedicated suite | Existing Release and multilingual coverage | Added 18 targeted Wave 5 tests |

## Public conversion inventory

| Surface / routes | Endpoint | Data and consent | Protection | Destination and behavior |
| --- | --- | --- | --- | --- |
| Discovery/contact: `/contact`, `/corporate-executive-wellness`; membership, programme, treatment, location and international CTAs route here | `POST /api/booking` | Contact identity, location, canonical broad interest, membership preference, enquiry subject, contact preference, bounded message; contact consent v1 | 32 KB limit, byte ceiling, origin check, 6/10m rate limit, honeypot, strict field/enums, authoritative referral cookie | CRM-safe payload prepared in memory only; returns truthful 503 until persistence is approved |
| Regional contact summaries: `/ms/contact`, `/zh/contact`, `/th/contact` | Handoff to `/contact` then booking endpoint | No data collected on summary; locale and safe ref/UTM retained at handoff | Safe-query allowlist and canonical locale | English form is clearly identified as the current full path; no claim of full translation |
| Sales Partner application: `/join-mms` | `POST /api/sales-partner-application` | Professional/commercial application and four declarations | Feature gate, 32 KB limit, origin check, 4/15m rate limit, honeypot, allowlists, duplicate CRM check | Zoho Leads only when explicitly configured; otherwise 503 |
| Careers: `/careers` | `POST /api/careers-application` | Applicant contact/work details and recruitment privacy consent | Feature gate, 32 KB limit, origin check, 4/15m rate limit, honeypot, role/URL/phone validation | No HR persistence connected; returns 503 |
| Membership checkout: gated `/membership-checkout` | `POST /api/checkout` | Name, email and canonical membership | Production-default-off route, 32 KB limit, origin check, 8/10m rate limit, honeypot, enum validation | Stripe session only when both checkout and fulfilment gates are enabled |
| Ling education: `/ling` | `POST /api/ling` | One bounded education prompt; no consent because it is not persisted as an enquiry | Origin check, 20/10m rate limit, 32 KB limit, strict one-field request | Non-AI education-routing placeholder; human handoff goes to contact |

No file uploads are accepted. General discovery does not request diagnoses, prescriptions, lab results, reports, identity numbers or detailed medical history. Internal Health Intelligence, Operations, Partner Hub and Commission APIs remain separate and gated.

## Validation and operational limits

- Canonical backend values are English-independent codes. Display labels may be translated later without changing CRM contracts.
- The server derives consent timestamps and reads partner attribution from the HTTP-only first-party cookie. Client `ref` data is campaign context only.
- Rate limiting is process-local. It reduces bursts but is not a globally consistent Vercel-wide limit; a shared durable limiter is a future infrastructure decision.
- Missing `Origin` is allowed for compatible non-browser clients; a supplied mismatched browser origin is denied.
- Booking persistence remains intentionally unavailable. No Zoho, database or environment configuration was changed in Wave 5.
- Regional pages remain partial translations. The English form receives explicit locale context; legal/medical consent was not machine translated.
