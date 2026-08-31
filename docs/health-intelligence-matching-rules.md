# Health Intelligence matching rules

Release 2A matching is deterministic (`mms-hi-match-v1`). AI does not verify identity.

The engine compares ingredients, component strength, dosage form, route, release profile, manufacturer, brand, pack configuration and clinically relevant device/presentation. An exact match requires every dimension. A close equivalent requires the same ingredients, strengths, form, route and release profile, while brand, manufacturer, pack or presentation may differ. It is never a substitution recommendation.

Material ingredient, strength, form, route or release differences produce `not_comparable`. Pack-only differences produce a close-equivalent result and retain the pack mismatch in the explanation.

## Hard exceptions

The following override any numerical score and produce `review_required_due_to_exception`: biologics, biosimilars, narrow therapeutic index products, modified/extended release products, combination products, complex injectables, special delivery devices, oncology medicines, clinically meaningful salts/esters and special formulations.

Every result includes its score, dimensions, rule version, explanation and exception codes. Price verification and match confidence remain separate states.
