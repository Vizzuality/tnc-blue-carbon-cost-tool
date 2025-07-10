import { ResourceWithOptions } from 'adminjs';
import {
  DEFAULT_READONLY_PERMISSIONS,
  GLOBAL_COMMON_PROPERTIES,
} from '../common/common.resources.js';
import { Country } from '@shared/entities/country.entity.js';

export const CountryResource: ResourceWithOptions = {
  resource: Country,
  options: {
    properties: {
      ...GLOBAL_COMMON_PROPERTIES,
      geometry: {
        isVisible: { list: false, edit: false, show: false, filter: false },
      },
    },
    sort: {
      sortBy: 'name',
      direction: 'asc',
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
