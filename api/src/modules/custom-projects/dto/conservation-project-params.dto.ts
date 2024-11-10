import { LOSS_RATE_USED } from '@shared/schemas/custom-projects/create-custom-project.schema';
import {
  IsEnum,
  IsNegative,
  IsNotEmpty,
  IsNumber,
  Validate,
  ValidateIf,
} from 'class-validator';
import { EMISSION_FACTORS_TIER_TYPES } from '@shared/entities/carbon-inputs/emission-factors.entity';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';
import { ValidateEcosystemForTier2EmissionFactor } from '@api/modules/custom-projects/validation/utils';

export enum PROJECT_SPECIFIC_EMISSION {
  ONE_EMISSION_FACTOR = 'One emission factor',
  TWO_EMISSION_FACTORS = 'Two emission factors',
}
export enum TIER_3_EMISSION_FACTORS {
  TIER_3 = 'Tier 3 - Project specific emission factor',
}

export class ConservationProjectParamDto {
  @Validate(ValidateEcosystemForTier2EmissionFactor, {
    message:
      'Tier 2 - Country-specific emission factor: No default tier 2 data available for seagrass and salt marsh',
  })
  ecosystem: ECOSYSTEM;
  @IsEnum(LOSS_RATE_USED)
  lossRateUsed: LOSS_RATE_USED;

  @ValidateIf((o) => o.lossRateUsed === LOSS_RATE_USED.PROJECT_SPECIFIC)
  @IsNotEmpty({
    message:
      'Project Specific Loss Rate is required when lossRateUsed is projectSpecific',
  })
  @IsNumber()
  @IsNegative({ message: 'Project Specific Loss Rate must be negative' })
  projectSpecificLossRate: number;

  @IsEnum(EMISSION_FACTORS_TIER_TYPES || TIER_3_EMISSION_FACTORS)
  emissionFactorUsed: EMISSION_FACTORS_TIER_TYPES | TIER_3_EMISSION_FACTORS;

  @ValidateIf(
    (o) =>
      o.emissionFactorUsed === TIER_3_EMISSION_FACTORS.TIER_3 &&
      o.projectSpecificEmission ===
        PROJECT_SPECIFIC_EMISSION.TWO_EMISSION_FACTORS,
  )
  emissionFactorAGB: number;

  @ValidateIf(
    (o) =>
      o.emissionFactorUsed === TIER_3_EMISSION_FACTORS.TIER_3 &&
      o.projectSpecificEmission ===
        PROJECT_SPECIFIC_EMISSION.TWO_EMISSION_FACTORS,
  )
  emissionFactorSOC: number;

  @ValidateIf((o) => o.emissionFactorUsed === TIER_3_EMISSION_FACTORS.TIER_3)
  @IsEnum(PROJECT_SPECIFIC_EMISSION)
  projectSpecificEmission: PROJECT_SPECIFIC_EMISSION;

  @ValidateIf(
    (o) =>
      o.emissionFactorUsed === TIER_3_EMISSION_FACTORS.TIER_3 &&
      o.projectSpecificEmission ===
        PROJECT_SPECIFIC_EMISSION.ONE_EMISSION_FACTOR,
  )
  projectSpecificEmissionFactor: number;
}
