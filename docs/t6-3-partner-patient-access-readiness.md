# T6.3 Partner + Patient Access Readiness

Date: 2026-09-05

Baseline: `cad21a393730967c445d35c473e24f1478a6adb3`

Environment: integration and Preview only

## Safety boundary

No Production deployment, Production gate, DNS record, secret, remote migration, live Supabase state, or real account was changed. No clinical dataset is used by either account surface.

## Partner journey inventory

| Journey item | Surface or control | State | Evidence / limitation |
| --- | --- | --- | --- |
| Apply | `/join-mms`, application API | READY but operationally GATED | Validated, rate-limited, consented intake; online persistence remains separately gated. |
| Verify | Partner Auth callback | PARTIAL | Token-hash verification is safe; live Preview email delivery is unproved. |
| Training | Partner stage + Academy | PARTIAL | Existing `Training` stage and approved materials surface; content operations remain owner-controlled. |
| Agreement | `Agreement Pending` stage | PARTIAL | Existing stage is supported; agreement execution system is not implemented here. |
| Approval | Authorized commercial operations | GATED | Public application remains `Applicant`; no self-approval endpoint exists. |
| Partner ID | `app_metadata.partner_id` + commercial record | GATED | Server-derived and ownership checked; provisioning requires approved staff workflow. |
| Login | `/partner-login` + Partner Auth API | READY structurally | Generic errors, safe redirect, short session, revalidation; live Preview E2E not performed. |
| Email verification | Partner callback | READY structurally | Verification cannot issue a Hub session or approve a Partner. |
| Password reset | Recovery/update routes | READY structurally | Generic recovery, short HttpOnly recovery cookie, 12-character minimum. |
| Logout | Partner Hub logout API | READY structurally | Revokes commercial session and Supabase token, clears only Partner cookies. |
| Partner Hub gate | proxy + server layout | READY structurally | Disabled gives 404; enabled but unauthenticated redirects to Partner login. |
| Lead registration | Partner Hub leads | READY structurally | Server Partner ID and mutation protection; no client identity accepted. |
| Own lead visibility | Partner Hub leads | READY structurally | Repository ownership checks bind reads to authenticated Partner. |
| Commission wallet | Commission endpoint | READY structurally | Own summary only; no Finance notes. |
| Training/materials | Academy/presentation centre | PARTIAL | Restricted surface exists; material governance is operational work. |
| Support | Hub support/contact links | PARTIAL | Contact path exists; no private support-message datastore in T6.3. |
| Status restrictions | Session issuer/verifier | READY structurally | `Suspended`, `Inactive`, `Rejected`, `Applicant`, and `Under Review` cannot create/retain access. |

### Existing approval-state model

The migration supports: `Applicant`, `Under Review`, `Approved`, `Agreement Pending`, `Training`, `Active`, `Suspended`, `Inactive`, `Rejected`.

Requested state mapping, without a schema change:

| Requested concept | Existing state |
| --- | --- |
| APPLIED | Applicant |
| UNDER REVIEW | Under Review |
| TRAINING REQUIRED | Training |
| AGREEMENT PENDING | Agreement Pending |
| APPROVED | Approved |
| ACTIVE | Active |
| SUSPENDED | Suspended |
| REJECTED | Rejected |

`Inactive` remains an additional existing terminal/non-access state. Approval and identity provisioning remain authorized-staff actions. Self-registration never activates Partner Hub.

## Partner Day-1 scope

Allowed: profile, Partner ID, training status, agreement status, lead registration, own lead status, own commission summary, approved materials, referral tools, and support/contact.

Excluded: patient clinical information, Finance notes, other Partner records, operator audit internals, and account approval controls.

## Patient account architecture

My Sanctuary uses a dedicated server-only patient identity configuration. It does not reuse Partner, Operator, Finance, Admin, Auditor, or Health Intelligence reviewer authorization. A verified identity is accepted only when trusted `app_metadata.account_type` is `patient`, email is verified, and conflicting role metadata is absent. The authoritative patient ID is the verified provider subject. Browser-submitted patient/customer IDs are never accepted.

The browser receives one short-lived HttpOnly, SameSite=Strict access-token cookie. The server revalidates it with the identity provider on every protected request. No refresh token, service-role key, or admin key is stored in the browser. Registration has a second explicit gate and email verification does not activate My Sanctuary; trusted account-type assignment remains an external authorized process.

### Day-1 My Sanctuary scope

- Overview
- Booking status, once approved server linkage exists
- Programme/membership administrative status, once approved server linkage exists
- Basic profile and contact preferences
- Account security and password recovery
- Guest booking remains available without an account

No diagnosis, prescription, medication list, result, report, clinician note, treatment suitability, medical history, clinical message, care plan, or care instruction is stored or returned.

### Commercial linkage

The ownership helpers require both the authenticated provider subject and, when assigned, a trusted server-side customer reference. Mismatched records are filtered out. The T6.3 APIs currently return authenticated `not_connected` responses with empty collections because no approved booking/programme persistence adapter has been linked. They do not accept IDs in the URL, query, or request body.

## Auth separation matrix

| Identity | Public site / guest booking | My Sanctuary | Partner Hub | Operations / Finance | Health Intelligence review |
| --- | --- | --- | --- | --- | --- |
| Anonymous | Yes | Login/register entry only when gated on | Login/apply entry only when gated on | No | No |
| Patient | Yes | Own commercial account only | No | No | No |
| Partner | Yes | No | Own Partner commercial scope only | No | No |
| Operator | Yes | No | No | Assigned operations role only | No unless separately provisioned |
| Finance | Yes | No | No | Finance scope with step-up controls | No |
| Admin | Yes | No | No | Assigned administrative scope | No unless separately provisioned |
| Auditor | Yes | No | No | Read-only assigned audit scope | No |
| Health Intelligence reviewer | Yes | No | No | No | Assigned reviewer scope only |

Role metadata does not confer access across trust domains. Separate cookies and feature gates are used for Partner, Patient, and Operator systems.

## Feature gates

`MMS_PARTNER_HUB_ENABLED` and `MMS_PATIENT_PORTAL_ENABLED` remain authoritative and default off in Production. Patient registration additionally requires `MMS_PATIENT_REGISTRATION_ENABLED`. Locale-prefixed paths are normalized before gate evaluation. Disabled surfaces return 404 from `proxy.ts`; enabled protected APIs return 401 for no/expired identity, 403 for the wrong account type, and 503 when the identity provider is unavailable.

## Preview E2E blockers

- No real account may be created under T6.3 safety rules.
- Dedicated patient Preview identity configuration and trusted patient metadata provisioning are not proven end to end.
- Booking and programme persistence/linkage providers are intentionally not connected.
- Partner Preview identity, email, commercial-session, and suspension flows were not exercised with a real account in this task.

## Day-1 recommendation

- **Partner access: KEEP GATED** until an approved Preview Supabase and commercial-database E2E run proves login, recovery, suspension, ownership, and logout with synthetic QA identities.
- **Patient access: KEEP GATED** until dedicated patient Preview Auth, trusted account provisioning, ownership enforcement, and booking persistence are proven with synthetic QA identities.

## Verification evidence

- Route inventory: **180 normalized** and **205 expanded**, up from 164/189. The 16 additions are six patient-auth APIs, four My Sanctuary APIs, two recovery pages, and four My Sanctuary child pages. Existing `/login`, `/register`, `/onboarding`, and `/my-sanctuary` routes were changed in place. Zero routes were removed.
- Focused access suite: 34 passed, 0 failed.
- Full retained suite: 226 passed, 0 failed across 20 scripts.
- TypeScript: passed.
- ESLint: 0 errors; six pre-existing React effect warnings in Partner Hub client modules.
- Next.js 16.3.4 Production build: passed using isolated `.next-t63` output after the normal `.next` directory was temporarily locked by the local preview process.
- Dependency audit: 0 known vulnerabilities.
- Local responsive QA at 1280, 768, and 390 pixels: required entry routes rendered with no horizontal overflow or framework error overlay. Keyboard focus advanced from the page body. Partner Hub and My Sanctuary redirected unauthenticated requests to their own safe login paths; unavailable identity configuration was reported without exposing details.
- Screenshots: `docs/evidence/t6-3/`.

Live Preview identity E2E was not claimed: no real or synthetic remote account was created, no environment variable was changed, and no remote datastore was contacted.

## Rollback

Revert the T6.3 commit. No database, identity-provider, environment, DNS, or Production rollback is required because none was changed.
