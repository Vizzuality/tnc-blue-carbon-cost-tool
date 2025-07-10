import { ResourceWithOptions } from 'adminjs';
import { FinancingCost } from '@shared/entities/cost-inputs/financing-cost.entity.js';
import {
  DEFAULT_READONLY_PERMISSIONS,
  GLOBAL_COMMON_PROPERTIES,
} from '../common/common.resources.js';
export const FinancingCostResource: ResourceWithOptions = {
  resource: FinancingCost,
  options: {
    sort: {
      sortBy: 'financingCostCapexPercent',
      direction: 'desc',
    },
    navigation: {
      name: 'Model Components',
      icon: 'Settings',
    },
    properties: {
      ...GLOBAL_COMMON_PROPERTIES,
      financingCostCapexPercent: {
        isVisible: { list: true, show: true, filter: false, edit: true },
      },
    },
    actions: {
      ...DEFAULT_READONLY_PERMISSIONS,
    },
  },
};
