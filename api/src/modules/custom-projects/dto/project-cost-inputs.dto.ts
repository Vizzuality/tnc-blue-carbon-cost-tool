import { IsEnum, IsNumber } from 'class-validator';

export enum PROJECT_DEVELOPMENT_TYPE {
  DEVELOPMENT = 'Development',
  NON_DEVELOPMENT = 'Non-Development',
}

export class CostInputs {
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

  @IsEnum(PROJECT_DEVELOPMENT_TYPE)
  otherCommunityCashFlow: PROJECT_DEVELOPMENT_TYPE | string;
}
