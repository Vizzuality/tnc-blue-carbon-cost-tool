import { EmissionFactorsSource } from '@shared/entities/methodology/emission-factor-source.entity.js';
import { ResourceWithOptions } from 'adminjs';

export const EmissionFactorsSourceResource: ResourceWithOptions = {
  resource: EmissionFactorsSource,
  options: {
    navigation: false,
    sort: {
      sortBy: 'emissionFactorType',
      direction: 'asc',
    },
    actions: {
      list: { isVisible: false },
      show: { isVisible: false },
      edit: { isVisible: false },
      delete: { isVisible: false },
      new: { isVisible: false },
    },
  },
};
