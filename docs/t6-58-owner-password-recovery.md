# T6.58 — Owner Password Recovery & Google Password Manager

**Release decision at implementation handoff: NO-GO for live Owner recovery.** The application flow and synthetic tests are complete, and the Preview redirect configuration is correct. The shared Supabase recovery email template could not be read or changed because the current dashboard identity reports that additional email-settings permission is required. No real Auth user, password, role, or recovery token was accessed or modified.

## Scope

- Base: `mms/integration-next16-foundation` at `7e3cb00d1d3afdbeddf08d70463183b66135fce3`.
- Feature branch: `codex/t6-58-owner-password-recovery`.
- Supabase configuration evidence is limited to Preview branch `mms-preview-auth` / `tfwnlmmdrkkfrtmawpma`.
- Production, `main`, Vercel Deployment Protection, iPivot, and live user permissions remain unchanged.

## Implemented recovery story

1. `/operations/password-recovery` accepts the Owner username/email and returns a generic anti-enumeration response.
2. Supabase receives a recovery request with `redirect_to=https://staging.scf.center/operations/recovery`.
3. The delivered email must open `/operations/recovery?token_hash=...&type=recovery` on staging.
4. The landing page does not consume the one-time token. A deliberate same-origin POST verifies it, which limits email-link scanner interference.
5. The verified Supabase identity must have exactly `app_metadata.operator_roles = ["owner"]`; `user_metadata` is never used for authorization.
6. A short-lived HttpOnly, Secure, SameSite=Strict recovery credential is scoped to `/api/operations/password-reset` and is not placed in a redirect URL.
7. The Owner chooses a new password without supplying the old password. On success, the recovery session is revoked and the cookie is deleted.
8. The Owner is redirected to `/operations/login?reset=1&next=/owner`; successful sign-in then opens `/owner`.

Requests are body-bounded, exact-origin checked, locally rate-limited, and returned with no-store headers. Distributed Vercel Firewall rate limiting remains an infrastructure requirement.

## Google Password Manager compatibility

- Shared login identifier: `name="username"`, `autocomplete="username"`.
- Login password: `name="password"`, `autocomplete="current-password"`.
- Recovery identifier: `name="username"`, `autocomplete="username"`.
- New password: `name="password"`, `autocomplete="new-password"`.
- Confirmation: `name="confirmPassword"`, `autocomplete="new-password"`.
- The post-reset login uses the same identifier/password field names so the browser can associate and update the credential.

## Required Supabase Preview configuration

### URL Configuration

Verified Site URL:

```text
https://staging.scf.center
```

T6.58 added and re-read these exact Preview-only redirect URLs:

```text
https://staging.scf.center/operations/recovery
https://staging.scf.center/api/patient-auth/callback
https://staging.scf.center/api/partner-auth/callback
```

The existing staging invitation, setup, and login redirects and the existing stable Preview URLs were retained. No wildcard was added.

### Shared recovery email template

Supabase exposes one recovery template for Owner, Patient, and Partner password resets. Do not hard-code the Owner route as the only destination. All three application recovery requests now supply a clean, allow-listed callback through `.RedirectTo`, so the exact shared CTA href must be:

```html
{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=recovery
```

Recommended complete Preview template:

```html
<h2>Reset your MMS password</h2>
<p>We received a request to reset the password for your MMS account.</p>
<p><a href="{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=recovery">Reset password</a></p>
<p>This link expires and can only be used once. If you did not request this change, ignore this email.</p>
```

Do not use `{{ .ConfirmationURL }}` for this flow because it routes through Supabase `/auth/v1/verify`, may be consumed by email prefetching, and does not satisfy the Owner application's deliberate acceptance contract. Disable click tracking for Auth emails so the provider does not rewrite the link.

**Live template status:** BLOCKED. The Supabase Dashboard at `/auth/templates` displays “You need additional permissions to access your project's email settings.” The template was therefore not read or changed. An authorized Preview project owner must apply the exact href above and capture before/after evidence. Production SMTP and Production templates must not be changed under T6.58.

## Synthetic verification

- Owner recovery request and exact staging `redirect_to`.
- Generic anti-enumeration response.
- Scanner-resistant recovery landing and POST verification.
- Exclusive trusted Owner-role acceptance.
- Non-Owner denial and token revocation.
- Expired/invalid link failure.
- New-password update without old password.
- Recovery-token non-disclosure, short lifetime, cookie hardening, and deletion.
- Successful redirect to login then `/owner`.
- Google Password Manager field semantics.
- Shared Owner/Patient/Partner recovery-template compatibility.
- Origin, body-size, throttle, and cache controls.

## Verification results

| Check | Result |
| --- | --- |
| T6.58 synthetic recovery suite | PASS — 9/9 |
| T6.57 staging Auth regression | PASS — 12/12 |
| Partner Auth regression | PASS — 26/26 |
| Owner-role and invitation regressions | PASS — 6/6 |
| TypeScript | PASS |
| ESLint | PASS with 7 pre-existing warnings and 0 errors |
| Next.js production build | PASS; six expected routes added (three pages and three APIs) |
| GitHub draft PR CI | PASS at implementation commit `aa69ec5` |
| Vercel feature-branch build | READY at deployment `dpl_jRmXd6B4PiJc25kE8Jzxds8D8Ehp`; Deployment Protection was retained and authenticated verification succeeded |
| Vercel feature-branch runtime | BLOCKED — `/operations/password-recovery`, `/operations/recovery`, and `/owner` fail closed with `404` and `x-mms-feature: operatorAccess` because the branch Preview does not have the operator feature gate enabled |
| Production dependency audit | PASS — 0 vulnerabilities |
| Tracked dev-tool baseline | PASS within the existing T6.21 ceiling — 5 known high-severity build-tool findings, no unexpected package |
| Full retained suite | FAIL — 474/479; the same five inherited failures documented by T6.57 remain outside this change (framework-version contract, Zoho readiness fixture, governance wording/path assertions, and booking readiness fixture) |

## Remaining live gate

1. An authorized Preview project owner applies and verifies the shared recovery template above.
2. Preview Vercel environment is confirmed to use `MMS_SITE_URL=https://staging.scf.center` and the `tfwnlmmdrkkfrtmawpma` operator Auth endpoint with Preview-only keys. Enable `MMS_OPERATOR_ACCESS_ENABLED=true` only in the approved Preview/staging scope; the current feature-branch deployment fails closed because that gate is absent or false.
3. A fresh receivable synthetic Owner account is provisioned through supported Auth administration, with trusted exclusive `owner` app metadata. Do not alter a real account.
4. Delivered email, staging landing, deliberate token acceptance, new-password creation, old-password rejection, new-password sign-in, `/owner` authorization, logout, expiry, and link replay are captured.
5. The synthetic user and evidence-only records are removed safely after verification.
6. CI and deployment build are green; rerun the protected Preview runtime checks after the Preview-only operator feature gate is configured.

Until these checks pass, T6.58 remains **NO-GO** and no real Owner recovery should be attempted.

## References

- Supabase Auth email templates: https://supabase.com/docs/guides/auth/auth-email-templates
- Supabase redirect URLs: https://supabase.com/docs/guides/auth/redirect-urls
- Supabase password authentication: https://supabase.com/docs/guides/auth/passwords
