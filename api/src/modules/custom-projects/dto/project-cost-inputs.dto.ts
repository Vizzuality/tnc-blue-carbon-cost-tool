import { CustomProject } from '@shared/entities/custom-project.entity';
import { IsNumber } from 'class-validator';

export class CustomProjectCapexCostInputsDto {
  @IsNumber()
  feasibilityAnalisys: number;

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

export class CustomProjectOpexCostInputsDto {
  @IsNumber()
  monitoring: number;

  @IsNumber()
  maintenance: number;

  @IsNumber()
  communityBenefitShsharingFund: number;

  @IsNumber()
  carbonStandardFees: number;

  @IsNumber()
  baselineReassessment: number;

  @IsNumber()
  mrv: number;

  @IsNumber()
  longTermProjectOperating: number;
}

export class CustomProjectCostInputsDto {
  @IsNumber()
  financingCost: number;

  capexCostInputs: CustomProjectCapexCostInputsDto;

  opexCostInputs: CustomProjectOpexCostInputsDto;
}
