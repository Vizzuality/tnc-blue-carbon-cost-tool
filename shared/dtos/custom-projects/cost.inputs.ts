import { IsNumber } from "class-validator";

// TODO: We have a class-validator DTO in the backend for this class, what we need to do is to create a zod schema so that we validate it in the contract
//       and potentially in the DTO

export class OverridableCostInputs {
  @IsNumber()
  financingCost: number;

  @IsNumber()
  monitoring: number;

  @IsNumber()
  maintenance: number;

  @IsNumber()
  communityBenefitSharingFund: number;

  @IsNumber()
  carbonStandardFees: number;

  @IsNumber()
  baselineReassessment: number;

  @IsNumber()
  mrv: number;

  @IsNumber()
  longTermProjectOperatingCost: number;

  @IsNumber()
  feasibilityAnalysis: number;

  @IsNumber()
  conservationPlanningAndAdmin: number;

  @IsNumber()
  dataCollectionAndFieldCost: number;

  @IsNumber()
  communityRepresentation: number;

  @IsNumber()
  blueCarbonProjectPlanning: number;

  @IsNumber()
  establishingCarbonRights: number;

  @IsNumber()
  validation: number;

  @IsNumber()
  implementationLabor: number;
}
