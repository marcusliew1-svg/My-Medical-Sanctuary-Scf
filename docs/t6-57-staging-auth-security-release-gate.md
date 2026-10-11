# T6.57 — Staging Authentication & Security Release Gate

**Decision at implementation handoff: NO-GO for live staff onboarding.** The application defects found in review are remediated and synthetic automation passes, but live staging infrastructure still blocks an end-to-end invitation test.

## Scope and evidence boundary

- Base SHA: `001335fc1a7f8910b518a69b91b546ce1688eb82` (`mms/integration-next16-foundation`).
- Feature branch: `codex/t6-57-staging-auth-security`.
- Application: Vercel project `my-medical-sanctuary-scf` (`prj_WMv0MvWOeseW1QoX4hqT2REJ7OIV`).
- Auth: MMS Supabase Preview branch `mms-preview-auth` (`tfwnlmmdrkkfrtmawpma`). Production MMS and both iPivot projects were not changed.
- No real or synthetic live Auth user was created, modified, invited, confirmed, or assigned a role. All automated identities are in-memory fixtures using reserved `.invalid` addresses or no address.

## Story under test

An approved staff member receives an MMS staging invitation, deliberately accepts it, creates a password, signs in through staging, receives a short-lived server-verified session, accesses only pages and APIs permitted by trusted roles, and signs out or is rejected when the session expires.

## Code audit and remediation

| Control | Result | Evidence / remediation |
| --- | --- | --- |
| Trusted authorization | PASS | `operator_id` and `operator_roles` are read only from Supabase `app_metadata`; `user_metadata` is ignored. |
| Owner separation | PASS | `owner` is exclusive and is redirected away from staff Operations. Staff roles cannot enter `/owner`. |
| Executive administrator | PASS | `admin` now requires `operations`. The prior blanket `admin` bypass was removed. Admin + Operations can perform Operations work but cannot call Finance-only APIs. |
| Finance separation | PASS | Finance reads/mutations require `finance`; sensitive verification, approval, payout, reversal and cancellation retain recent password step-up. |
| Session creation | PASS | Password grant is server-side; application session is HMAC-SHA256 signed and bound to the Supabase user, operator ID and exact trusted role set. |
| Session duration | PASS | Default 900 seconds, minimum 300, maximum 3600; access-token cookie is capped to the shorter lifetime. No refresh token is stored. |
| Cookies | PASS | Operator session, access token and invitation token are HttpOnly, Secure in deployed builds, SameSite=Strict, and path-scoped. Invitation cleanup now uses the same path as issuance. |
| Revocation / role changes | PASS | Every protected request re-fetches the Supabase user; removed identities or changed metadata fail closed. |
| Sign-out | PASS | Calls Supabase logout and expires both application cookies. |
| Expired session | PASS | Expired or unsigned synthetic sessions return unauthenticated. |
| Protected pages | PASS | Commercial pages live under the server-authenticated `(protected)` route group; owner has a separate server gate. |
| Protected APIs | PASS | Operations reads and mutations enforce `requireOperatorRead` / `requireOperatorMutation`; unauthenticated calls fail. |
| CSRF | PASS (application) | Mutation, login, step-up, setup, invitation acceptance and logout require the exact configured `MMS_SITE_URL` Origin; Strict cookies and `Sec-Fetch-Site` checks add defense in depth. |
| Brute-force controls | PASS WITH INFRA REQUIREMENT | Login (8/15m/IP), step-up (5/15m/session+IP), invitation (10/15m/IP), and setup (8/15m/IP) now have bounded bodies and local throttles. Vercel Firewall or another distributed limiter is still required because in-memory serverless buckets are per-instance. |
| Email scanner resistance | PASS | Delivered link opens an acceptance page; only the user's same-origin POST consumes the one-time invitation. |
| Owner email privacy | PASS | Automated scan finds no personal email literal in staff-facing Operations pages/components; session projection exposes operator ID and roles, not email. |
| Secret exposure | PASS WITH LIVE READBACK BLOCKER | Operator variables are server-only and no literal session secret exists in the tracked source. Vercel denied environment-variable metadata readback (403), so scope/presence and rotation age remain to be verified by a project owner. No evidence of a compromised value was found and no value was printed. |

## Live staging observations (2026-10-11)

1. Vercel deployment `dpl_DcdHJR8x1Zcs5AcuZW4TywVVcQ59` is READY at base SHA `001335f` and aliases `staging.scf.center`; the custom domain is verified and its DNS is correctly configured.
2. Unauthenticated requests to `/operations/login`, `/operations`, `/owner`, and `/api/operations/session` all return `302` to Vercel SSO. Staff without Vercel accounts therefore cannot reach onboarding.
3. Deployment Protection remains enabled. Project metadata reports SSO protection, and the observed custom-domain response proves that it currently applies to the staging alias despite the metadata's `all_except_custom_domains` label. It was not removed or weakened in T6.57.
4. Supabase Preview Site URL is currently `https://my-medical-sanctuary-scf-git-mms-integration-next1-beba22-ml168.vercel.app`.
5. Supabase Preview redirect URLs currently contain that stable Preview origin, localhost, and the patient callback. `https://staging.scf.center` is absent.
6. The Preview **Invite user** template currently uses `{{ .ConfirmationURL }}`, which routes through Supabase `/auth/v1/verify` and does not implement the scanner-resistant MMS acceptance contract.
7. Supabase Preview uses the built-in email service; the Dashboard identifies it as rate-limited and unsuitable for production use.
8. Supabase security advisor initially reported leaked-password protection disabled on `tfwnlmmdrkkfrtmawpma`. T6.57 enabled it on this Preview branch only; the dashboard confirmed the update and a fresh advisor read no longer returns that warning.

## Exact Supabase Preview configuration required

Apply only to `mms-preview-auth` / `tfwnlmmdrkkfrtmawpma` after the staging access-control decision is approved. Retain existing patient Preview redirects unless their owning test plan explicitly retires them.

### URL Configuration

- Site URL: `https://staging.scf.center`
- Add exact redirect URLs:
  - `https://staging.scf.center/operations/invite`
  - `https://staging.scf.center/operations/setup`
  - `https://staging.scf.center/operations/login`
- Vercel Preview may retain its current exact origin for regression testing. Do not add an unrestricted `https://**` wildcard.
- Vercel Preview environment must set server-only `MMS_SITE_URL=https://staging.scf.center`; `MMS_OPERATOR_SUPABASE_URL` must reference `https://tfwnlmmdrkkfrtmawpma.supabase.co`; the publishable key and session secret remain server-only and Preview-scoped.

### Invite user template

Use a short operational email with one CTA and no personal or clinical content. The exact href is:

```html
https://staging.scf.center/operations/invite?token_hash={{ .TokenHash }}&type=invite
```

Do not use `{{ .ConfirmationURL }}` for this flow. The application verifies `token_hash` with `type: "invite"` only after the recipient presses **Accept invitation** on the staging page.

### Auth hardening

- Leaked-password protection: **enabled and re-verified on the Preview branch**.
- Keep email confirmation/invitation expiry short and test expired and reused tokens.
- Review Supabase Auth rate limits and add CAPTCHA/Turnstile if the staff endpoint becomes broadly discoverable.
- If the plan supports it, configure a finite Supabase time-box/inactivity policy and single-session enforcement. The MMS application independently caps operator authorization to 15 minutes by default and stores no refresh token.
- Configure an approved staging transactional SMTP provider before real staff onboarding; retain SPF, DKIM and DMARC evidence. Built-in SMTP is not a release-ready mail path.

## Live test matrix still required

Use a fresh synthetic account only after the infrastructure items below are approved. Never repurpose a real user.

1. Deliver invitation to a receivable synthetic inbox.
2. Confirm the email CTA uses the exact staging href and opens without Vercel login.
3. Confirm opening/prefetching alone does not consume the invitation.
4. Accept once, set a password, then verify reuse and expiry fail safely.
5. Sign in as exclusive `owner`; verify `/owner` allowed and all staff/Finance APIs denied.
6. Sign in as `admin` + `operations`; verify Operations allowed, Owner and Finance-only APIs denied.
7. Sign in as `finance`; verify Finance allowed, Owner and Operations-only mutations denied.
8. Verify unauthenticated page/API denial, logout invalidation and expiry after configured duration.
9. Verify throttle responses at the Vercel edge and application layers without locking a real person out.
10. Remove the synthetic Auth account and evidence-only records after capture.

## Automated verification

| Check | Result |
| --- | --- |
| T6.57 security gate | PASS — 12/12 |
| T6.57 plus adjacent Owner/invite/Operations security regressions | PASS — 37/37 |
| Full retained suite | **FAIL — 462/467**; five failures reproduce on the base SHA and remain CI/release blockers: Release 1B.2 framework-version contract, T6.15 Zoho tenant-readiness fixture, T6.16 Markdown wording assertion, T6.17 pre-route-group path assertion, and T6.6 booking-readiness fixture. |
| TypeScript | PASS |
| ESLint | PASS with 7 pre-existing warnings and no errors |
| Next.js production build | PASS |
| Production dependency audit | PASS — 0 vulnerabilities |
| Tracked development-tooling audit | PASS against the existing T6.21 ceiling — five known high transitive findings (`@next/eslint-plugin-next`, `eslint-config-next`, `braces`, `fast-glob`, and `micromatch`); no finding was suppressed. |
| Secret assignment scan | PASS — no tracked file or repository-history commit contains a literal assignment for the operator session secret or Supabase publishable key. |
| Route count | 213, up from 212 on the base SHA; the only route delta is `/operations/invite`. |

The local build proves the feature branch compiles. A protected Vercel feature-branch deployment and its CI checks must still be captured against the committed head before this document can become a GO record.

## GO criteria / remaining blockers

- [ ] Draft PR CI and Vercel Preview deployment are READY at the feature-branch commit.
- [ ] The five inherited retained-suite failures are fixed or explicitly rebaselined by their owners, and CI is green.
- [ ] An approved narrow access design lets invite/login paths on `staging.scf.center` work without Vercel membership while preserving Deployment Protection elsewhere.
- [ ] Preview Vercel environment-variable metadata is read back by an authorised project owner; `MMS_SITE_URL` and all operator variables are confirmed Preview-only.
- [ ] Supabase Preview Site URL/redirects and Invite template match the exact values above.
- [x] Preview leaked-password protection is enabled.
- [ ] Approved staging SMTP and distributed edge rate limiting are configured.
- [ ] Fresh synthetic delivered-email and role-separated live matrix passes; synthetic user is removed.

Until every item is checked, the release decision remains **NO-GO** and no real Owner, Operations or Finance invitation should be sent.

## References

- Supabase email templates: https://supabase.com/docs/guides/auth/auth-email-templates
- Supabase redirect URLs: https://supabase.com/docs/guides/auth/redirect-urls
- Supabase sessions: https://supabase.com/docs/guides/auth/sessions
- Supabase password security: https://supabase.com/docs/guides/auth/password-security
- Supabase Auth rate limits: https://supabase.com/docs/guides/auth/rate-limits
