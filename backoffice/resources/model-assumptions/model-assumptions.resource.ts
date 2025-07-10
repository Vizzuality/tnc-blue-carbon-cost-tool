import { ResourceWithOptions } from 'adminjs';
import { ModelAssumptions } from '@shared/entities/model-assumptions.entity.js';
import {
  DEFAULT_READONLY_PERMISSIONS,
  GLOBAL_COMMON_PROPERTIES,
} from '../common/common.resources.js';

export const ModelAssumptionResource: ResourceWithOptions = {
  resource: ModelAssumptions,
  options: {
    sort: {
      sortBy: 'name',
      direction: 'desc',
    },
    navigation: {
      name: 'Model Components',
      icon: 'Settings',
    },
    properties: {
      ...GLOBAL_COMMON_PROPERTIES,
      name: {
        isVisible: { list: true, show: true, filter: true, edit: false },
      },
    },
    actions: {
      ...DEFAULT_READONLY_PERMISSIONS,
    },
  },
};
