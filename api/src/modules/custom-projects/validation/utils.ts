import { EMISSION_FACTORS_TIER_TYPES } from '@shared/entities/carbon-inputs/emission-factors.entity';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';
import { ConservationProjectParamDto } from '@api/modules/custom-projects/dto/conservation-project-params.dto';

export const ValidateEcosystemForTier2EmissionFactor = (
  o: ConservationProjectParamDto,
) => {
  if (
    o.emissionFactorUsed === EMISSION_FACTORS_TIER_TYPES.TIER_2 &&
    o.ecosystem !== ECOSYSTEM.MANGROVE
  ) {
    return false;
  }
};
