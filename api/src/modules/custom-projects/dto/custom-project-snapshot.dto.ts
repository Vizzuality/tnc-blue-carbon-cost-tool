import {
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsString,
  IsOptional,
} from 'class-validator';
import { CreateCustomProjectDto } from './create-custom-project-dto';

export class CustomProjectSnapshotDto {
  @IsNotEmpty()
  inputSnapshot: CreateCustomProjectDto;

  @IsNotEmpty()
  outputSnapshot: CustomProjectOutputSnapshot;
}

export class CustomPrpjectAnnualProjectCashFlowDto {
  @IsArray()
  feasiabilityAnalysis: number[];

  @IsArray()
  conservationPlanningAndAdmin: number[];

  @IsArray()
  dataCollectionAndFieldCost: number[];

  @IsArray()
  communityRepresentation: number[];

  @IsArray()
  blueCarbonProjectPlanning: number[];

  @IsArray()
  establishingCarbonRights: number[];

  @IsArray()
  validation: number[];

  @IsArray()
  implementationLabor: number[];

  @IsArray()
  totalCapex: number[];

  // Opex costs
  @IsArray()
  monitoring: number[];

  @IsArray()
  maintenance: number[];

  @IsArray()
  communityBenefitSharingFund: number[];

  @IsArray()
  carbonStandardFees: number[];

  @IsArray()
  baselineReassessment: number[];

  @IsArray()
  mrv: number[];

  @IsArray()
  longTermProjectOperatingCost: number[];

  @IsArray()
  totalOpex: number[];

  // Total costs
  @IsArray()
  totalCost: number[];

  @IsArray()
  estCreditsIssued: number[];

  @IsArray()
  estRevenue: number[];

  @IsArray()
  annualNetIncomeRevLessOpex: number[];

  @IsArray()
  cummulativeNetIncomeRevLessOpex: number[];

  @IsArray()
  fundingGap: number[];

  @IsArray()
  irrOpex: number[];

  @IsArray()
  irrTotalCost: number[];

  @IsArray()
  irrAnnualNetIncome: number[];

  @IsArray()
  annualNetCashFlow: number[];
}

export class CustomProjectSummaryDto {
  @IsNumber()
  costPerTCO2e: number;

  @IsNumber()
  costPerHa: number;

  @IsNumber()
  leftoverAfterOpexTotalCost: number;

  @IsNumber()
  irrCoveringOpex: number;

  @IsNumber()
  irrCoveringTotalCost: number;

  @IsNumber()
  totalCost: number;

  @IsNumber()
  capitalExpenditure: number;

  @IsNumber()
  operatingExpenditure: number;

  @IsNumber()
  creditsIssued: number;

  @IsNumber()
  totalRevenue: number;

  @IsNumber()
  nonDiscountedTotalRevenue: number;

  @IsNumber()
  financingCost: number;

  @IsNumber()
  foundingGap: number;

  @IsNumber()
  foundingGapPerTCO2e: number;

  @IsNumber()
  communityBenefitSharingFundRevenuePc: number;
}

export class CustomProjectCostDetailEntry {
  @IsString()
  costName: string;

  @IsNumber()
  costValue: number;

  @IsOptional()
  @IsNumber()
  sensitiveAnalysis: number;
}
export class CustomProjectCostDetailsDto {
  @IsArray()
  costDetails: CustomProjectCostDetailEntry[];
}

export class CustomProjectOutputSnapshot {
  @IsNumber()
  projectLength: number;

  @IsNotEmpty()
  annualProjectCashFlow: CustomPrpjectAnnualProjectCashFlowDto;

  @IsNotEmpty()
  projectSummary: CustomProjectSummaryDto;

  @IsNotEmpty()
  costDetails: CustomProjectCostDetailsDto;
}
