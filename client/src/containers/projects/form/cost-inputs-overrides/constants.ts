import { CustomProjectForm } from "@/containers/projects/form/setup";

type CostInputsKeys = NonNullable<CustomProjectForm["costInputs"]>;

// todo: label dictionary

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

export type DataColumnDef<T = unknown> = {
  label: string;
  property: T;
  defaultValue: string;
  unit: string;
  value: string;
};
