-- MMS controlled document catalogue baseline.
-- All entries remain WORKING_DRAFT unless separately approved.

begin;

insert into mms_governance.governance_documents
(document_id,title,domain,owner_role,approver_role,version,status,confidentiality,evidence_location,notes)
values
('MMS-GOV-POL-001','Governance and Delegated Authority Policy','Corporate Governance','Management',null,'0.1','WORKING_DRAFT','Internal','docs/MMS_MASTER_OPERATING_SYSTEM_V1.md','Framework source pending formal controlled-policy extraction.'),
('MMS-GOV-POL-002','Conflict of Interest Policy','Corporate Governance','Compliance',null,'0.1','WORKING_DRAFT','Internal','docs/MMS_MASTER_OPERATING_SYSTEM_V1.md','Includes referral, supplier, clinician and ownership conflicts.'),
('MMS-OPS-SOP-001','Clinic Manager Operating SOP','Commercial Operations','Commercial Operations',null,'0.1','WORKING_DRAFT','Internal','docs/MMS_MASTER_OPERATING_SYSTEM_V1.md','Administrative/commercial only; no clinical authority.'),
('MMS-CRM-POL-001','CRM Data and Lifecycle Policy','Commercial Operations','Commercial Operations',null,'0.1','WORKING_DRAFT','Internal','docs/MMS_MASTER_OPERATING_SYSTEM_V1.md','Zoho/commercial data boundary and canonical lifecycle.'),
('MMS-PAT-POL-001','My Sanctuary Administrative Scope Policy','Patient Administration','Patient Operations',null,'0.1','WORKING_DRAFT','Internal','docs/MMS_MASTER_OPERATING_SYSTEM_V1.md','Patient relationship/admin layer, not primary clinical record.'),
('MMS-PAR-POL-001','Partner Governance and Attribution Policy','Partner Operations','Partner Operations',null,'0.1','WORKING_DRAFT','Internal','docs/MMS_MASTER_OPERATING_SYSTEM_V1.md','Introducer model, attribution lock and clinical boundary.'),
('MMS-FIN-POL-001','Commission Eligibility and Approval Policy','Finance','Finance',null,'0.1','WORKING_DRAFT','Restricted','docs/MMS_MASTER_OPERATING_SYSTEM_V1.md','Estimated through reversed lifecycle and maker/checker control.'),
('MMS-PRI-POL-001','Privacy and Data Classification Policy','Privacy & Data','Privacy / Compliance',null,'0.1','WORKING_DRAFT','Restricted','docs/MMS_MASTER_OPERATING_SYSTEM_V1.md','Requires jurisdiction-specific privacy/legal review.'),
('MMS-PRI-POL-002','Data Retention and Legal Hold Policy','Privacy & Data','Privacy / Compliance',null,'0.1','WORKING_DRAFT','Restricted','docs/MMS_MASTER_OPERATING_SYSTEM_V1.md','Exact retention periods pending jurisdiction-specific advice.'),
('MMS-CLN-POL-001','Clinical Governance Framework','Clinical Governance','Medical Director',null,'0.1','WORKING_DRAFT','Restricted','docs/MMS_MASTER_OPERATING_SYSTEM_V1.md','Medical Director approval pending.'),
('MMS-CLN-POL-002','Clinical Service Approval Policy','Clinical Governance','Medical Director',null,'0.1','WORKING_DRAFT','Restricted','docs/MMS_MASTER_OPERATING_SYSTEM_V1.md','Service activation and suspension rules.'),
('MMS-CLN-SOP-001','Clinical Documentation Standard','Clinical Operations','Medical Director',null,'0.1','WORKING_DRAFT','Restricted','docs/MMS_MASTER_OPERATING_SYSTEM_V1.md','Draft/signed/amended record standard.'),
('MMS-CLN-SOP-002','Clinical Consent Framework','Clinical Operations','Medical Director',null,'0.1','WORKING_DRAFT','Restricted','docs/MMS_MASTER_OPERATING_SYSTEM_V1.md','General, treatment-specific and special-purpose consent.'),
('MMS-CLN-SOP-003','Diagnostic Results and Critical Result SOP','Clinical Operations','Medical Director',null,'0.1','WORKING_DRAFT','Restricted','docs/MMS_MASTER_OPERATING_SYSTEM_V1.md','Acknowledgement and escalation required.'),
('MMS-CLN-SOP-004','Medication Governance SOP','Clinical Operations','Medical Director',null,'0.1','WORKING_DRAFT','Restricted','docs/MMS_MASTER_OPERATING_SYSTEM_V1.md','Prescribing, reconciliation and monitoring governance.'),
('MMS-CLN-SOP-005','Treatment Administration and Safety Time-Out SOP','Clinical Operations','Medical Director',null,'0.1','WORKING_DRAFT','Restricted','docs/MMS_MASTER_OPERATING_SYSTEM_V1.md','Patient/product/protocol verification and safety stop.'),
('MMS-CLN-SOP-006','Adverse Event and Clinical Incident SOP','Quality & Safety','Medical Director',null,'0.1','WORKING_DRAFT','Restricted','docs/MMS_MASTER_OPERATING_SYSTEM_V1.md','Detect through CAPA and closure.'),
('MMS-WRK-POL-001','Credentialing and Privileging Policy','Clinical Workforce','Medical Director',null,'0.1','WORKING_DRAFT','Restricted','docs/MMS_MASTER_OPERATING_SYSTEM_V1.md','System access is not clinical privilege.'),
('MMS-WRK-POL-002','Clinical Competency and Training Framework','Clinical Workforce','Medical Director',null,'0.1','WORKING_DRAFT','Restricted','docs/MMS_MASTER_OPERATING_SYSTEM_V1.md','Competency demonstrated before privilege activation.'),
('MMS-WRK-POL-003','Clinical Staffing and Coverage Framework','Clinical Workforce','Medical Director',null,'0.1','WORKING_DRAFT','Restricted','docs/MMS_MASTER_OPERATING_SYSTEM_V1.md','Minimum safe operating condition by service.'),
('MMS-FAC-POL-001','Facility and Emergency Readiness Framework','Facilities','Clinical Operations',null,'0.1','WORKING_DRAFT','Restricted','docs/MMS_MASTER_OPERATING_SYSTEM_V1.md','Facility capability and emergency readiness.'),
('MMS-SUP-POL-001','Supplier and Product Quality Policy','Products & Suppliers','Quality / Compliance',null,'0.1','WORKING_DRAFT','Restricted','docs/MMS_MASTER_OPERATING_SYSTEM_V1.md','Qualification, quarantine, release, traceability and recall.'),
('MMS-DIA-POL-001','Diagnostic Partner Governance Policy','Diagnostics','Medical Director',null,'0.1','WORKING_DRAFT','Restricted','docs/MMS_MASTER_OPERATING_SYSTEM_V1.md','Partner qualification, specimen and result integrity.'),
('MMS-QMS-POL-001','Risk Management Framework','Quality & Safety','Quality / Compliance',null,'0.1','WORKING_DRAFT','Internal','docs/MMS_MASTER_OPERATING_SYSTEM_V1.md','Enterprise seven-domain risk framework.'),
('MMS-QMS-POL-002','Control and Assurance Framework','Quality & Safety','Quality / Compliance',null,'0.1','WORKING_DRAFT','Internal','docs/MMS_MASTER_OPERATING_SYSTEM_V1.md','Preventive/detective/corrective controls and three lines of assurance.'),
('MMS-QMS-SOP-001','CAPA SOP','Quality & Safety','Quality / Compliance',null,'0.1','WORKING_DRAFT','Internal','docs/MMS_MASTER_OPERATING_SYSTEM_V1.md','Effectiveness verification required before closure.'),
('MMS-TEC-POL-001','Technology and Production Change Governance','Technology & AI','Technology',null,'0.1','WORKING_DRAFT','Restricted','docs/MMS_MASTER_OPERATING_SYSTEM_V1.md','Capability gates, release evidence, rollback and monitoring.'),
('MMS-AI-POL-001','Artificial Intelligence Governance Policy','Technology & AI','Technology',null,'0.1','WORKING_DRAFT','Restricted','docs/MMS_MASTER_OPERATING_SYSTEM_V1.md','Human review and prohibited autonomous decisions.'),
('MMS-CNT-POL-001','Medical Claims and Content Governance Policy','Content & Brand','Clinical Governance',null,'0.1','WORKING_DRAFT','Internal','docs/MMS_MASTER_OPERATING_SYSTEM_V1.md','Approved Claims Library and controlled publishing.'),
('MMS-BCP-POL-001','Business Continuity and Disaster Recovery Framework','Technology & AI','Technology',null,'0.1','WORKING_DRAFT','Restricted','docs/MMS_MASTER_OPERATING_SYSTEM_V1.md','Detect, contain, recover, verify, reconcile, review.'),
('MMS-LCH-POL-001','Launch and Change Control Policy','Launch & Change','Technology / Operations',null,'0.1','WORKING_DRAFT','Internal','docs/MMS_MASTER_OPERATING_SYSTEM_V1.md','RED/AMBER/GREEN/LIVE/SUSPENDED and explicit Production authorization.')
on conflict (document_id) do nothing;

commit;
