import {
  PARTNER_STAGE_TRANSITIONS,
  type ActivationChecklist,
  type PartnerStage,
  checkPartnerActivation,
} from "@/lib/salesPartnerPolicy";
import type { PartnerCrmState } from "@/lib/partnerCrmState";

export type PartnerOnboardingAction =
  | "START_REVIEW"
  | "APPROVE"
  | "REJECT"
  | "RECORD_AGREEMENT"
  | "START_TRAINING"
  | "COMPLETE_TRAINING"
  | "RECORD_ASSESSMENT"
  | "ISSUE_CERTIFICATION"
  | "RECORD_COMPLIANCE_ACKNOWLEDGEMENT"
  | "ISSUE_PARTNER_ID"
  | "ENABLE_CRM_ACCESS"
  | "ACTIVATE"
  | "SUSPEND"
  | "INACTIVATE"
  | "REOPEN_REVIEW"
  | "MANUAL_REVIEW";

export type PartnerOnboardingBlocker = {
  code: string;
  label: string;
};

export type PartnerOnboardingReadiness = {
  stage: PartnerStage | "";
  completionPercent: number;
  missingControls: Array<keyof ActivationChecklist>;
  blockers: PartnerOnboardingBlocker[];
  recommendedAction: PartnerOnboardingAction;
  permittedActions: PartnerOnboardingAction[];
  canActivate: boolean;
};

const checklistLabels: Record<keyof ActivationChecklist, string> = {
  approved: "Application approval is not complete.",
  kycDueDiligenceCompleted: "KYC / due diligence is not complete.",
  agreementCompleted: "Current Sales Partner Agreement has not been accepted.",
  coreTrainingCompleted: "Required core training modules are incomplete.",
  quizPassed: "Controlled Sales Partner assessment has not been passed.",
  certificationIssued: "Current Sales Partner certification has not been issued.",
  partnerCodeIssued: "Permanent Partner ID has not been issued.",
  crmAccessEnabled: "Commercial CRM access has not been enabled.",
  complianceAcknowledged: "Compliance acknowledgement has not been completed.",
};

function missingControls(checklist: ActivationChecklist): Array<keyof ActivationChecklist> {
  return (Object.entries(checklist) as Array<[keyof ActivationChecklist, boolean]>)
    .filter(([, complete]) => !complete)
    .map(([key]) => key);
}

function completionPercent(checklist: ActivationChecklist): number {
  const entries = Object.values(checklist);
  const completed = entries.filter(Boolean).length;
  return Math.round((completed / entries.length) * 100);
}

function blockersFor(state: PartnerCrmState): PartnerOnboardingBlocker[] {
  const blockers: PartnerOnboardingBlocker[] = missingControls(state.checklist).map((key) => ({
    code: key,
    label: checklistLabels[key],
  }));

  if (state.checklist.agreementCompleted && state.agreementStatus !== "Accepted") {
    blockers.push({ code: "agreement_status", label: "Agreement evidence is not in Accepted status." });
  }
  if (state.checklist.coreTrainingCompleted && state.trainingModulesComplete !== "10/10") {
    blockers.push({ code: "training_modules", label: "All 10 controlled training modules must be complete." });
  }
  if (state.checklist.quizPassed && state.assessmentResult !== "Passed") {
    blockers.push({ code: "assessment_result", label: "Controlled assessment evidence does not show Passed." });
  }
  if (state.checklist.certificationIssued && state.certificationExpiresAt) {
    const expiry = Date.parse(state.certificationExpiresAt);
    if (!Number.isNaN(expiry) && expiry <= Date.now()) {
      blockers.push({ code: "certification_expired", label: "Sales Partner certification has expired." });
    }
  }
  if (state.sellingEnabled && state.stage !== "Active") {
    blockers.push({ code: "selling_state_conflict", label: "Selling Enabled conflicts with the recorded lifecycle stage." });
  }

  return blockers;
}

function permittedActionsFor(state: PartnerCrmState): PartnerOnboardingAction[] {
  switch (state.stage) {
    case "Applicant":
      return ["START_REVIEW"];
    case "Under Review":
      return ["APPROVE", "REJECT"];
    case "Approved":
      return ["RECORD_AGREEMENT", "REJECT"];
    case "Agreement Pending":
      return state.checklist.agreementCompleted ? ["START_TRAINING", "REJECT"] : ["RECORD_AGREEMENT", "REJECT"];
    case "Training": {
      const actions: PartnerOnboardingAction[] = [];
      if (!state.checklist.coreTrainingCompleted) actions.push("COMPLETE_TRAINING");
      else if (!state.checklist.quizPassed) actions.push("RECORD_ASSESSMENT");
      else if (!state.checklist.certificationIssued) actions.push("ISSUE_CERTIFICATION");
      else if (!state.checklist.complianceAcknowledged) actions.push("RECORD_COMPLIANCE_ACKNOWLEDGEMENT");
      else if (!state.checklist.partnerCodeIssued) actions.push("ISSUE_PARTNER_ID");
      else if (!state.checklist.crmAccessEnabled) actions.push("ENABLE_CRM_ACCESS");
      else actions.push("ACTIVATE");
      actions.push("REJECT");
      return actions;
    }
    case "Active":
      return ["SUSPEND", "INACTIVATE"];
    case "Suspended":
      return ["ACTIVATE", "INACTIVATE"];
    case "Inactive":
      return ["REOPEN_REVIEW"];
    case "Rejected":
      return [];
    default:
      return ["MANUAL_REVIEW"];
  }
}

export function partnerOnboardingReadiness(state: PartnerCrmState): PartnerOnboardingReadiness {
  const missing = missingControls(state.checklist);
  const blockers = blockersFor(state);
  const activation = checkPartnerActivation(state.checklist);
  const certificationExpired = blockers.some((blocker) => blocker.code === "certification_expired");
  const canActivate = activation.canActivate && !certificationExpired && Boolean(state.partnerId);
  const permittedActions = permittedActionsFor(state);
  const recommendedAction = permittedActions[0] || (state.stage ? "MANUAL_REVIEW" : "MANUAL_REVIEW");

  return {
    stage: state.stage,
    completionPercent: completionPercent(state.checklist),
    missingControls: missing,
    blockers,
    recommendedAction,
    permittedActions,
    canActivate,
  };
}

export function nextLifecycleStages(stage: PartnerStage): readonly PartnerStage[] {
  return PARTNER_STAGE_TRANSITIONS[stage];
}
