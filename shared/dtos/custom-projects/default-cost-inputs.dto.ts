import { BaseDataView } from "@shared/entities/base-data.view";

export type DefaultCostInputsDto = Pick<
  BaseDataView,
  | "feasibilityAnalysis"
  | "conservationPlanningAndAdmin"
  | "dataCollectionAndFieldCost"
  | "communityRepresentation"
  | "blueCarbonProjectPlanning"
  | "establishingCarbonRights"
  | "validation"
  | "implementationLaborHybrid"
  | "monitoring"
  | "maintenance"
  | "communityBenefitSharingFund"
  | "carbonStandardFees"
  | "baselineReassessment"
  | "mrv"
  | "longTermProjectOperatingCost"
  | "financingCost"
>;
