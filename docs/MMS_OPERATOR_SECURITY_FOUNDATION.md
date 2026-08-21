# MMS Operator Security Foundation

This layer secures internal commercial mutations for My Medical Sanctuary. It is intentionally separate from Partner Hub identity and from clinical/patient systems.

## Trust model

- Browser-facing internal commerce mutations use the HttpOnly `mms_operator_session` cookie.
- Operator identity and audit timestamps are derived by the server and are never accepted from JSON request bodies.
- Supported roles are `operations`, `finance`, `admin`, and `auditor`.
- `auditor` is read-only.
- `admin` may satisfy role checks but does not bypass step-up requirements.
- Same-origin mutation checks require the request `Origin` to match `MMS_SITE_URL`; cross-site fetches are rejected.
- Finance-sensitive actions require recent step-up authentication. The default maximum age is 600 seconds.
- Session tokens are HMAC-SHA256 authenticated with `MMS_OPERATOR_SESSION_SECRET`; the secret must remain server-side and at least 32 characters.
- Session issuance is deliberately not implemented here. An approved first-party OIDC/SSO/managed-identity provider must authenticate the operator before setting the cookie.
- `MMS_INTERNAL_API_TOKEN` and `MMS_FINANCE_API_TOKEN` remain for controlled service/diagnostic compatibility only. The converted browser-facing mutation routes no longer use them.

## Converted mutation routes

Application transition derives `actor` and `occurredAt` from the operator session while retaining expected-state concurrency.

Payment recording derives `recordedBy` and `submittedAt` from the Finance operator session. Payment clearance additionally requires recent Finance step-up and derives `verifiedBy` and `verifiedAt` server-side.

Membership preparation derives `preparedBy` and `preparedAt`. Membership activation derives `activatedBy` and `activatedAt` and uses persisted Finance verification evidence rather than a caller-supplied Finance timestamp. Membership cancellation requires recent step-up and derives cancellation actor/time server-side.

Commission eligibility derives `checkedBy` and `checkedAt`; hold/release derives event actor/time; approval, payout and manual reversal require recent Finance step-up and derive their audit actor/time from the authenticated operator.

## Production gate

Keep `MMS_OPERATOR_ACCESS_ENABLED=false` until an approved operator identity provider can issue the session cookie and production security review is complete. The operator session secret must never be sent to the browser. No clinical information belongs in the operator commercial workflow.
