import { EcosystemExtent } from '@shared/entities/carbon-inputs/ecosystem-extent.entity.js';
import { EmissionFactors } from '@shared/entities/carbon-inputs/emission-factors.entity.js';
import { SequestrationRate } from '@shared/entities/carbon-inputs/sequestration-rate.entity.js';
import { BlueCarbonProjectPlanning } from '@shared/entities/cost-inputs/blue-carbon-project-planning.entity.js';
import { ImplementationLaborCost } from '@shared/entities/cost-inputs/implementation-labor-cost.entity.js';

export const AVAILABLE_SOURCE_TYPES = {
  [EmissionFactors.name]: [
    'SOC',
    'AGB',
    'global',
    't2CountrySpecificAGB',
    't2CountrySpecificSOC',
  ],
  [EcosystemExtent.name]: ['extent', 'historicExtent'],
  [SequestrationRate.name]: ['tier1Factor', 'tier2Factor', 'sequestrationRate'],
  [BlueCarbonProjectPlanning.name]: [
    'input1',
    'input2',
    'input2',
    'blueCarbon',
  ],
  [ImplementationLaborCost.name]: [
    'plantingCost',
    'hybridCost',
    'hydrologyCost',
  ],
} as const;
