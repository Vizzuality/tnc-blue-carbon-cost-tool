import { ModelComponentSource } from '@shared/entities/methodology/model-component-source.entity.js';
import { ResourceWithOptions } from 'adminjs';
import { GLOBAL_COMMON_PROPERTIES } from 'backoffice/resources/common/common.resources.js';

export const ModelComponentSourceResource: ResourceWithOptions = {
  resource: ModelComponentSource,
  options: {
    navigation: {
      name: 'Methodology',
      icon: 'Layers',
    },
    sort: {
      sortBy: 'name',
      direction: 'asc',
    },
    properties: {
      ...GLOBAL_COMMON_PROPERTIES,
    },
  },
};
