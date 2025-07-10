import { ResourceWithOptions } from 'adminjs';
import { CommunityRepresentation } from '@shared/entities/cost-inputs/community-representation.entity.js';
import {
  DEFAULT_READONLY_PERMISSIONS,
  GLOBAL_COMMON_PROPERTIES,
} from '../common/common.resources.js';

export const CommunityRepresentationResource: ResourceWithOptions = {
  resource: CommunityRepresentation,
  options: {
    sort: {
      sortBy: 'liaisonCost',
      direction: 'desc',
    },
    navigation: {
      name: 'Model Components',
      icon: 'Settings',
    },
    properties: {
      ...GLOBAL_COMMON_PROPERTIES,
      liaisonCost: {
        isVisible: { list: true, show: true, filter: false, edit: true },
      },
    },
    actions: {
      ...DEFAULT_READONLY_PERMISSIONS,
    },
  },
};
