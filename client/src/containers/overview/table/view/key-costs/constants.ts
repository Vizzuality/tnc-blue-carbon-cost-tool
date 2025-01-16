import { PROJECT_KEY_COSTS_FIELDS } from "@shared/dtos/projects/project-key-costs.dto";

export const KEY_COSTS_LABELS: Omit<
  Record<(typeof PROJECT_KEY_COSTS_FIELDS)[number], string>,
  "id" | "projectName"
> = {
  implementationLabor: "Implementation Labor",
  implementationLaborNPV: "Implementation Labor",
  communityBenefit: "Community benefit sharing fund",
  communityBenefitNPV: "Community benefit sharing fund",
  monitoringMaintenance: "Monitoring and Maintenance",
  monitoringMaintenanceNPV: "Monitoring and Maintenance",
  communityRepresentation: "Community representation/liaison",
  communityRepresentationNPV: "Community representation/liaison",
  conservationPlanning: "Conservation planning and admin",
  conservationPlanningNPV: "Conservation planning and admin",
  longTermProjectOperating: "Long-term project operating",
  longTermProjectOperatingNPV: "Long-term project operating",
  carbonStandardFees: "Carbon standard fees",
  carbonStandardFeesNPV: "Carbon standard fees",
};
