# T6.50 — Owner authorization decision record (proposal)

## Request and limitation
The proposed first MMS Preview administrator has stated they are the top authority and do not want an independent approver. This is a stated authority claim, not independently validated corporate authorization or a completed role grant.

The existing T6.49 controlled provisioning script **continues to require an independent approver** and an approval reference before execution. No credentials, authorization grants, or database mutations are included in this document.

## Governance review needed
An appropriate reviewer should determine whether the MMS entity permits a founder/owner exception for bootstrap administrator access and document the approving person's legal authority, justification, scope, expiration/review and compensating controls. Retain separation of duties for finance-sensitive payments and subsequent reviews.

## Scope and release conditions
- Proposed target: previously created MMS Preview operator account; no Production permissions.
- Preserve Supabase Auth provider metadata, and use authorized Auth Admin API; never direct edits to auth.users.
- Require a verified authority record and auditable exception evidence before any change in the provisioning requirement.
- Run applicable unit/security tests, CI, and Preview UAT after any reviewed implementation.
- Never store service-role keys or user passwords in this repository.
- No role assignment has been carried out. Production remains NO-GO.

## Open decision
Is a documented owner approval legally and operationally sufficient for the initial privileged user under the MMS governance policy? Pending formal disposition; T6.49 stays unchanged.
