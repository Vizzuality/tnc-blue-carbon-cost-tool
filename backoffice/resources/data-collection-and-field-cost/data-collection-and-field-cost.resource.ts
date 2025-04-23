import { ResourceWithOptions } from 'adminjs';
import { DataCollectionAndFieldCosts } from '@shared/entities/cost-inputs/data-collection-and-field-costs.entity.js';
import { GLOBAL_COMMON_PROPERTIES } from '../common/common.resources.js';

export const DataCollectionAndFieldCostResource: ResourceWithOptions = {
  resource: DataCollectionAndFieldCosts,
  options: {
    sort: {
      sortBy: 'fieldCost',
      direction: 'desc',
    },
    navigation: {
      name: 'Model Components',
      icon: 'Settings',
    },
    properties: {
      ...GLOBAL_COMMON_PROPERTIES,
      fieldCost: {
        isVisible: { list: true, show: true, filter: false, edit: true },
      },
    },
  },
};
