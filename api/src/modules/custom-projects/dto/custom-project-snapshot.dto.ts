import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsArray,
} from 'class-validator';
import { ACTIVITY } from '@shared/entities/activity.enum';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';
import { LOSS_RATE_USED } from '@shared/schemas/custom-projects/create-custom-project.schema';
import { EMISSION_FACTORS_TIER_TYPES } from '@shared/entities/carbon-inputs/emission-factors.entity';

export class CustomProjectSnapshotDto {
  @IsNotEmpty()
  inputSnapshot: InputSnapshot;

  @IsNotEmpty()
  outputSnapshot: OutputSnapshot;
}

export class CostInputsDto {
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
  financingCost: number;

  @IsNumber()
  validation: number;

  @IsNumber()
  implementationLaborHybrid: number;

  @IsNumber()
  monitoring: number;

  @IsNumber()
  maintenance: number;

  @IsNumber()
  carbonStandardFees: number;

  @IsNumber()
  communityBenefitSharingFund: number;

  @IsNumber()
  baselineReassessment: number;

  @IsNumber()
  mrv: number;

  @IsNumber()
  longTermProjectOperatingCost: number;
}

export class AssumptionDto {
  @IsNumber()
  verificationFrequency: number;

  @IsNumber()
  baselineReassessmentFrequency: number;

  @IsNumber()
  discountRate: number;

  @IsNumber()
  restorationRate: number;

  @IsNumber()
  carbonPriceIncrease: number;

  @IsNumber()
  buffer: number;

  @IsNumber()
  projectLength: number;
}

export class InputSnapshot {
  @IsString()
  countryCode: string;

  @IsString()
  projectName: string;

  @IsEnum(ACTIVITY)
  activity: ACTIVITY;

  @IsEnum(ECOSYSTEM)
  ecosystem: ECOSYSTEM;

  @IsNumber()
  projectSizeHa: number;

  @IsNumber()
  initialCarbonPriceAssumption: number;

  @IsString()
  carbonRevenuesToCover: string;

  @IsEnum(LOSS_RATE_USED)
  lossRateUsed: LOSS_RATE_USED;

  @IsEnum(EMISSION_FACTORS_TIER_TYPES)
  emissionFactorUsed: EMISSION_FACTORS_TIER_TYPES;

  @IsNotEmpty()
  costInputs: CostInputsDto;

  @IsNotEmpty()
  assumptions: AssumptionDto;
}

export class OutputSnapshot {
  @IsNumber()
  projectLength: number;

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
