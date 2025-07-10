import { ResourceWithOptions } from 'adminjs';
import { EcosystemLoss } from '@shared/entities/carbon-inputs/ecosystem-loss.entity.js';
import {
  DEFAULT_READONLY_PERMISSIONS,
  GLOBAL_COMMON_PROPERTIES,
} from '../common/common.resources.js';
export const EcosystemLossResource: ResourceWithOptions = {
  resource: EcosystemLoss,
  options: {
    sort: {
      sortBy: 'ecosystemLossRate',
      direction: 'desc',
    },
    navigation: {
      name: 'Model Components',
      icon: 'Settings',
    },
    properties: {
      ...GLOBAL_COMMON_PROPERTIES,
      ecosystemLossRate: {
        isVisible: { list: true, show: true, filter: false, edit: true },
      },
    },
    actions: {
      ...DEFAULT_READONLY_PERMISSIONS,
    },
  },
};
