import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';
import { EMISSION_FACTORS_TIER_TYPES } from '@shared/entities/carbon-inputs/emission-factors.entity';

@ValidatorConstraint({
  name: 'ValidateEcosystemForTier2EmissionFactor',
  async: false,
})
export class ValidateEcosystemForTier2EmissionFactor
  implements ValidatorConstraintInterface
{
  validate(value: ECOSYSTEM, args: ValidationArguments): boolean {
    const obj = args.object as any;

    return !(
      obj.emissionFactorUsed === EMISSION_FACTORS_TIER_TYPES.TIER_2 &&
      value !== ECOSYSTEM.MANGROVE
    );
  }

  defaultMessage(): string {
    return 'There is only Tier 2 emission factor for Mangrove ecosystems';
  }
}
