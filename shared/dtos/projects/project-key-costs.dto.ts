export type ProjectKeyCosts = {
  id: string;
  projectName: string;
  conservationPlanningNPV: number | null;
  conservationPlanning: number | null;
  communityRepresentationNPV: number | null;
  communityRepresentation: number | null;
  implementationLaborNPV: number | null;
  implementationLabor: number | null;
  monitoringMaintenanceNPV: number | null;
  monitoringMaintenance: number | null;
  communityBenefitNPV: number | null;
  communityBenefit: number | null;
  carbonStandardFeesNPV: number | null;
  carbonStandardFees: number | null;
  longTermProjectOperatingNPV: number | null;
  longTermProjectOperating: number | null;
};

export const PROJECT_KEY_COSTS_FIELDS = [
  "id",
  "projectName",
  "conservationPlanningNPV",
  "conservationPlanning",
  "communityRepresentationNPV",
  "communityRepresentation",
  "implementationLaborNPV",
  "implementationLabor",
  "monitoringMaintenanceNPV",
  "monitoringMaintenance",
  "communityBenefitNPV",
  "communityBenefit",
  "carbonStandardFeesNPV",
  "carbonStandardFees",
  "longTermProjectOperatingNPV",
  "longTermProjectOperating",
] as const;
