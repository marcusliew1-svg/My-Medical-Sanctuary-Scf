# T6.26 — Access Governance, Privileged Review & Segregation of Duties

**Status:** IMPLEMENTED IN CODE / PREVIEW VALIDATION REQUIRED  
**Scope:** Preview/integration only. Production/main remain untouched.

## Objective

Strengthen operator access governance and segregation of duties using the existing MMS trusted-app-metadata model, without fabricating operator identities, named reviewers, or entitlement approvals.

## Controls introduced

- formal privileged-role classification for `admin` and `finance`;
- auditor exclusivity rule;
- trusted operator metadata now fails closed if `auditor` is combined with any mutation-capable role;
- access-review evidence requirements;
- self-review/self-approval prohibition for privileged access;
- joiner/mover/leaver control principles;
- protected internal access-governance policy endpoint;
- working-draft Access Governance & Segregation of Duties Runbook;
- T6.26 CI regression gate.

## Existing controls preserved

- operator authorization remains derived only from trusted `app_metadata`;
- short-lived operator sessions remain enforced;
- Finance-sensitive mutations continue to require recent step-up authentication;
- same-origin mutation checks remain unchanged;
- auditor-only sessions remain read-only;
- direct SQL writes to `auth.users` remain prohibited.

## Evidence boundary

T6.26 does **not**:
- create a trusted Preview operator;
- assign a named access reviewer;
- alter Production roles;
- configure automatic joiner/mover/leaver deprovisioning;
- change Supabase Auth users;
- fabricate access-review evidence.

## Validation required before merge

- T6.26 tests PASS;
- operator-security tests PASS;
- all prior T6 controls PASS;
- Production dependency audit remains 0 vulnerabilities;
- dev/build baseline remains bounded;
- TypeScript/lint/build PASS;
- Vercel Preview READY;
- Production/main remain untouched.
