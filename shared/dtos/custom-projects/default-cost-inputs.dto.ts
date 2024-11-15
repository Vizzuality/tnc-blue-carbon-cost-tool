import { BaseDataView } from "@shared/entities/base-data.view";

// TODO: We have a class-validator DTO in the backend for this class, what we need to do is to create a zod schema so that we validate it in the contract
//       and potentially in the DTO

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
