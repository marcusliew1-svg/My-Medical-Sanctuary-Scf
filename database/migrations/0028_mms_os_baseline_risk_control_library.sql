-- MMS Operating System v1 baseline risk and control library.
-- Preview-safe governance metadata only. No patient or clinical record content.

begin;

insert into mms_governance.risks
(risk_id,domain,title,risk_statement,owner_role,inherent_likelihood,inherent_impact,residual_likelihood,residual_impact,response,status,action_summary)
values
('RISK-CLN-001','Clinical','Wrong-patient treatment','A treatment or procedure could be delivered to the wrong patient if identity controls fail.','Medical Director',3,5,1,5,'REDUCE','MITIGATING','Maintain two-identifier verification, treatment time-out and audit.'),
('RISK-CLN-002','Clinical','Critical result not acted on','A critical diagnostic result could be delayed, missed or not acknowledged by a responsible clinician.','Medical Director',3,5,2,5,'REDUCE','MITIGATING','Require critical-result acknowledgement and escalation until ownership is confirmed.'),
('RISK-CLN-003','Clinical','Uncredentialed or unprivileged clinician','A clinician could perform an MMS service without current credential, competency or privilege.','Medical Director',3,5,1,5,'AVOID','MITIGATING','Credential, competency and privilege must all be current before service access.'),
('RISK-REG-001','Regulatory / Legal','Service offered before approval','MMS could market, book or deliver a service before jurisdictional, facility or clinical approval is complete.','Compliance',3,5,1,5,'AVOID','MITIGATING','Clinical Service Register must fail closed and downstream exposure requires ACTIVE status.'),
('RISK-PRI-001','Privacy / Data','Clinical data enters commercial CRM','Clinical information could be stored in Zoho or commercial systems outside the approved clinical record.','Privacy / Compliance',3,5,1,5,'AVOID','MITIGATING','CRM allow-list, free-text restrictions, training and audit.'),
('RISK-PRI-002','Privacy / Data','Excessive access to sensitive information','Staff, Partners or systems could access information beyond minimum necessary scope.','Privacy / Compliance',3,5,2,5,'REDUCE','MITIGATING','Least privilege, role-based access, access review and offboarding.'),
('RISK-TEC-001','Technology / Cybersecurity','Unauthorized Production change','A Production change could bypass review, approval, monitoring or rollback controls.','Technology',3,5,1,5,'AVOID','MITIGATING','Capability gates, deployment approval, branch separation and rollback evidence.'),
('RISK-TEC-002','Technology / Cybersecurity','Authentication compromise','Compromised operator or patient credentials could enable unauthorized access.','Technology',3,5,2,5,'REDUCE','MITIGATING','Trusted app metadata, secure sessions, MFA/step-up where applicable and leaked-password protection.'),
('RISK-OPS-001','Commercial / Operational','Lead lost or left unowned','A valid enquiry could receive no owner, no next action or delayed response.','Commercial Operations',4,3,2,3,'REDUCE','MITIGATING','Owner + status + next action + due time; SLA alerts and queue review.'),
('RISK-OPS-002','Commercial / Operational','Incorrect Partner attribution','A lead could be attributed to the wrong Partner or changed without audit.','Partner Operations',3,4,1,4,'REDUCE','MITIGATING','Attribution lock, duplicate review and authorized override evidence.'),
('RISK-FIN-001','Financial','Commission paid without entitlement','Commission could be paid before cleared payment or while a hold/refund/compliance issue exists.','Finance',3,4,1,4,'REDUCE','MITIGATING','Maker/checker approval, reconciliation and eligibility controls.'),
('RISK-REP-001','Reputational','Unsupported medical claim','Website, Ling, staff or Partners could communicate an unapproved or misleading medical claim.','Clinical Governance',3,5,1,5,'AVOID','MITIGATING','Approved Claims Library and controlled content workflow.')
on conflict (risk_id) do nothing;

insert into mms_governance.controls
(control_id,domain,name,control_type,owner_role,operator_role,frequency,evidence_requirement,automation_level,system_name,failure_threshold,test_method,effectiveness,status)
values
('CTRL-CLN-001','Clinical','Two-Identifier Patient Verification','PREVENTIVE','Medical Director','Clinical Team','Per treatment','Treatment record verification evidence','MANUAL','Clinical System','Any missed verification','Clinical documentation audit','NOT_TESTED','ACTIVE'),
('CTRL-CLN-002','Clinical','Treatment Time-Out','PREVENTIVE','Medical Director','Clinical Team','Per higher-risk treatment','Signed/recorded time-out','MANUAL','Clinical System','Any missed time-out','Procedure audit','NOT_TESTED','ACTIVE'),
('CTRL-CLN-003','Clinical','Critical Result Acknowledgement','DETECTIVE','Medical Director','Clinical Team','Per critical result','Acknowledgement timestamp and escalation history','SEMI_AUTOMATED','Clinical System','Any unacknowledged critical result','Critical-result audit','NOT_TESTED','ACTIVE'),
('CTRL-CLN-004','Clinical','Credential and Privilege Gate','PREVENTIVE','Medical Director','Clinical Governance','Continuous','Credential, competency and privilege state','AUTOMATED','MMS Governance','Any clinical action with invalid privilege','Access-control test','NOT_TESTED','ACTIVE'),
('CTRL-REG-001','Clinical Governance','Clinical Service Activation Gate','PREVENTIVE','Medical Director','Clinical Governance','Continuous','Clinical Service Register state and approval reference','AUTOMATED','MMS Governance','Any downstream exposure before ACTIVE','Dependency-state test','EFFECTIVE','ACTIVE'),
('CTRL-PRI-001','Privacy / Data','CRM Administrative Field Allow-List','PREVENTIVE','Privacy / Compliance','Commercial Operations','Continuous','Approved field mapping and validation tests','AUTOMATED','Zoho Adapter','Any prohibited clinical field accepted','Contract test and CRM sample audit','EFFECTIVE','ACTIVE'),
('CTRL-PRI-002','Privacy / Data','Role-Based Minimum Necessary Access','PREVENTIVE','Privacy / Compliance','Technology','Continuous','Role map and access logs','SEMI_AUTOMATED','Auth / Application','Unauthorized access event','Quarterly access review','NOT_TESTED','ACTIVE'),
('CTRL-PRI-003','Privacy / Data','Access Offboarding','CORRECTIVE','Technology','HR / Technology','Event-driven','Revocation evidence','SEMI_AUTOMATED','Auth','Session/privilege remains after termination','Offboarding sample test','NOT_TESTED','ACTIVE'),
('CTRL-TEC-001','Technology / Cybersecurity','Production Capability Gate','PREVENTIVE','Technology','Operations','Per release','Explicit approval reference and gate state','AUTOMATED','Vercel / Application','LIVE without gate and approval','Release-preflight test','EFFECTIVE','ACTIVE'),
('CTRL-TEC-002','Technology / Cybersecurity','Preview and Production Separation','PREVENTIVE','Technology','Technology','Continuous','Environment wiring evidence','SEMI_AUTOMATED','Vercel / Supabase','Preview credential in Production or inverse','Configuration audit','EFFECTIVE','ACTIVE'),
('CTRL-TEC-003','Technology / Cybersecurity','Operator Session Verification','PREVENTIVE','Technology','Technology','Per request','Signed session plus trusted identity metadata','AUTOMATED','Application Auth','Invalid/changed identity accepted','Auth regression test','EFFECTIVE','ACTIVE'),
('CTRL-TEC-004','Technology / Cybersecurity','Backup and Restore Verification','CORRECTIVE','Technology','Technology','Periodic','Successful restore-test evidence','SEMI_AUTOMATED','Database / Hosting','Restore test overdue or failed','Restore exercise','NOT_TESTED','ACTIVE'),
('CTRL-OPS-001','Commercial Operations','Active Lead Ownership','PREVENTIVE','Commercial Operations','Clinic Manager','Continuous','Owner field on every active lead','SEMI_AUTOMATED','CRM','Any unowned active lead','Daily queue check','NOT_TESTED','ACTIVE'),
('CTRL-OPS-002','Commercial Operations','Dated Next Action','PREVENTIVE','Commercial Operations','Clinic Manager','Continuous','Next action and due time','SEMI_AUTOMATED','CRM','Active lead without dated next action','Daily queue check','NOT_TESTED','ACTIVE'),
('CTRL-OPS-003','Commercial Operations','CRM Idempotency and Dedupe','PREVENTIVE','Commercial Operations','Technology','Per write','Idempotency reservation and dedupe evidence','AUTOMATED','MMS Commercial DB / Zoho','Duplicate created from replay','E2E replay test','EFFECTIVE','ACTIVE'),
('CTRL-PAR-001','Partner Operations','Partner Attribution Lock','PREVENTIVE','Partner Operations','Operations','Continuous','Attribution record and override audit','SEMI_AUTOMATED','MMS Commercial DB','Unapproved attribution change','Attribution audit','NOT_TESTED','ACTIVE'),
('CTRL-FIN-001','Finance','Cleared Payment Requirement','PREVENTIVE','Finance','Finance','Per commission','Reconciled payment evidence','AUTOMATED','Finance Workflow','Commission eligible without cleared payment','Transaction sample test','EFFECTIVE','ACTIVE'),
('CTRL-FIN-002','Finance','Maker Checker Approval','PREVENTIVE','Finance','Finance','Per material payment/refund/commission','Distinct originator and approver evidence','SEMI_AUTOMATED','Finance Workflow','Single actor originates and approves','Quarterly finance control test','NOT_TESTED','ACTIVE'),
('CTRL-CNT-001','Content & Brand','Approved Claims Library','PREVENTIVE','Clinical Governance','Content / Marketing','Per publication','Claim ID, evidence and approval state','SEMI_AUTOMATED','Content Governance','Unapproved claim published','Content sampling audit','NOT_TESTED','ACTIVE'),
('CTRL-AI-001','Technology & AI','Approved-Content-Only Ling','PREVENTIVE','Clinical Governance','Technology','Per response','Approved corpus source and refusal path','AUTOMATED','Ling','Response outside approved corpus/clinical boundary','AI safety test matrix','EFFECTIVE','ACTIVE')
on conflict (control_id) do nothing;

insert into mms_governance.risk_control_links(risk_id,control_id)
select r.id,c.id from (values
('RISK-CLN-001','CTRL-CLN-001'),('RISK-CLN-001','CTRL-CLN-002'),
('RISK-CLN-002','CTRL-CLN-003'),
('RISK-CLN-003','CTRL-CLN-004'),
('RISK-REG-001','CTRL-REG-001'),('RISK-REG-001','CTRL-TEC-001'),
('RISK-PRI-001','CTRL-PRI-001'),('RISK-PRI-001','CTRL-AI-001'),
('RISK-PRI-002','CTRL-PRI-002'),('RISK-PRI-002','CTRL-PRI-003'),
('RISK-TEC-001','CTRL-TEC-001'),('RISK-TEC-001','CTRL-TEC-002'),
('RISK-TEC-002','CTRL-TEC-003'),('RISK-TEC-002','CTRL-PRI-002'),
('RISK-OPS-001','CTRL-OPS-001'),('RISK-OPS-001','CTRL-OPS-002'),('RISK-OPS-001','CTRL-OPS-003'),
('RISK-OPS-002','CTRL-PAR-001'),('RISK-OPS-002','CTRL-OPS-003'),
('RISK-FIN-001','CTRL-FIN-001'),('RISK-FIN-001','CTRL-FIN-002'),
('RISK-REP-001','CTRL-CNT-001'),('RISK-REP-001','CTRL-AI-001')
) x(risk_key,control_key)
join mms_governance.risks r on r.risk_id=x.risk_key
join mms_governance.controls c on c.control_id=x.control_key
on conflict do nothing;

insert into mms_governance.ai_use_cases
(use_case_id,name,domain,intended_use,prohibited_uses,data_classification,human_review_required,status,clinical_governance_required,privacy_review_required)
values
('AI-OPS-001','AI Operations Assistant','Commercial / Operational','Administrative summarization, prioritization and draft support for authorized operators','["diagnosis","prescribing","treatment suitability","clinical urgency","autonomous financial approval"]'::jsonb,'Commercial / Administrative',true,'REVIEW',false,true),
('AI-LING-001','Ling Approved-Content Concierge','Patient Experience','Navigation and explanation using only approved MMS public/patient information','["diagnosis","prescribing","results interpretation","treatment suitability","emergency triage"]'::jsonb,'Public / Approved Patient Information',true,'REVIEW',true,true)
on conflict (use_case_id) do nothing;

commit;
