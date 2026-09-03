# Wave 6 Partner Auth Reconciliation

## Historical comparison

| Capability | Historical `feat/supabase-auth` | Approved Wave 5 baseline | Decision |
| --- | --- | --- | --- |
| Login | Supabase password grant with access and refresh cookies | No Partner credential entry; database-backed Partner sessions already authoritative | ADAPT: Supabase verifies credentials, then an opaque database session is issued only after server-side Partner linkage and status checks |
| Registration | No Partner registration route | Public `/register` is a gated patient-demo surface | DROP: Partner self-registration must not bypass Apply → Verify → Training → Agreement → Approval |
| Recovery | Not implemented | Not implemented | ADAPT: add generic reset request, token-hash callback, and password update; remote email-template configuration remains a deployment prerequisite |
| Email verification | Not implemented | Partner approval remains commercial workflow state | ADAPT: callback can verify email but never approves or activates a Partner |
| Session handling | Supabase access/refresh cookies; synthetic one-hour claims | Opaque revocable PostgreSQL session and CSRF records | KEEP CURRENT + ADAPT: short-lived HttpOnly Supabase access token revalidates identity; opaque database session remains authorization source; no browser refresh token |
| Supabase client | Server fetch helper using `NEXT_PUBLIC_*` variables | Operator identity uses a server-only REST boundary | ADAPT: dedicated server-only Partner variables; no SDK or service-role key |
| Middleware | Auth, refresh and referral logic in `middleware.ts` | Next 16 `src/proxy.ts` owns gates and referral cookie | DROP / SUPERSEDED: no middleware; auth enforcement is in server layout/API helpers |
| Logout | Supabase sign-out and cookie clearing without Partner CSRF | Database session revocation with same-origin and CSRF protection | ADAPT: preserve current CSRF/revocation and also revoke the Supabase access token |
| Partner identity | `app_metadata.partner_id`; no database status check at login | Session Partner ID plus live database capability state | ADAPT: require matching app metadata, database Partner record, allowed stage and matching subject on every request |
| Partner APIs | Supabase token alone in request helper | Database session + capability + ownership + CSRF | ALREADY STRONGER: retain current API boundaries |
| Feature gates | Middleware did not preserve current gate matrix | Production/default-off Partner Hub gates, including locale prefixes | ALREADY STRONGER: extend current Partner gate to auth-entry routes |
| Error handling | Redirect flags exposed distinct not-authorized state | Safe API status handling | ADAPT: generic credential/account response; no account enumeration or provider details |
| Tests | No dedicated auth suite | 131 regression tests | PORT: add targeted Wave 6 contract and synthetic auth-flow tests |

Historical readiness/Zoho files are unrelated to Partner authentication and are not ported. The historical branch is not merged.

## Architecture

Supabase Auth is the credential and backing-identity provider. Its publishable key is server-only in this integration. Successful credential verification must produce a user whose server-controlled `app_metadata.partner_id` matches an existing permitted MMS Partner record. New or existing sessions are accepted only while the Partner is in `Approved`, `Agreement Pending`, `Training` or `Active`; `Suspended`, `Inactive`, `Applicant`, `Under Review` and `Rejected` records fail closed. The server then creates an opaque, hashed, expiring record in `mms_commercial.partner_sessions` and sends only its opaque token plus the short-lived Supabase access token in separate HttpOnly, SameSite=Strict cookies.

Every Partner API request verifies both layers and requires the Supabase subject and Partner ID to match the database session claims. Capability authorization then reloads current Partner stage, certification and selling/CRM state. Operator identity remains a separate cookie, metadata namespace and route family.

Refresh tokens are deliberately not stored. A Partner signs in again when the short session/access token expires. This reduces long-lived browser credential exposure and keeps database revocation authoritative.

## Route access matrix

| Route family | Classification | Behavior |
| --- | --- | --- |
| `/join-mms`, `/contact` | PUBLIC | Application and assistance only; no authenticated Partner access |
| `/partner-login`, `/partner-password-recovery`, `/partner-password-update`, `/api/partner-auth/*` | AUTH-ENTRY + PRODUCTION DEFAULT-OFF | Available only when the Partner Hub gate is enabled; safe redirects and generic failures |
| `/partner-hub/*`, `/api/partner-hub/*` | AUTHENTICATED PARTNER | Requires matching Supabase identity and revocable database session |
| Academy/presentation | PARTNER-STATUS RESTRICTED | Available only through current Partner capability policy |
| Dashboard, leads, commercial status, commission wallet | PARTNER-STATUS RESTRICTED | Current live Partner access state and own-Partner scope are required |
| Lead/application mutations | PARTNER-STATUS RESTRICTED | Active selling capability, same-origin request and session-bound CSRF required |
| `/operations/*`, `/api/operations/*`, `/internal/*` | INTERNAL / NOT PARTNER | Partner credentials confer no access |
| `/login`, `/register`, `/onboarding`, `/my-sanctuary` | PATIENT PORTAL / NOT PARTNER | Existing separate patient feature gate; never used for Partner Auth |

Locale-prefixed protected paths are normalized by the current feature gate and cannot bypass a disabled Partner Hub. Partner Auth remains English in Wave 6.

## Recovery deployment prerequisite

The code supports Supabase token-hash verification without putting access tokens in URLs. Before a real end-to-end email test, the approved MMS Supabase Auth recovery and confirmation templates must link to `/api/partner-auth/callback` with `token_hash={{ .TokenHash }}`, the appropriate `type`, and an approved relative `next` destination. This Wave does not change Supabase configuration, users, data, secrets or Preview environment values.
