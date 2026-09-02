# MMS Operator Security Foundation

This layer secures internal commercial mutations for My Medical Sanctuary. It is intentionally separate from Partner Hub identity and from clinical/patient systems.

## Trust model

- Browser-facing internal commerce mutations use the HttpOnly `mms_operator_session` cookie.
- Operator login is backed by the MMS Supabase Auth tenant through server-only `MMS_OPERATOR_SUPABASE_URL` and `MMS_OPERATOR_SUPABASE_PUBLISHABLE_KEY` configuration.
- Operator authorization is derived only from server-controlled `app_metadata.operator_id` and `app_metadata.operator_roles`.
- Partner `app_metadata.partner_id` does not grant Operations, Finance, Admin or Auditor access.
- Supported operator roles are `operations`, `finance`, `admin`, and `auditor`.
- `auditor` is read-only.
- `admin` may satisfy role checks but does not bypass step-up requirements.
- Operator identity and audit timestamps are derived by the server and are never accepted from JSON request bodies.
- Every protected operator request verifies both the signed `mms_operator_session` cookie and the backing Supabase operator identity/access token. A removed operator identity, removed operator metadata or changed role set fails closed and requires a fresh sign-in.
- Operator authorization sessions are short-lived. `MMS_OPERATOR_SESSION_MAX_AGE_SECONDS` defaults to 900 seconds and is capped at 3600 seconds.
- No long-lived operator refresh-token cookie is stored. When the short operator session expires, the operator signs in again.
- Same-origin mutation checks require the request `Origin` to match `MMS_SITE_URL`; cross-site fetches are rejected.
- Finance-sensitive actions require recent password step-up. The default maximum age is 600 seconds.
- Step-up re-authenticates the same Supabase operator identity and issues a new signed operator session containing a server-derived `stepUpAt` timestamp.
- Session tokens are HMAC-SHA256 authenticated with `MMS_OPERATOR_SESSION_SECRET`; the secret must remain server-side and be at least 32 characters.
- Operator logout calls Supabase Auth logout and clears the operator session and short-lived access-token cookies.
- `MMS_INTERNAL_API_TOKEN` and `MMS_FINANCE_API_TOKEN` remain for controlled service/diagnostic compatibility only. The converted browser-facing mutation routes no longer use them.

## Operator identity setup

Create operator users only in the standalone MMS Supabase project. Assign authorization through server-controlled `app_metadata`, for example:

- `operator_id`: the permanent internal operator identifier used for audit actor attribution.
- `operator_roles`: an array containing one or more of `operations`, `finance`, `admin`, `auditor`.

Do not use `user_metadata` for authorization. Do not reuse Partner `partner_id` as an operator identifier. A person who legitimately needs both Partner and internal operator access must still receive the two permissions independently.

## Operator routes

- `/operations/login` and `POST /api/operations/login` authenticate an authorised MMS operator and issue the short-lived operator session.
- `/operations/step-up` and `POST /api/operations/step-up` re-authenticate the same operator before sensitive actions.
- `POST /api/operations/logout` revokes the Supabase Auth session and clears all operator cookies.
- `GET /api/operations/session` exposes only the verified operator-session projection already permitted by the foundation.

## Converted mutation routes

Application transition derives `actor` and `occurredAt` from the operator session while retaining expected-state concurrency.

Payment recording derives `recordedBy` and `submittedAt` from the Finance operator session. Payment clearance additionally requires recent Finance step-up and derives `verifiedBy` and `verifiedAt` server-side.

Membership preparation derives `preparedBy` and `preparedAt`. Membership activation derives `activatedBy` and `activatedAt` and uses persisted Finance verification evidence rather than a caller-supplied Finance timestamp. Membership cancellation requires recent step-up and derives cancellation actor/time server-side.

Commission eligibility derives `checkedBy` and `checkedAt`; hold/release derives event actor/time; approval, payout and manual reversal require recent Finance step-up and derive their audit actor/time from the authenticated operator.

## Production gate

Keep `MMS_OPERATOR_ACCESS_ENABLED=false` until the standalone MMS Supabase project is fully migrated and verified, operator accounts and metadata are provisioned, the server-only operator Supabase variables and signing secret are configured, and preview security testing passes. No clinical information belongs in the operator commercial workflow.

The application gate covers `/operations` and `/api/operations`. It fails closed with `404` while operator access is disabled. Converted commercial mutation APIs retain their existing route availability because the same namespace also contains separately protected readiness and diagnostic endpoints; each converted mutation fails closed through `requireOperatorMutation`, returning unavailable while operator access is disabled and `401` for an unauthenticated request after the feature is explicitly enabled.

## Environment classification

| Variable | Exposure | Scope | Requirement |
| --- | --- | --- | --- |
| `MMS_OPERATOR_ACCESS_ENABLED` | Server-only | Preview-only during validation; Production default-off | Required and exactly `true` to expose operator surfaces |
| `MMS_OPERATOR_SUPABASE_URL` | Server-only | Preview-only during validation | Required when operator access is enabled |
| `MMS_OPERATOR_SUPABASE_PUBLISHABLE_KEY` | Server-only configuration | Preview-only during validation | Required when operator access is enabled; never use a service-role key |
| `MMS_OPERATOR_SESSION_SECRET` | Server-only secret | Preview-only during validation; Production default-off | Required when operator access is enabled; minimum 32 characters |
| `MMS_OPERATOR_SESSION_MAX_AGE_SECONDS` | Server-only | Optional | Defaults to 900 and is capped at 3600 |
| `MMS_OPERATOR_STEP_UP_MAX_AGE_SECONDS` | Server-only | Optional | Defaults to 600 and is capped at 3600 |
| `MMS_SITE_URL` | Server-only configuration | All environments | Required for same-origin mutation checks when operator access is enabled |
| `MMS_INTERNAL_API_TOKEN` | Server-only secret | Optional legacy service use | Not accepted by converted browser-facing mutations |
| `MMS_FINANCE_API_TOKEN` | Server-only secret | Optional legacy service use | Not accepted by converted browser-facing Finance mutations |

No operator variable uses a `NEXT_PUBLIC_` prefix. Real values remain outside source control.
