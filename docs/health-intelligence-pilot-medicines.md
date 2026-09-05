# Health Intelligence pilot medicines

Status: proposed candidates only  
Research date: 30 August 2026  
Target cohort: 23

No prices, availability claims or verified/published records are created by this file.

## Selection rules

Candidates were screened for a simple oral formulation, clear ingredient and strength, no controlled/high-risk category, useful chronic-care relevance, at least two distinct official price/reference observations, and registration-source overlap in Malaysia, Thailand and Singapore.

The source checks establish discovery candidates only. They do not prove that market registrations are currently active, that products are stocked, that products are interchangeable or that a patient can access them.

## Group A - same branded product across markets

**No products admitted in Release 2D.0.** Common international brand names were considered, but the reviewed official price sources did not establish an exact same-brand, same-manufacturer, same-form, same-strength and same-pack observation across MY/TH/SG. Group A remains intentionally empty until record-level evidence is captured and independently verified.

## Group B - same ingredient / strength / form

Scoring: regulatory coverage 0-3, price/reference coverage 0-2, simplicity 0-3, public usefulness 0-2. Maximum 10. Scores guide collection order; they do not confer verification.

| Priority | Medicine candidate | Category | Coverage | Simplicity | Usefulness | Score | Key matching control |
| ---: | --- | --- | ---: | ---: | ---: | ---: | --- |
| 1 | Amlodipine 5 mg tablet | cardiovascular | 3 | 3 | 2 | 10 | normalize besylate/besilate without changing labelled strength |
| 2 | Losartan 50 mg tablet | cardiovascular | 3 | 3 | 2 | 10 | distinguish potassium salt and exclude combinations |
| 3 | Atenolol 50 mg tablet | cardiovascular | 3 | 3 | 2 | 10 | immediate-release tablet only |
| 4 | Enalapril 5 mg tablet | cardiovascular | 3 | 3 | 2 | 10 | normalize maleate/base carefully |
| 5 | Metformin 500 mg tablet | diabetes | 3 | 3 | 2 | 10 | exclude XR, ER, PR, SR and combinations |
| 6 | Gliclazide 80 mg tablet | diabetes | 3 | 3 | 2 | 10 | exclude modified-release products |
| 7 | Glipizide 5 mg tablet | diabetes | 3 | 3 | 2 | 10 | exclude extended-release products |
| 8 | Sitagliptin 100 mg tablet | diabetes | 3 | 3 | 2 | 10 | exclude combination tablets |
| 9 | Atorvastatin 20 mg tablet | cholesterol | 3 | 3 | 2 | 10 | normalize calcium/base; exact strength required |
| 10 | Simvastatin 20 mg tablet | cholesterol | 3 | 3 | 2 | 10 | immediate-release tablet only |
| 11 | Rosuvastatin 10 mg tablet | cholesterol | 3 | 3 | 2 | 10 | normalize calcium/base; exact strength required |
| 12 | Cetirizine 10 mg tablet | allergy | 3 | 3 | 2 | 10 | distinguish cetirizine salts and levocetirizine |
| 13 | Loratadine 10 mg tablet | allergy | 3 | 3 | 2 | 10 | exclude pseudoephedrine combinations |
| 14 | Paracetamol 500 mg tablet | common analgesic | 3 | 3 | 2 | 10 | strict brand/pack resolution due to many products |
| 15 | Ibuprofen 200 mg tablet | common analgesic | 3 | 3 | 2 | 10 | tablet only; exclude capsules and liquids |
| 16 | Allopurinol 100 mg tablet | chronic gout | 3 | 3 | 2 | 10 | exact ingredient and strength |
| 17 | Telmisartan 40 mg tablet | cardiovascular | 3 | 2 | 2 | 9 | exclude hydrochlorothiazide/amlodipine combinations |
| 18 | Bisoprolol 5 mg tablet | cardiovascular | 3 | 2 | 2 | 9 | reject 2.5 mg substring matches |
| 19 | Doxycycline 100 mg tablet or capsule | anti-infective | 3 | 2 | 2 | 9 | tablet and capsule remain separate cohorts; salt review |
| 20 | Azithromycin 250 mg tablet | anti-infective | 3 | 2 | 2 | 9 | no treatment or course guidance; exact form required |
| 21 | Colchicine 0.6 mg tablet | gout | 3 | 2 | 2 | 9 | never merge with 0.5 mg products |
| 22 | Omeprazole 20 mg capsule | acid suppression | 3 | 1 | 2 | 8 | enteric/delayed-release presentation must align |
| 23 | Pantoprazole 40 mg tablet | acid suppression | 3 | 1 | 2 | 8 | enteric-coated presentation must align |

## Capture order

### Wave 1 - 10 controls

Amlodipine, losartan, atenolol, metformin, gliclazide, atorvastatin, simvastatin, cetirizine, paracetamol and allopurinol.

These are the simplest candidates and should be used to validate the SOP, evidence model and reviewer agreement.

### Wave 2 - 8 broader candidates

Enalapril, glipizide, sitagliptin, rosuvastatin, loratadine, ibuprofen, telmisartan and bisoprolol.

Proceed only if Wave 1 passes the quality gates.

### Wave 3 - 5 controlled complexity candidates

Doxycycline, azithromycin, colchicine, omeprazole and pantoprazole.

These require explicit form, salt, strength or release-presentation review. They must not be used to loosen matching rules.

## Product candidate template

Each product candidate must include:

| Field | Rule |
| --- | --- |
| original source text | exact, unedited source text |
| original language | ISO language code; Thai remains `th` |
| normalized ingredient | separate reviewer-entered field |
| salt/ester | explicit; never silently discarded |
| strength | value plus unit and labelled equivalence rule |
| dosage form | controlled normalized form plus original form |
| release type | immediate, enteric/delayed or other explicit type |
| route | explicit oral route for this pilot |
| brand | exact source brand or `not provided` |
| manufacturer/holder | exact source party and role |
| pack | unit, quantity, container and nested pack structure |
| market registration | registration number, source, status and checked-at date |
| match group | Group A or Group B; default Group B |
| reviewer decision | approve, reject, merge or unresolved |

## Explicit exclusions

Do not add biologics, biosimilars, oncology products, narrow-therapeutic-index medicines, controlled medicines, complex injectables, combinations, modified/extended-release products, devices, unusual salts/esters or unclear packs to this pilot without a new release decision.
