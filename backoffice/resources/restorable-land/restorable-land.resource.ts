import { ResourceWithOptions } from 'adminjs';
import { RestorableLand } from '@shared/entities/carbon-inputs/restorable-land.entity.js';
import { GLOBAL_COMMON_PROPERTIES } from '../common/common.resources.js';
export const RestorableLandResource: ResourceWithOptions = {
  resource: RestorableLand,
  options: {
    sort: {
      sortBy: 'restorableLand',
      direction: 'desc',
    },
    navigation: {
      name: 'Model Components',
      icon: 'Settings',
    },
    properties: {
      ...GLOBAL_COMMON_PROPERTIES,
      restorableLand: {
        isVisible: { list: true, show: true, filter: false, edit: true },
      },
    },
  },
};
