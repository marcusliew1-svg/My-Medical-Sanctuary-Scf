# Commission Control Centre: Wave 3

## Scope

Wave 3 adds authenticated commercial commission queue and detail views to the existing Operations Console. It does not change the public website, database schema, runtime environment, or deployment configuration.

## Historical integration inventory

| Area | Disposition | Reason |
| --- | --- | --- |
| Commission queue/detail pages and client components | ADAPT | Retained the functional UI, then converted Next 16 params and enforced auditor read-only controls. |
| Commission queue/detail APIs | ADAPT | Retained commercial projections and filters; replaced the historical read guard with the authoritative Wave 2 guard. |
| Commission query layer | KEEP | Server-only commercial query with immutable event history and no clinical fields. |
| Existing commission calculation, qualification, hold, approval, payout and reversal domain logic | ALREADY PRESENT | The approved baseline already contains the authoritative ledger and secured mutation routes. |
| Wallet/Partner Hub commission views | ALREADY PRESENT | Partner-facing wallet remains separate and was not modified. |
| Historical auth, session, middleware, Operations Console and database-client changes | DROP / SUPERSEDED | Wave 1, Wave 2 and T1 implementations remain authoritative. |
| Historical commission hardening migration | KEEP | Preserved as applied migration `0021`; see the migration manifest. |
| Conceptual `Estimated`, `Pending`, `Qualified`, and `Payable` labels | MANUAL REVIEW | They are not states in the approved database/domain model. No unsupported transition was invented. |
| Manual commission adjustment action | MANUAL REVIEW | Adjustment amounts are readable, but no approved operator mutation or business rule exists for changing them. |

## Access matrix

| Capability | Admin | Finance | Auditor | Operations |
| --- | --- | --- | --- | --- |
| View commission queue and detail | Yes | Yes | Yes | No |
| Hold or release | Yes | Yes | No | No |
| Approve, pay, or reverse | Yes, with recent step-up | Yes, with recent step-up | No | No |

The operator feature gate remains default-off. Disabled routes return `404`; enabled but unauthenticated reads return `401`; authenticated operators without an allowed role receive `403`.

The queue and detail APIs are `/api/operations/commissions` and `/api/operations/commissions/[transactionId]`. Mutations continue through the existing `/api/internal/commerce/commissions/{hold,approve,pay,reverse}` routes. Operations-role users continue to use the commercial application and membership queues; no financial commission visibility was added to that role without an explicit need-to-know approval.

## Data boundary

The query projects commercial identifiers, attribution, membership package, rule/rate, amounts, status, payout, reversal, eligibility, and immutable event fields only. It does not select clinical notes, diagnosis, prescriptions, laboratory results, medical reports, or treatment suitability.

Commission eligibility remains derived from persisted application/lead attribution and does not rewrite ownership. Existing application attribution locks and immutable lead-ownership events remain authoritative. The Commission Centre performs no attribution mutation; any future attribution-history presentation must read the existing event trail rather than synthesize or overwrite it.

## Lifecycle checkpoint

The implemented schema and domain model support `Pending Eligibility -> Eligible -> Held/Approved -> Paid -> Reversed`. `Held` can return to `Eligible`. The proposed conceptual labels `Estimated`, `Qualified`, and `Payable` are not schema states and were not invented in this wave. Any lifecycle vocabulary expansion requires an approved schema and business-rule decision in a later wave.

Meaningful mutations append commission events containing the previous state, next state, server-derived actor, server-derived timestamp, and reason. Approval, payout, and reversal require recent step-up authentication. Hold and release require Finance/Admin authority and same-origin validation but do not currently require step-up.

## Migration checkpoint

The applied commercial hardening migration retains manifest key `0021`. The unapplied Health Intelligence dependency chain is renumbered to `0022` through `0024`. See `docs/migration-manifest-wave3.md`. No migration was applied remotely during Wave 3.

## Route inventory

The Wave 2 baseline contains 149 normalized manifest entries and 153 expanded routes. Wave 3 adds exactly four entries: the commission queue page/API and commission detail page/API. The resulting inventory is 153 manifest entries and 157 expanded routes, with no removal.
