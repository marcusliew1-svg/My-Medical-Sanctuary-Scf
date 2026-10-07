# MMS OS Implementation Register

**Document ID:** MMS-GOV-REG-001  
**Status:** WORKING DRAFT

## Implementation scope

This register tracks the transition from conceptual framework to controlled operating system.

| Workstream | Implementation artifact | Current status | Production authority |
| --- | --- | --- | --- |
| Master governance | MMS-GOV-FRM-001 | Implemented in repo as Working Draft | None |
| Structured governance data | database/migrations/0026_mms_operating_system_governance.sql | Applied successfully to dedicated MMS Preview branch | None |
| Master documents | governance_documents table | Preview live; 1 master document seed | None |
| Decisions | governance_decisions table | Schema ready | None |
| Risks | risks table | Schema ready | None |
| Controls | controls + risk_control_links | Schema ready | None |
| CAPA | capa_actions table | Schema ready | None |
| Clinical services | clinical_services table | Schema ready; no services activated | None |
| Facilities | facilities table | Schema ready; no facility approvals asserted | None |
| Clinician credentials | clinician_credentials table | Schema ready | None |
| Privileges | clinician_privileges table | Schema ready | None |
| Suppliers | suppliers table | Schema ready | None |
| Products | products table | Schema ready | None |
| Diagnostic partners | diagnostic_partners table | Schema ready | None |
| AI use cases | ai_use_cases table | Schema ready | None |
| Launch control | launch_capabilities table | Preview live; 10 capability seeds | None |
| Change control | change_requests table | Schema ready | None |
| Audit | audits table | Schema ready | None |
| Incidents | incidents table | Schema ready | None |
| Training | training_records table | Schema ready | None |

## Explicit boundaries

- No Production deployment is authorized.
- No database migration is applied by this branch.
- No clinical service is marked Active.
- No patient clinical information belongs in the governance schema.
- No Zoho / Supabase / Vercel credential changes are made.
- Existing controlled informational Production site remains untouched.
- Existing Partner and Patient operational gates remain untouched.
- Legal, privacy, Medical Director and jurisdiction-specific approvals remain external blockers.

## Next controlled implementation sequence

1. Preview migration applied successfully to dedicated MMS Preview branch.
2. Transactional QA 017 passed with rollback and forced-RLS/direct-grant assertions.
3. Foreign-key index hardening applied successfully.
4. Seeded governance records contain only framework/capability metadata; no patient-clinical payloads.
5. Build operator-only governance APIs / dashboard behind existing operator auth.
6. Assign named owners in the registers.
7. Move documents from WORKING DRAFT to REVIEW only with human approver evidence.
8. Keep all clinical services non-Active until regulatory, clinical and facility approvals are complete.
9. Keep Production capability activation independent and explicit.

## Acceptance condition

The OS foundation is considered implemented when:

- the controlled framework exists in the repository;
- the governance schema is reviewed and successfully applied to Preview;
- RLS remains forced and direct anonymous/authenticated access is absent;
- synthetic QA proves referential integrity and lifecycle constraints;
- operator-only read/write paths exist for the approved governance roles;
- management can see RED/AMBER/GREEN capability state and overdue governance actions.

Until those checks are complete, status remains **IMPLEMENTED IN CODE / NOT OPERATIONALLY ACTIVATED**.

## Preview execution evidence — 2026-10-07

- Dedicated Preview branch: `mms-preview-auth` / `tfwnlmmdrkkfrtmawpma`.
- Migration `mms_operating_system_governance`: PASS.
- QA `017_mms_operating_system_governance.sql`: PASS.
- Migration `mms_governance_fk_index_hardening`: PASS.
- 20 governance tables present with RLS enabled.
- Seed state: 1 master framework document; 10 launch capability records; zero clinical service records activated.
- Security advisor reports RLS enabled with no policies on governance tables. This is intentional fail-closed behavior at this stage because direct `public`, `anon`, and `authenticated` grants are revoked. Operator access must be added later through an explicitly approved server-side access path.
- Existing Preview Auth leaked-password-protection warning remains unresolved and is outside this migration.
- No Production project, iPivot project, Production deployment, Production gate or Production credential was changed.
