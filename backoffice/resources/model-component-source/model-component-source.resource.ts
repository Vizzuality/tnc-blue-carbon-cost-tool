import { ModelComponentSource } from '@shared/entities/methodology/model-component-source.entity.js';
import { ResourceWithOptions } from 'adminjs';

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
  },
};
