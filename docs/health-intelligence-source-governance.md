# Health Intelligence Source Governance

Every source starts as `candidate`. An MMS reviewer records its country, source class, provider, reference, access method, normal pricing basis, verification method, permitted use, scope and review frequency. Source type never determines trust by itself.

Trust is assigned as high, medium, low or unknown with a reason, reviewer and date. Only approved sources with adequate reviewer-assigned trust can normally support publication. Restricted, suspended and retired sources remain in history but cannot support new publication. A manual override requires a written reason and an audit event.

Visibility is independent of trust: `public_full`, `public_name_only`, `public_type_only` or `internal_only`. Supplier contacts, commercial terms, margins, volume expectations and relationship notes remain private metadata and are never emitted by the public read model.

Source status changes and trust reviews are audited. Reviewers should suspend a source when its terms, reliability, licensing context or evidence quality becomes uncertain.

