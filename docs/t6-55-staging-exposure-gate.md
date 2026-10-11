# T6.55 staging unprotection security audit

**Release decision: HOLD / NO-GO for Deployment Protection Exception.**

Observed from integration source:
- `/owner` contains a server-side owner role check.
- Operations API routes generally enforce `requireOperatorRead` or `requireOperatorMutation` with session verification. Automated checks added for key routes; CI pending.
- `src/app/operations/layout.tsx` renders an unauthenticated navigation shell for every operations route; the route pages rely on data API checks. This is not equivalent to restricting page-level access.
- Supabase Preview operator Auth environment variables have not been verified due to Vercel project environment access returning 403. A READY build does not establish correctly configured sign-in.
- New Supabase invitation setup code has not passed real end-to-end user acceptance testing.
- Vercel exception for staging removes perimeter protection for the entire selected host, not just invite setup; do not enable it before security sign-off.

Required to proceed: page-level access and security review, synthetic unauthorized/expired/role-separated login and API tests on staging, verified Preview environment settings, dedicated sign-in routes, rate-limiting and CSRF controls, then approval for public staging access. Existing Vercel protection remains enabled; Production unaffected.

DNS/SSL `staging.scf.center` is valid, but this is not an authorization signal.
