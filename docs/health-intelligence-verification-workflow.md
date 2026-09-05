# Health Intelligence verification workflow

Records follow controlled transitions:

`collected -> pending_review -> verified -> published`

The workflow also supports `rejected`, `expired` and `needs_reverification`. Shortcuts such as collected directly to published are rejected. Every decision records reviewer, time, previous/new state, notes and an audit event.

`health_intelligence_price_publication_eligibility()` is the central database rule. A price needs a verified record state, verified price confidence, reviewer evidence, active source, comparison basis, observation date, verified product identity, current validity and live data status. Demo data is always rejected.

Freshness is record-specific through `valid_until` and `review_due_at`; Release 2A does not impose one global expiry period.
