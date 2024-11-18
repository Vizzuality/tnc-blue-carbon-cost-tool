import { SEQUESTRATION_RATE_TIER_TYPES } from '@shared/entities/carbon-inputs/sequestration-rate.entity';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';
import { IsNotEmpty, IsNumber, IsEnum, Validate } from 'class-validator';
import { ValidateEcosystemForTier2SequestrationRate } from '@api/modules/custom-projects/validation/sequestration-rate-ecosystem.validator';
import { ValidateCountryForActivityType } from '../validation/ecosystem-country.validator';

export class RestorationProjectParamsDto {
  @Validate(ValidateCountryForActivityType)
  countryCode: string;

  @Validate(ValidateEcosystemForTier2SequestrationRate)
  ecosystem: ECOSYSTEM;
  @IsEnum(SEQUESTRATION_RATE_TIER_TYPES)
  sequestrationRateUsed: SEQUESTRATION_RATE_TIER_TYPES;

  @IsNotEmpty({
    message: 'Planting success rate is required for restoration projects',
  })
  @IsNumber()
  plantingSuccessRate: number;

  @IsNotEmpty({
    message:
      'Project Specific Sequestration Rate is required for restoration projects',
  })
  @IsNumber()
  projectSpecificSequestrationRate: number;
}
