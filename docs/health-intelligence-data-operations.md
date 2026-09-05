# Health Intelligence Data Operations SOP

## Add a source

1. Open the internal Health Intelligence console and add a candidate source.
2. Preserve its real name and reference exactly. Record what the source usually represents; do not assume the basis.
3. A reviewer checks the source, assigns trust with a reason, and approves, restricts or suspends it.

## Record a medicine observation

1. Select the source and country.
2. Copy the original medicine wording exactly, including Thai text where present.
3. Record price, currency, pack, basis if known, observation date and evidence reference.
4. Submit as Collected. The entry form cannot publish.

## Resolve a product

1. Search the MMS product master using brand, ingredient, manufacturer, strength, form, release and pack.
2. Confirm an exact product only when every material identity field agrees.
3. If uncertain, route to Candidate Product or Unresolved Products. Never create a product silently.

## Verify or reject

1. Complete identity, basis and source review checkpoints.
2. Check duplicate and anomaly flags. Similar prices over time are legitimate history; do not delete them.
3. Reject with a reason when evidence is inadequate. Rejected records remain in the audit trail.
4. A reviewer verifies. A publisher separately approves publication when policy requires four eyes.

## Recheck stale data

1. Work from Reverification Due.
2. Revisit the source and evidence; add a new observation instead of overwriting history.
3. Mark the older record stale or expired. Preserve contradictory approved observations and resolve the variance through review.
# Release 2C.2 ingestion addendum

Approved source collection now enters the operations workflow through traceable ingestion batches. Operators must validate and preview a batch, resolve only permitted product candidates, inspect warnings and unresolved rows, and explicitly confirm import. Imported observations remain collected/unverified and continue through the existing four-eyes source, product, basis, price, verification, and publication controls. Connector activation/deactivation, batch lifecycle, import confirmation, and row resolution are audited.

