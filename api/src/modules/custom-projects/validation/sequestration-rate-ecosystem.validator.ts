import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';
import { SEQUESTRATION_RATE_TIER_TYPES } from '@shared/entities/carbon-inputs/sequestration-rate.entity';

@ValidatorConstraint({
  name: 'ValidateEcosystemForTier2SequestrationRate',
  async: false,
})
export class ValidateEcosystemForTier2SequestrationRate
  implements ValidatorConstraintInterface
{
  validate(value: ECOSYSTEM, args: ValidationArguments): boolean {
    const obj = args.object as any;

    return !(
      obj.emissionFactorUsed === SEQUESTRATION_RATE_TIER_TYPES.TIER_2 &&
      value !== ECOSYSTEM.MANGROVE
    );
  }

  defaultMessage(): string {
    return 'No default tier 2 data available for seagrass and salt marsh.';
  }
}
