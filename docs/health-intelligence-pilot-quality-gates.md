# Health Intelligence pilot quality gates

Status: Release 2D.0 design  
Scope: first 23 MY/TH/SG medicine candidates

## Record-level publication gates

Every public observation must pass all gates. There are no pilot exceptions.

| Gate | Pass condition |
| --- | --- |
| Product identity | ingredient, strength, unit, form, release, route and product/pack relationship independently verified |
| Market registration | source record and checked date retained; unknown status explicitly blocks exact-product public label |
| Source approval | source is approved, trusted, active and legally cleared for the collection/publication method |
| Evidence | immutable private evidence reference exists and is retrievable |
| Economic basis | explicit basis is verified and supported by source wording/methodology |
| Price | native amount and currency independently checked; no estimated value |
| Pack | total units and normalization method independently checked |
| Observation date | present and within source-specific freshness period |
| Four eyes | collector is not verifier |
| Publication | named publisher and approval timestamp present |
| Data class | `real_verified`; demo and unverified records cannot publish |
| Language | original source text retained; normalized translation is separate |
| Claims | no access, savings, importability, substitutability or suitability inference |

## Pilot benchmarks

| Metric | Target | Stop threshold |
| --- | ---: | ---: |
| Required-field completeness | 100% for published; at least 98% across collected records | below 95% |
| Provenance retrievability | 100% of published records | any missing published evidence |
| Human review coverage | 100% | any unreviewed publication |
| Four-eyes compliance | 100% | any collector/verifier identity match |
| Known incorrect exact matches | 0 | any occurrence |
| Basis misclassification | 0 published | any occurrence |
| Pack-normalization agreement | at least 98% | below 95% |
| Product identity resolution | at least 90% for Wave 1 | below 80% |
| Verification first-pass rate | at least 85% | below 70% |
| Reviewer disagreement | under 5% after calibration | above 10% |
| Fresh observations | 100% at publication | any stale/expired publication |
| Cross-market regulatory coverage | 100% for admitted candidates | any unlabelled gap |
| Useful price/reference coverage | at least MY + TH for admitted candidates | fewer than two bases/sources |
| Average collection time | measure baseline; no volume target | accuracy decline linked to time pressure |

## Wave gates

### Wave 1 to Wave 2

Proceed only when all 10 Wave 1 candidates have completed identity review, at least 9 resolve without ambiguity, every retained observation has complete provenance, and there are zero known basis or pack errors.

### Wave 2 to Wave 3

Proceed only when cumulative reviewer disagreement is below 5%, pack agreement is at least 98%, source/legal status has not deteriorated and no public-state control has failed.

### Pilot to expansion beyond 30 medicines

All conditions are mandatory:

- 100% required fields and provenance for every published record;
- zero known incorrect published exact matches;
- zero published basis misclassifications;
- zero unreviewed or stale published observations;
- at least 95% identity-resolution rate across the final two collection cycles;
- at least 95% verification pass rate after remediation;
- reviewer disagreement below 3% after calibration;
- source rights and attribution approved in writing;
- public UX supports basis, missing market, freshness, exact/equivalent distinction and context-only records;
- owner approval for remote non-production validation and subsequent activation release.

Failure means no expansion. Correct the process and repeat a controlled sample; do not compensate with more volume.

## Confidence-label gates

### Verified Exact Match

Requires exact brand, manufacturer, ingredient, strength, dosage form, release type, route and pack plus two human approvals and compatible price bases. A normalized per-unit value does not turn a different pack into an exact-pack observation.

### Verified Close Equivalent

Requires exact ingredient, strength, clinically meaningful form, release type and route, with a documented difference in brand/manufacturer or pack. It must display a professional-review disclaimer and cannot imply substitutability.

### Indicative / Unverified

Internal or Preview only. It must not appear as a live public price record. Public pages should show no value rather than an unverified value.

## Automated controls recommended for Release 2D.1

- block incompatible-basis percentage calculations;
- block public rows with missing pack, currency, observation date, verifier or publisher;
- enforce `collector != verifier` at transition/publication;
- expire records automatically based on source policy;
- suspend dependent public rows when a source is suspended;
- require source licence/terms review date;
- require original text and language for Thai records;
- reject Group A label when brand/manufacturer/pack differs;
- show `No verified public price available` for missing markets;
- keep subsidy/formulary records out of price tables.

## Release decision

Release 2D.0 passes when the six design documents are complete and repository checks pass. It does **not** authorize real-data collection, connector activation, remote migration or public live-data display.

The current recommendation is **conditional proceed to manual dry run only**, after owner roles and Malaysia/Thailand source-rights decisions are documented.
