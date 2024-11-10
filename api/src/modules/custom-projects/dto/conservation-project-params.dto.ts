import { LOSS_RATE_USED } from '@shared/schemas/custom-projects/create-custom-project.schema';
import {
  IsEnum,
  IsNegative,
  IsNotEmpty,
  IsNumber,
  Validate,
  ValidateIf,
} from 'class-validator';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';
import { ValidateEcosystemForTier2EmissionFactor } from '@api/modules/custom-projects/validation/emission-factor-ecosystem.validator';

export enum PROJECT_SPECIFIC_EMISSION {
  ONE_EMISSION_FACTOR = 'One emission factor',
  TWO_EMISSION_FACTORS = 'Two emission factors',
}
export enum PROJECT_EMISSION_FACTORS {
  TIER_3 = 'Tier 3 - Project specific emission factor',
  TIER_2 = 'Tier 2 - Country-specific emission factor',
  TIER_1 = 'Tier 1 - Global emission factor',
}

export class ConservationProjectParamDto {
  @Validate(ValidateEcosystemForTier2EmissionFactor)
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

  @IsEnum(PROJECT_EMISSION_FACTORS)
  emissionFactorUsed: PROJECT_EMISSION_FACTORS;

  @ValidateIf(
    (o) =>
      o.emissionFactorUsed === PROJECT_EMISSION_FACTORS.TIER_3 &&
      o.projectSpecificEmission ===
        PROJECT_SPECIFIC_EMISSION.TWO_EMISSION_FACTORS,
  )
  @IsNotEmpty({
    message:
      'Emission Factor AGB is required when emissionFactorUsed is Tier 3 and projectSpecificEmission is Two emission factors',
  })
  @IsNumber()
  emissionFactorAGB: number;

  @ValidateIf(
    (o) =>
      o.emissionFactorUsed === PROJECT_EMISSION_FACTORS.TIER_3 &&
      o.projectSpecificEmission ===
        PROJECT_SPECIFIC_EMISSION.TWO_EMISSION_FACTORS,
  )
  @IsNotEmpty({
    message:
      'Emission Factor SOC is required when emissionFactorUsed is Tier 3 and projectSpecificEmission is Two emission factors',
  })
  @IsNumber()
  emissionFactorSOC: number;

  @ValidateIf((o) => o.emissionFactorUsed === PROJECT_EMISSION_FACTORS.TIER_3)
  @IsEnum(PROJECT_SPECIFIC_EMISSION)
  projectSpecificEmission: PROJECT_SPECIFIC_EMISSION;

  @ValidateIf(
    (o) =>
      o.emissionFactorUsed === PROJECT_EMISSION_FACTORS.TIER_3 &&
      o.projectSpecificEmission ===
        PROJECT_SPECIFIC_EMISSION.ONE_EMISSION_FACTOR,
  )
  @IsNotEmpty({
    message:
      'Project Specific Emission Factor must be provided when emissionFactorUsed is Tier 3 and projectSpecificEmission is One emission factor',
  })
  @IsNumber()
  projectSpecificEmissionFactor: number;
}
