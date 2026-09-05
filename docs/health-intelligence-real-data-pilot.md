# Health Intelligence real-data pilot: MY / TH / SG

Status: Release 2D.0 design only  
Research date: 30 August 2026  
Activation state: not activated

## Executive recommendation

Proceed to a controlled manual collection exercise only after the source-owner and legal decisions in this document are closed. Do not activate automated collection or public real-data display yet.

The recommended first cohort contains 23 simple oral medicines. Each candidate has evidence of:

- at least one Malaysia MyPriMe row at the proposed ingredient, strength and form;
- at least one Thailand government central-price row at the proposed ingredient, strength and immediate-release oral form; and
- at least one Singapore HSA registration row at the proposed ingredient, strength and form.

This is source overlap, not proof that any two rows are the same product. All candidates therefore begin as **Group B: same active ingredient / strength / form, different or unresolved manufacturer**. No Group A branded exact match is admitted at design stage.

## Pilot chain

The pilot must prove this controlled sequence:

1. Official identity
2. Source observation
3. Product resolution
4. Comparison-basis classification
5. Human verification
6. Publication approval
7. Public comparison
8. Reverification

An official source does not bypass human verification. A source observation is not a clinical recommendation, proof of availability, proof of substitutability or permission to import.

## Market findings

### Malaysia

The [NPRA QUEST3+ product search](https://quest3plus.bpfk.gov.my/pmo2/index.php) is the primary regulatory-identity source. The public search can expose product name, registration number, registration holder, active ingredient, manufacturer or importer and registration status. It is an interactive source; no approved public bulk interface was confirmed during this review. NPRA material is copyright-protected and reproduction requires permission, so collection remains manual and `legal_review_required`.

The [Malaysia Medicines Price Guide (MyPriMe)](https://pharmacy.moh.gov.my/en/apps/drug-price) is the strongest price-intelligence source. Its fields include product registration number, generic name, brand, pack description, SKU, quantity, retail price per SKU suggested by the Product Registration Holder, suggested retail price per pack and price update year. The portal explicitly says actual market retail prices may differ. The retrospective report also says the prices were [voluntarily shared by Product Registration Holders](https://pharmacy.moh.gov.my/en/documents/retrospective-analysis-malaysia-medicines-price-guide-data-review-2012-2022.html).

Therefore MyPriMe must be stored as `recommended_retail_price_by_registration_holder`, never as an observed pharmacy cash price.

Commercial retail observations from BIG Caring Group properties and Alpro may be useful later, but terms do not grant automated reuse. They remain manual candidates pending legal and owner review.

### Thailand

The [Thai National Drug Information product database](https://ndi.fda.moph.go.th/drug_info_corporation/index/) is the primary identity source. It exposes active ingredient, trade name, dosage form, strength, licensee and registration number. Original Thai text must be retained alongside separately normalized English fields. The site provides interactive search but no approved public API was confirmed.

The [Thailand central drug-price database](https://ndi.fda.moph.go.th/drug_value/index/public/0/) is an official government reference source. The current notice says the listed central prices include 7% VAT. The source offers a downloadable Excel export and identifies pack/form, central price and notes. Its purpose is government procurement/reference pricing; it is not ordinary pharmacy retail pricing.

The site footer states copyright and all rights reserved. The structured export is technically accessible, but reuse and automated collection permission are not explicit. Treat the source as `under_review`, allow research/manual import only, and require written legal or source-owner approval before a connector.

Fascino is a legitimate commercial observation candidate, but its public terms govern platform and purchase use rather than data reuse. It remains manual-only and `legal_review_required`.

### Singapore

The [HSA Listing of Registered Therapeutic Products](https://data.gov.sg/datasets/d_767279312753558cbf19d48344577084/view) is the best first connector candidate. It provides an official CSV and API with licence number, product name, licence holder, approval date, forensic classification, ATC code, dosage form, route, manufacturer, country of manufacturer, active ingredients and strength. It was updated on 7 August 2026 during this review.

The dataset is licensed under the [Singapore Open Data Licence](https://data.gov.sg/open-data-licence), which permits commercial and non-commercial reuse with attribution and without implying government endorsement. API use is also subject to the [data.gov.sg API terms](https://data.gov.sg/privacy-and-terms).

The [Singapore MOH subsidised-drug list](https://www.moh.gov.sg/managing-expenses/schemes-and-subsidies/list-of-subsidised-drugs/) provides ingredient, form, strength, subsidy class and sometimes indication. It states that institutional availability varies. It is formulary/subsidy context only, not a consumer retail-price source.

No sufficiently reliable, reusable public Singapore retail-price source was confirmed. The correct pilot value is `missing - manual licensed source required`.

## Source-ranking framework

Score each dimension from 0 to 3 and retain reviewer narrative. A high total never overrides a legal restriction.

| Dimension | 0 | 1 | 2 | 3 |
| --- | --- | --- | --- | --- |
| Authority | unknown | secondary | licensed direct | official primary |
| Identity quality | insufficient | partial | product-level | registration-level |
| Price-basis clarity | absent | ambiguous | described | explicit and method-supported |
| Pack clarity | absent | narrative only | generally structured | complete unit and pack structure |
| Freshness | unknown | stale/irregular | dated | dated with reliable update history |
| Structured access | none | manual search | file export | documented API/CSV |
| Terms suitability | prohibited | unclear | conditionally usable | explicit reuse licence |
| Operational reliability | unstable | untested | usable | monitored official service |

Tiers:

- **Tier 1 - Official / primary:** authoritative identity or economic-basis source.
- **Tier 2 - Licensed commercial / direct observation:** a lawful direct market observation whose collection rights are separately approved.
- **Tier 3 - Supporting / secondary:** corroboration only; cannot independently support publication.
- **Rejected / unsuitable:** unclear identity, unclear basis, inaccessible evidence, prohibited reuse or unreliable provenance.

## Comparison-basis taxonomy finding

The current enum is not sufficient for the actual pilot sources. `other_verified_basis` would hide repeatable economic distinctions.

Release 2D.1 should add, through an additive migration and matching TypeScript changes:

- `recommended_retail_price_by_registration_holder` for MyPriMe;
- `government_procurement_reference_price` for Thailand central prices;
- `pharmacy_retail_cash_price` for a verified in-store or licensed e-pharmacy cash observation;
- `hospital_cash_price` as a clearer successor to the current broad `hospital_price`;
- `subsidised_or_reimbursed_price` only when an actual patient price is published.

Keep `manufacturer_list_price`, `pharmacy_list_price`, `wholesale_price` and the existing types where genuinely applicable. Do not map Singapore subsidy/formulary inclusion to a price basis. No migration is included in Release 2D.0.

## Regulatory and access taxonomy finding

The existing separation is directionally correct. Store these independently:

- registration status: registered, unregistered, unknown;
- prescription classification;
- formulary or subsidy context;
- dated availability observation;
- access or import feasibility;
- clinical suitability.

Never infer availability from registration, registration from a price row, access from a subsidy listing, or clinical suitability from any of the above.

## Freshness policy

| Source class | Source review | Observation review due | Expire from public comparison |
| --- | --- | --- | --- |
| HSA structured registration dataset | check weekly | 30 days | 60 days without successful refresh |
| NPRA / Thai FDA interactive registration | check monthly | 90 days | 120 days or immediately on status conflict |
| MyPriMe PRH-recommended price | check monthly for portal/version change | 180 days | 365 days or when update year changes |
| Thailand government central price | check monthly for new notice/export | 90 days | 180 days or immediately on superseding notice |
| Singapore MOH formulary/subsidy | check monthly | 90 days | 120 days or immediately on a dated replacement |
| Licensed retail webpage | before each capture | 14 days | 30 days |
| Manual pharmacy quote | at capture | 7 days | 14 days |
| Hospital/clinic quote | at capture | 7 days | 14 days unless the quote states less |

These intervals are pilot controls, not claims about regulator update schedules.

## Public confidence language

- **Verified Exact Match:** same identified brand/manufacturer, ingredient, strength, form, release type, route and pack; both observations human-verified and publication-approved.
- **Verified Close Equivalent:** ingredient, strength, form and clinically meaningful attributes align, but brand/manufacturer or pack differs; explicitly not interchangeable advice.
- **Indicative / Unverified:** internal and Preview only. Do not show this state in public live comparisons.

## Public UX implications for Release 2D.1

The Release 2B interface needs targeted changes before real data:

- show a prominent basis label and plain-language basis explanation;
- group prices by basis and never calculate a percentage between incompatible bases;
- distinguish exact product from generic-equivalent comparison before showing values;
- render missing markets explicitly as `No verified public price available`;
- show source date, verification date, freshness state and source attribution;
- render subsidy/formulary context separately from prices;
- block stale or expired records from comparison, not merely badge them;
- avoid public `Indicative / Unverified` price rows;
- explain that a lower observed figure does not establish access, importability, substitutability or savings.

No UI redesign or implementation is included in this release.

## Recommended first connectors for Release 2D.1

1. **HSA data.gov.sg registered-products CSV/API** - highest priority; official, structured and explicitly reusable with attribution.
2. **Singapore MOH subsidised-drug list structured import** - only after confirming a stable extraction route and source-specific reuse terms; map to access context, not price.
3. **Thailand central-price Excel import** - technically high value, but blocked from activation until reuse/automation permission is confirmed.
4. **MyPriMe structured file/manual import** - useful but blocked from automated activation until MOH reuse permission and a stable approved collection method are confirmed.

Do not prioritize commercial pharmacy webpage automation in the first connector release.

## State checkpoint

| State | Result |
| --- | --- |
| Research complete | Yes, for pilot design |
| Code/config complete | Documentation only; no connector code required |
| Local database ready | Existing 2C.2 design supports candidates; basis enum change remains recommended |
| Remote database validated | No - pending separate authorization |
| Real-data collection activated | No |
| Public real data activated | No |

## Blockers and owner decisions

1. Obtain written legal/source-owner guidance for reuse of MyPriMe, NPRA and Thailand NDI/central-price material.
2. Name collector, independent verifier and publisher roles.
3. Approve the proposed comparison-basis additions before Release 2D.1 migration design.
4. Decide whether Singapore should launch with identity and subsidy context but no retail price.
5. Approve evidence-retention location, retention period and access controls.
6. Authorize remote non-production validation separately before any migration or real-data import.

## Go / no-go recommendation

**Proceed to a small manual dry run, but do not proceed to public real-data collection or connector activation yet.** The HSA dataset is ready for a governed connector design. Malaysia and Thailand source rights remain the principal blockers.
