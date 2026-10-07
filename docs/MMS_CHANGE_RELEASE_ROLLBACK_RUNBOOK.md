# MMS Change Management, Release Governance & Rollback Runbook

**Document ID:** MMS-CHG-RUN-001  
**Status:** WORKING DRAFT

## Change classes

**STANDARD** — low-risk repeatable change using an approved method.  
**NORMAL** — planned change requiring impact assessment and approval.  
**EMERGENCY** — urgent containment/recovery change where delay creates material risk.

Emergency classification compresses timing only. It does not remove the need for evidence, approval, rollback planning, or post-implementation verification.

## Required release evidence

Before a release:
1. identify the exact source commit SHA;
2. verify the target environment;
3. confirm applicable CI/security/governance gates for that exact commit;
4. identify schema/configuration dependencies;
5. document rollback or forward-fix strategy;
6. obtain explicit Production approval evidence where Production is involved;
7. define post-deploy verification criteria;
8. define monitoring and incident escalation for the change window.

## Preview versus Production

Preview readiness is evidence of technical validation only. It is not Production authority.

A Preview deployment must not be treated as the same tested artifact as a staged Production build if Production environment variables/configuration cause a rebuild. Release governance must identify the exact Production artifact/commit and verification evidence.

## Rollback readiness

Rollback must identify a known-good target and account for database/data compatibility. If rollback could corrupt or misrepresent state, the affected capability must fail closed and use controlled recovery/reconciliation instead.

## Governance integration

MMS already has a `mms_governance.change_requests` record model with status, approver role, approval reference, rollback plan, implementation time and verification time. T6.27 uses that model as the canonical governance record rather than creating a competing change database.

## Production boundary

T6.27 does not authorize or perform a Production release, alter branch protection, appoint a change approver, enable any Production feature gate, or activate any clinical service.
