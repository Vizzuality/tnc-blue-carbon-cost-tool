import { ResourceWithOptions } from 'adminjs';
import { ValidationCost } from '@shared/entities/cost-inputs/validation.entity.js';
import { GLOBAL_COMMON_PROPERTIES } from '../common/common.resources.js';
export const ValidationCostResource: ResourceWithOptions = {
  resource: ValidationCost,
  options: {
    sort: {
      sortBy: 'validationCost',
      direction: 'desc',
    },
    navigation: {
      name: 'Model Components',
      icon: 'Settings',
    },
    properties: {
      ...GLOBAL_COMMON_PROPERTIES,
      validationCost: {
        isVisible: { list: true, show: true, edit: true, filter: false },
      },
    },
  },
};
