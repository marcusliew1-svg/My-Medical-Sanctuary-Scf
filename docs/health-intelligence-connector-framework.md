# Health Intelligence Connector Framework

Release 2C.2 provides a server-side interface for manual, CSV, structured-file, assisted-extraction, approved API, and other explicitly approved collection methods. It does not implement browser scraping or autonomous schedules.

## Approval boundary

A connector may run only when its connector record is approved, its Source Registry record is approved, the market and source identities match, the collection method is approved for that source, and its failure limit has not been reached. Source terms, restrictions, and collection methods remain governance data.

API credentials are referenced by environment-variable name. Secret values are resolved only inside the server-side API runner and are never stored in connector configuration, returned by the internal API, or rendered in the console.

## Runtime contract

An approved API adapter identifies its source and market, retrieves bounded pages with timeout and abort support, and converts each item into a candidate that retains its external identifier, original value, original language, source reference, normalization result, warnings, and row errors. The runner enforces configured request rate, exponential retry backoff, timeout, page limit, and connector failure limits.

Connectors may create collected/unverified candidates. They cannot certify identity, equivalence, price, source trust, verification, or publication. Daily, weekly, and monthly modes are schema-ready but are not autonomously scheduled in this release.

## First source onboarding

For every MY, TH, or SG source, document legal/terms permission, source owner, market and pricing basis, expected update frequency, approved method, rate limits, source restrictions, and attribution requirements before connector activation. Real source selection requires a separate owner-led source-research exercise.
