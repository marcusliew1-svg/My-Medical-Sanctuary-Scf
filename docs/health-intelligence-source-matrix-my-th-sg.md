# Health Intelligence source matrix: Malaysia, Thailand and Singapore

Status: candidate registry design only  
Research date: 30 August 2026

All source candidates remain `candidate` or `under_review`. Nothing in this document authorizes collection, automation or publication.

## Source registry candidates

| Code | Market | Source | Tier | Contains | Economic basis | Access | Terms status | Adapter recommendation | Registry status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MY-NPRA-QUEST | MY | [NPRA QUEST3+](https://quest3plus.bpfk.gov.my/pmo2/index.php) | 1 | regulatory identity/status | none | interactive search | copyright; permission required for reproduction | Manual; do not automate | under_review |
| MY-MOH-MYPRIME | MY | [MOH MyPriMe](https://pharmacy.moh.gov.my/en/apps/drug-price) | 1 | registration-linked suggested prices and packs | PRH-suggested retail price | HTML table | all rights reserved; reuse unclear | Manual/structured file only after permission | under_review |
| MY-BIG-CARING | MY | [BIG Caring Group platform](https://www.bigpharmacy.com.my/) | 2 | commercial product/list price where visible | pharmacy list or retail cash, capture-specific | retail website | purchase/use terms; no data-reuse grant found | Manual only; legal review | candidate |
| MY-ALPRO | MY | [Alpro OneClick](https://www.alpropharmacy.com/oneclick/) | 2 | commercial product/list price where visible | pharmacy list or promotional retail, capture-specific | retail website | reuse permission not found | Manual only; legal review | candidate |
| TH-NDI-REG | TH | [National Drug Information product database](https://ndi.fda.moph.go.th/drug_info_corporation/index/) | 1 | ingredient, trade name, form, strength, licensee, registration | none | interactive search | all rights reserved; reuse unclear | Manual; preserve Thai text; do not automate | under_review |
| TH-NDI-CENTRAL | TH | [National central drug-price database](https://ndi.fda.moph.go.th/drug_value/index/public/0/) | 1 | generic, form/strength, pack, central price, notes | government procurement/reference, VAT-inclusive | HTML + Excel export | all rights reserved; automation/reuse unclear | Structured file import only after permission | under_review |
| TH-FASCINO | TH | [Fascino Telepharmacy](https://telepharmacy.fascino.co.th/) | 2 | direct commercial observation where visible | pharmacy retail/list, capture-specific | retail/telepharmacy website | platform/purchase terms; no data-reuse grant found | Manual only; legal review | candidate |
| SG-HSA-TP | SG | [HSA registered therapeutic products](https://data.gov.sg/datasets/d_767279312753558cbf19d48344577084/view) | 1 | complete regulatory identity dataset | none | official CSV/API | Singapore Open Data Licence + API terms | Official API or CSV import | under_review |
| SG-MOH-SUBSIDY | SG | [MOH subsidised-drug list](https://www.moh.gov.sg/managing-expenses/schemes-and-subsidies/list-of-subsidised-drugs/) | 1 | ingredient, form, strength, subsidy class, indications | formulary/subsidy context; not price | public HTML | website reuse terms require review | Manual/structured file after review | under_review |
| SG-HSA-PHARMACY | SG | [HSA retail-pharmacy licence search](https://eservice.hsa.gov.sg/prism/common/enquirepublic/SearchPharmacy.do?action=load) | 1 | licensed pharmacy operator/outlet identity | none | interactive search with security check | public lookup; bulk reuse unclear | Manual validation only | under_review |
| SG-WATSONS | SG | [Watsons Singapore](https://www.watsons.com.sg/) | 2 | OTC and other visible commercial observations | pharmacy list/retail, capture-specific | retail website | terms permit shopping use; no data-reuse grant found | Manual only; legal review | candidate |

## Source ranking

Scores are 0-3 for authority, identity, basis, pack, freshness, structure, terms and reliability. Terms restrictions override total score.

| Source | A | I | B | P | F | S | T | R | Total / 24 | Reviewer narrative |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| SG HSA therapeutic products | 3 | 3 | 0 | 2 | 3 | 3 | 3 | 3 | 20 | Best first identity connector; explicit licence and attribution path. |
| MY MyPriMe | 3 | 3 | 3 | 3 | 2 | 2 | 1 | 2 | 19 | Strong source, but basis is PRH-suggested and reuse rights are unresolved. |
| TH central drug price | 3 | 2 | 3 | 3 | 2 | 2 | 1 | 2 | Strong government reference source; not retail; export rights need approval. |
| TH NDI regulatory | 3 | 3 | 0 | 1 | 2 | 1 | 1 | 2 | Strong identity search; Thai originals required; no approved bulk route. |
| MY NPRA QUEST | 3 | 3 | 0 | 2 | 2 | 1 | 1 | 2 | Strong identity source; manual use only pending permission. |
| SG MOH subsidised list | 3 | 2 | 0 | 1 | 3 | 1 | 1 | 3 | Useful access context; cannot substitute for price. |
| Licensed commercial candidates | 2 | 1 | 2 | 1 | 3 | 0 | 0 | 2 | Useful dated observations, but manual-only until rights and identity controls are approved. |

## Pilot product/source coverage

Legend:

- `P` - proposed source contains a matching ingredient/strength/form candidate; capture and verification pending.
- `R` - regulatory search/dataset contains matching candidate records; exact product resolution pending.
- `C` - context only, not price.
- `M` - no verified public price source; manual licensed source required.

| Product candidate | MY regulatory | MY price | TH regulatory | TH price | SG regulatory | SG price | Match type | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Amlodipine 5 mg tablet | R | P | R | P | R | M | Group B | Simple immediate-release candidate. |
| Losartan 50 mg tablet | R | P | R | P | R | M | Group B | Salt normalization required. |
| Telmisartan 40 mg tablet | R | P | R | P | R | M | Exclude combination rows. |
| Atenolol 50 mg tablet | R | P | R | P | R | M | Simple immediate-release candidate. |
| Bisoprolol 5 mg tablet | R | P | R | P | R | M | Exclude 2.5 mg substring/strength mismatches. |
| Enalapril 5 mg tablet | R | P | R | P | R | M | Normalize maleate/base carefully. |
| Metformin 500 mg tablet | R | P | R | P | R | M | Exclude XR/PR/ER products. |
| Gliclazide 80 mg tablet | R | P | R | P | R | M | Exclude MR products. |
| Glipizide 5 mg tablet | R | P | R | P | R | M | Exclude extended-release products. |
| Sitagliptin 100 mg tablet | R | P | R | P | R | M | Exclude combinations. |
| Atorvastatin 20 mg tablet | R | P | R | P | R | M | Normalize calcium/base. |
| Simvastatin 20 mg tablet | R | P | R | P | R | M | Simple immediate-release candidate. |
| Rosuvastatin 10 mg tablet | R | P | R | P | R | M | Normalize calcium/base. |
| Omeprazole 20 mg capsule | R | P | R | P | R | M | Enteric-coated presentation; moderate matching complexity. |
| Pantoprazole 40 mg tablet | R | P | R | P | R | M | Enteric-coated presentation; moderate matching complexity. |
| Cetirizine 10 mg tablet | R | P | R | P | R | M | Normalize salt nomenclature. |
| Loratadine 10 mg tablet | R | P | R | P | R | M | Simple immediate-release candidate. |
| Doxycycline 100 mg capsule/tablet | R | P | R | P | R | M | Tablet and capsule are separate comparison cohorts. |
| Azithromycin 250 mg tablet | R | P | R | P | R | M | Anti-infective; identity-only, no treatment guidance. |
| Paracetamol 500 mg tablet | R | P | R | P | R | M | High public usefulness; many brands require strict product resolution. |
| Ibuprofen 200 mg tablet | R | P | R | P | R | M | Exclude capsules and modified formulations. |
| Allopurinol 100 mg tablet | R | P | R | P | R | M | Simple immediate-release candidate. |
| Colchicine 0.6 mg tablet | R | P | R | P | R | M | Strength must be exact; do not mix 0.5 mg products. |

The Malaysia `R` marker means the MyPriMe candidate carries a Malaysia registration number; QUEST status must still be independently confirmed during collection. Thailand `R` and Singapore `R` require exact record capture, not merely ingredient search overlap.

## Missing and rejected pilot candidates

| Candidate | Decision | Reason |
| --- | --- | --- |
| Fexofenadine 120 mg tablet | defer | No matching MyPriMe or Thailand central-price row confirmed. |
| Famotidine 20 mg tablet | defer | Thailand central-price overlap not confirmed. |
| Amoxicillin 500 mg capsule | defer | Standalone Malaysia MyPriMe row not confirmed in the reviewed dataset. |
| All same-brand Group A candidates | defer | No official-source evidence yet proves the same brand, manufacturer, strength, form and pack across all three markets. |

## Source attribution templates

For HSA data.gov.sg output:

> Contains information from the HSA Listing of Registered Therapeutic Products, accessed on [date], made available under the Singapore Open Data Licence version 1.0.

For all other sources, use a factual source citation only after legal approval. Do not imply regulator endorsement of MMS.
