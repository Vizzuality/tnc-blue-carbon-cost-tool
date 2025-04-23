import { BlueCarbonProjectPlanning } from '@shared/entities/cost-inputs/blue-carbon-project-planning.entity.js';
import { ResourceWithOptions } from 'adminjs';
import { GLOBAL_COMMON_PROPERTIES } from '../common/common.resources.js';

// position: number is not working in the options so we have to define the order of the columns using listProperties, showProperties and editProperties.
const COLUMN_ORDER = ['countryCode', 'planningCost', 'source'];

export const BlueCarbonProjectPlanningResource: ResourceWithOptions = {
  resource: BlueCarbonProjectPlanning,
  options: {
    listProperties: COLUMN_ORDER,
    showProperties: COLUMN_ORDER,
    editProperties: COLUMN_ORDER,
    properties: {
      ...GLOBAL_COMMON_PROPERTIES,
    },
    sort: {
      sortBy: 'planningCost',
      direction: 'desc',
    },
    navigation: {
      name: 'Model Components',
      icon: 'Settings',
    },
  },
};
