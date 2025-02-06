import { ModelComponentSourceM2M } from '@shared/entities/methodology/model-source-m2m.entity.js';
import { ResourceWithOptions } from 'adminjs';

export const Many2ManySources: ResourceWithOptions = {
  resource: ModelComponentSourceM2M,
  options: {
    navigation: null,
  },
};
