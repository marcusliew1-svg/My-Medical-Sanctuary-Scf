# Controlled CSV Ingestion

The internal console follows this sequence:

1. Upload or paste a controlled CSV export.
2. Validate required headers, market, currency, dates, numeric values, and formula-like cells.
3. Preview every row with original and normalized values.
4. Review exact, likely, ambiguous, unmatched, and safety-exception product proposals.
5. Resolve only permitted proposed identities through a human reviewer action.
6. Review row errors and unresolved items.
7. Explicitly confirm the import.
8. Create observations in `collected` with `basis_unverified` and no publication approval.

Required fields cover source key, country, observed product wording, ingredient, manufacturer, strength, dosage form, pack, price, currency, pricing basis, observed date, and source reference. Unknown products enter the existing unresolved-product workflow. Ambiguous and safety-exception products are never selected automatically.

Each batch has a stable source/file/content fingerprint and idempotency key. Each row retains source item ID, original language text, raw fields, normalized fields, parsing confidence, proposal explanation, warnings/errors, and the resulting observation ID. Replaying the same batch returns the prior result; a legitimate later observation remains possible when date or source content changes.
