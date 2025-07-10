import { ResourceWithOptions } from 'adminjs';
import { BaseIncrease } from '@shared/entities/base-increase.entity.js';
import {
  DEFAULT_READONLY_PERMISSIONS,
  GLOBAL_COMMON_PROPERTIES,
} from '../common/common.resources.js';

export const BaseIncreaseResource: ResourceWithOptions = {
  resource: BaseIncrease,
  options: {
    sort: {
      sortBy: 'ecosystem',
      direction: 'desc',
    },
    navigation: {
      name: 'Model Components',
      icon: 'Settings',
    },
    properties: {
      ...GLOBAL_COMMON_PROPERTIES,
    },
    actions: {
      ...DEFAULT_READONLY_PERMISSIONS,
    },
  },
};
