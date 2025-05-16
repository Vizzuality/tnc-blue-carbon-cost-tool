import { ProjectKeyCosts } from "@shared/dtos/projects/project-key-costs.dto";

export const KEY_COSTS_LABELS: Omit<
  Record<keyof ProjectKeyCosts, string>,
  "id" | "projectName"
> = {
  implementationLabor: "Restoration implementation labor",
  implementationLaborNPV: "Restoration implementation labor",
  communityBenefit: "Landowner/community benefit share",
  communityBenefitNPV: "Landowner/community benefit share",
  monitoringMaintenance: "Monitoring and Maintenance",
  monitoringMaintenanceNPV: "Monitoring and Maintenance",
  communityRepresentation: "Community representation/liaison",
  communityRepresentationNPV: "Community representation/liaison",
  conservationPlanning: "Conservation planning and admin",
  conservationPlanningNPV: "Conservation planning and admin",
  longTermProjectOperating: "Long-term project operating costs",
  longTermProjectOperatingNPV: "Long-term project operating costs",
  carbonStandardFees: "Carbon standard fees",
  carbonStandardFeesNPV: "Carbon standard fees",
};
