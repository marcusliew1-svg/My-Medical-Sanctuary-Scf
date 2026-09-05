# Wave 3 migration manifest

This manifest resolves the duplicate `0021` repository numbering before Commission Control Centre integration. It records repository evidence only. No database or Supabase operation was performed.

| Final filename | Purpose | Source and introducing commit | Dependency | Baseline equivalent | Application evidence | Disposition |
| --- | --- | --- | --- | --- | --- | --- |
| `0021_mms_database_post_provision_hardening.sql` | Pin trusted trigger-function search paths, add commercial foreign-key indexes and register the canonical `0015` manifest key | `commission-control-centre`, `7d921c04b0f659cfc106cc4eab461555a1d28807` | Commercial migrations through `0020` | No; the Wave 2 source tree lacks these index and manifest changes | `MMS_ACTIVATION_CHECKLIST.md` and `MMS_RELEASE_RUNBOOK.md` at `cb43111`/`75885c0` record it as applied and verified on standalone MMS on 22 August 2026 | Preserve filename and content because repository history records it as applied |
| `0022_mms_health_intelligence_foundation.sql` | Health Intelligence product identity, provenance, immutable price/FX history, verification, publication and audit foundation | Release 2D.0A integration, `c54fbe04027bd40f6f1aa5854d80d73ba934768b`; formerly numbered `0021` | Applied commercial hardening `0021` | Wave 2 contains the schema under the conflicting old filename | Release 2D.0 records remote database validation as not completed; Release 2D.0B required separate authorization before applying it | Rename the unapplied conflicting migration to the next migration number |
| `0023_mms_health_intelligence_data_operations.sql` | Source governance, operational observations, evidence, freshness and review queues | Release 2D.0A integration, `c54fbe04027bd40f6f1aa5854d80d73ba934768b`; formerly numbered `0022` | Health Intelligence foundation | Wave 2 contains the schema under the old filename | README explicitly records this migration as migration-ready but not applied remotely | Shift with its unapplied dependency chain |
| `0024_mms_health_intelligence_assisted_ingestion.sql` | Controlled connectors, batches, row lineage, idempotency and assisted ingestion | Release 2D.0A integration, `c54fbe04027bd40f6f1aa5854d80d73ba934768b`; formerly numbered `0023` | Health Intelligence data operations | Wave 2 contains the schema under the old filename | Release 2D.0B required a separately authorized non-production target before applying pending Health Intelligence migrations; no repository record marks it applied | Shift with its unapplied dependency chain |

## Conflict resolution

The applied commercial migration keeps `0021`. The entirely unapplied Health Intelligence chain moves together from `0021–0023` to `0022–0024` so migration tooling retains dependency order. Ledger keys, structural probes, grants documentation, QA checks, release tests and documentation use the final filenames.

If a future direct ledger inspection contradicts the repository evidence above, stop before applying any migration and reconcile the environment-specific history. Never apply a renamed migration merely to satisfy the application probe.
