import { CommunityCashFlow } from '@shared/entities/cost-inputs/community-cash-flow.entity.js';
import { ResourceWithOptions } from 'adminjs';
import { GLOBAL_COMMON_PROPERTIES } from '../common/common.resources.js';

export const CommunityCashFlowResource: ResourceWithOptions = {
  resource: CommunityCashFlow,
  options: {
    sort: {
      sortBy: 'cashflowType',
      direction: 'asc',
    },
    navigation: {
      name: 'Model Components',
      icon: 'Settings',
    },
    properties: {
      ...GLOBAL_COMMON_PROPERTIES,
    },
  },
};
