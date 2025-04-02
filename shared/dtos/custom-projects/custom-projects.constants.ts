import { CustomProjectForm } from "@shared/schemas/custom-projects/create-custom-project.schema";

type CostInputsKeys = NonNullable<CustomProjectForm["costInputs"]>;

export const COST_INPUTS_KEYS: {
  capex: (keyof Pick<
    CostInputsKeys,
    | "feasibilityAnalysis"
    | "conservationPlanningAndAdmin"
    | "dataCollectionAndFieldCost"
    | "communityRepresentation"
    | "blueCarbonProjectPlanning"
    | "establishingCarbonRights"
    | "validation"
    | "implementationLabor"
  >)[];
  opex: (keyof Pick<
    CostInputsKeys,
    | "monitoring"
    | "maintenance"
    | "communityBenefitSharingFund"
    | "carbonStandardFees"
    | "baselineReassessment"
    | "mrv"
    | "longTermProjectOperatingCost"
  >)[];
  other: (keyof Pick<CostInputsKeys, "financingCost">)[];
} = {
  capex: [
    "feasibilityAnalysis",
    "conservationPlanningAndAdmin",
    "dataCollectionAndFieldCost",
    "communityRepresentation",
    "blueCarbonProjectPlanning",
    "establishingCarbonRights",
    "validation",
    "implementationLabor",
  ],
  opex: [
    "monitoring",
    "maintenance",
    "communityBenefitSharingFund",
    "carbonStandardFees",
    "baselineReassessment",
    "mrv",
    "longTermProjectOperatingCost",
  ],
  other: ["financingCost"],
};
