import { ResourceWithOptions } from 'adminjs';
import { CarbonRights } from '@shared/entities/cost-inputs/establishing-carbon-rights.entity.js';
import { GLOBAL_COMMON_PROPERTIES } from '../common/common.resources.js';

export const CarbonRightsResource: ResourceWithOptions = {
  resource: CarbonRights,
  options: {
    sort: {
      sortBy: 'carbonRightsCost',
      direction: 'desc',
    },
    navigation: {
      name: 'Model Components',
      icon: 'Settings',
    },
    properties: {
      ...GLOBAL_COMMON_PROPERTIES,
      carbonRightsCost: {
        isVisible: { list: true, show: true, filter: false, edit: true },
      },
    },
  },
};
