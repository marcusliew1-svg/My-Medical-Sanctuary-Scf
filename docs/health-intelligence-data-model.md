# MMS Health Intelligence data model

Release 2A extends the private `mms_commercial` schema. It does not create another database and does not contain patient or clinical records.

## Identity and markets

- `health_intelligence_markets` provides stable market IDs for MY, TH, SG, ID, AU, US and AE.
- `medicine_products` stores product-level identity and safety flags.
- `medicine_product_ingredients` is many-to-many and stores strength components, salts/esters and clinically meaningful variants.
- `active_ingredients`, `brands`, `manufacturers`, `dosage_forms`, `routes_of_administration` and `release_types` are normalized reference tables.
- `market_registrations` keeps registration evidence separate from access feasibility. No registration or access conclusion is inferred automatically.

## Provenance and observations

- `price_sources` records source type, market, URL/provider, reviewed trust level and freshness.
- `price_observations` stores immutable native-currency evidence. Review fields may change; product, source, amount, basis, currency, quantity and date may not.
- `fx_rates` is append-only so historical conversion can be reconstructed. Converted values never replace source prices.
- `regulatory_notes` stores sourced market/product notes without inventing regulator conclusions.

## Review and future events

- `generic_relationships` and `match_reviews` keep generic evidence and deterministic match output distinct.
- `verification_events` and `health_intelligence_audit_events` are immutable histories.
- `medicine_search_events`, `generic_search_events` and `cost_review_events` reserve minimal, non-clinical event shapes for future releases.

All raw tables use RLS, revoke `public`, `anon` and `authenticated`, and are accessed only by the narrowly granted server role. Demo data is explicitly `data_status='demo'` and cannot pass publication eligibility.
