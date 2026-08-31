# Health Intelligence pilot SOP

Status: Release 2D.0 operating design  
Applies to: first 23 MY/TH/SG candidates

## Roles

- **Collector:** captures source evidence and submits an unverified observation.
- **Identity reviewer:** resolves product identity and market-registration evidence.
- **Basis reviewer/verifier:** confirms economic basis, pack, price, currency, date and source eligibility.
- **Publisher:** approves or rejects public use.
- **Source owner:** maintains source terms, trust, status and review dates.

For every public price observation, `collector != verifier`. Prefer collector, verifier and publisher as three different people. If verifier and publisher must be the same person, record the exception and owner approval. Collector and publisher must never be the same person for the pilot.

## Preconditions

1. Source Registry record exists and is `under_review` or `approved`.
2. Approved collection method includes `manual` or the explicitly approved structured method.
3. Legal/terms record is current.
4. Collector has no source-owner or reviewer role conflict.
5. Product is on the approved pilot list.
6. Evidence storage location and access controls are available.

An `under_review` source may support an internal dry run only. It cannot support public publication.

## Observation workflow

### 1. Open and identify the source

Record source code, URL, source owner, access date/time, market, language and source version/notice. Confirm that no CAPTCHA or access control is bypassed.

### 2. Capture original evidence

Capture the exact original product text, original language, source item identifier, registration/licence number, brand, ingredient, strength, form, route, release type, manufacturer/holder, pack, displayed price, currency, basis wording, observation date and source notes.

Do not translate over the original. Thai originals remain intact; normalized English values are separate fields.

### 3. Retain evidence

Use the evidence rules below. Calculate a SHA-256 checksum for downloaded files. Record capture timestamp and collector. Keep private evidence private.

### 4. Resolve the product

Match against MMS product identity using ingredient, strength, unit, salt/ester, dosage form, release type, route, brand, manufacturer and pack.

- Group A requires all exact-product dimensions and pack to match.
- Group B permits different brand/manufacturer but requires exact ingredient, strength, clinically meaningful form, release type and route.
- Pack differences are retained and normalized; they do not become an exact pack match.
- Any hard mismatch remains unresolved or rejected.

### 5. Classify the economic basis

Record the source's actual basis, not a convenient display label.

- MyPriMe: `recommended_retail_price_by_registration_holder`.
- Thailand central price: `government_procurement_reference_price`.
- Retail observation: `pharmacy_retail_cash_price` or `pharmacy_list_price`, based on evidence.
- Singapore MOH subsidy list: no price observation; create access/formulary context only.

If basis is uncertain, set `basis_unverified` and stop progression.

### 6. Submit observation

Set workflow stage to `collected`, data class to `real_unverified`, availability to `unknown` unless directly evidenced, and attach evidence references. Do not mark verified or published.

### 7. Identity review

The identity reviewer independently reopens the official registration source and confirms record, status, checked date and exact identity fields. Registration does not establish availability or access.

### 8. Basis and source review

The verifier independently checks source status, rights, amount, currency, pack, unit, VAT/tax context, date and basis. Recalculate normalized unit values independently. Record discrepancies.

### 9. Publication decision

The publisher checks every quality gate. Publication is all-or-nothing for the observation. Reject or return any incomplete, stale, unresolved, incompatible or legally blocked record.

### 10. Reverification

Schedule review based on source class. A superseding notice, registration conflict, source suspension, terms change, pack change or material price conflict immediately moves the record to `needs_reverification` and removes it from public comparison.

## Evidence rules

| Evidence type | Required private evidence | Public provenance |
| --- | --- | --- |
| Official web record | URL, timestamp, screenshot or PDF capture where permitted, exact text, source/version | source name, URL, checked date, basis |
| Downloadable official dataset | original file, filename, access URL, timestamp, SHA-256, licence/version | dataset name, source, access date, licence attribution |
| Pharmacy webpage | URL, timestamp, screenshot where permitted, product/pack/price text, stock/promotion context | licensed source name/type, observed date, basis; only after legal approval |
| Manual quote | quote reference, date/time, outlet, role of person providing quote, exact pack and conditions | source type and date only unless consent permits more |
| PDF/notice | original file, issuing body, title, issue/effective date, checksum and cited page | issuing body, title, date and public link |

## Pack normalization checklist

- outer pack quantity;
- inner blister/bottle quantity;
- units per inner pack;
- total dispensable units;
- unit type;
- concentration and volume where relevant;
- promotional bonus units excluded or explicitly represented;
- price includes or excludes tax/delivery/consultation;
- pack shown is purchasable as observed.

Never infer pack quantity from a product image alone.

## Exception handling

- **Missing Singapore price:** publish `No verified public price available` only after public UX supports it; never substitute subsidy data.
- **Different price bases:** display separately; do not calculate savings or percentage difference.
- **Registration conflict:** suspend observation until resolved.
- **Retail promotion:** classify as promotional, set short validity and do not compare with standard list prices.
- **Source terms change:** suspend source and all dependent public records pending review.
- **Reviewer disagreement:** return to identity/basis review; no majority shortcut.
- **Potential clinical substitution:** stop and refer to clinician; not a data-resolution decision.

## Public language controls

Allowed: medicine intelligence, price discovery, cost comparison, regional healthcare intelligence, observed price, reference price.

Disallowed: guaranteed access, guaranteed savings, automatic import, equivalent for you, safe to switch, cheapest treatment, or any instruction to buy or change medicine.
