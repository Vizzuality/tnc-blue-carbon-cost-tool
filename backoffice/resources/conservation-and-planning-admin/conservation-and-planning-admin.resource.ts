import { ResourceWithOptions } from 'adminjs';
import { ConservationPlanningAndAdmin } from '@shared/entities/cost-inputs/conservation-and-planning-admin.entity.js';
import {
  DEFAULT_READONLY_PERMISSIONS,
  GLOBAL_COMMON_PROPERTIES,
} from '../common/common.resources.js';

export const ConservationAndPlanningAdminResource: ResourceWithOptions = {
  resource: ConservationPlanningAndAdmin,
  options: {
    properties: {
      ...GLOBAL_COMMON_PROPERTIES,
      planningCost: {
        isVisible: { list: true, show: true, edit: true, filter: false },
      },
    },
    sort: {
      sortBy: 'planningCost',
      direction: 'desc',
    },
    navigation: {
      name: 'Model Components',
      icon: 'Settings',
    },
    actions: {
      ...DEFAULT_READONLY_PERMISSIONS,
    },
  },
};
