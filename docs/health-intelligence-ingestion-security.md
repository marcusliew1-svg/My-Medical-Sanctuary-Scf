# Ingestion Security and Privacy

The ingestion API is internal, no-store, same-origin for mutations, body-size limited, and protected by the existing short-lived operator session or server token. Collection/review capabilities follow operational roles; connector configuration and activation require admin authority. Collectors cannot publish.

Connector secret values live only in server environment variables. Configuration stores environment-variable names, and the database rejects common plaintext credential keys in connector JSON. Public, anon, and authenticated roles receive no table privileges on connector, batch, row, evidence, or raw observation tables. Row lineage becomes immutable after observation creation.

Public Health Intelligence output omits batch IDs, row errors, credentials, restrictions, evidence, and private notes. Demo and real records remain explicit storage classes. Non-demo public reads require `MMS_HEALTH_INTELLIGENCE_REAL_DATA_ENABLED=true` in addition to existing verification and publication eligibility.

Failures preserve auditable batch and row errors without verifying or publishing partial work. Fingerprints, external item identifiers, and observation signatures limit accidental duplicate ingestion. Screenshots and source documents remain private evidence and are not public assets.
