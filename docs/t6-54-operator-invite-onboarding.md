# T6.54 — MMS staff invitation onboarding (Preview development)

Problem: invited staff followed a Supabase email link to a Vercel-protected branch deployment, which demanded a Vercel login. MMS staff must not need Vercel membership.

## Code added
- `/operations/invite?token_hash=...&type=invite`: noindex, no-referrer acceptance page. Opening the email does not consume the token.
- `POST /api/operations/invite`: deliberate same-origin acceptance verifies the invitation hash against Supabase Auth, stores a short-lived access token in an HttpOnly cookie restricted to the setup POST path, then redirects to `/operations/setup`.
- `/operations/setup`: password creation, no personal data or role disclosure.
- `POST /api/operations/setup`: same-origin check, token-required, minimum 12 character password, one-time token cookie cleared on completion.
- Does not grant `operator_roles`; onboarding and authorization remain separate.

## Required infrastructure changes before inviting staff again
1. Provision an approved MMS staging onboarding host accessible to invited staff **without Vercel authentication**, while retaining Vercel protection for private branch previews. Keep non-onboarding routes separately protected; obtain security sign-off for host routing. No confirmed public MMS onboarding hostname yet.
2. Set Supabase **Preview** Auth URL Configuration Site URL and redirect allow list to approved onboarding host. Do not point to protected Vercel Preview or Production.
3. Configure Supabase **Invite user** email template link to: `https://<approved-MMS-staging-host>/operations/invite?token_hash={{ .TokenHash }}&type=invite`. The intermediate acceptance page prevents email link scanners from consuming a one-time invitation. Test Supabase template variable support and the delivered link in staging.
4. Confirm required operator environment configuration, Origin allowlisting and email delivery before live testing.
5. Reinvite/reset a synthetic test account; verify invite, expired/reused links, password setup, unauthorized role denial and subsequent authorized sign-in.
6. Only then issue a fresh invitation to the SCF Asia Pacific executive administrator. The current invitation may already be consumed; do not reuse it.

No hosting configuration changed, no accounts provisioned, no production deployment, no clinical or personal records touched. T6.54 is code-only pending staging host and live UAT.
