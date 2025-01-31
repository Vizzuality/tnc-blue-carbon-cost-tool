import { ResourceWithOptions } from 'adminjs';
import { ProjectSize } from '@shared/entities/cost-inputs/project-size.entity.js';
import { GLOBAL_COMMON_PROPERTIES } from '../common/common.resources.js';
export const ProjectSizeResource: ResourceWithOptions = {
  resource: ProjectSize,
  options: {
    sort: {
      sortBy: 'sizeHa',
      direction: 'desc',
    },
    navigation: {
      name: 'Data Management',
      icon: 'Database',
    },
    properties: {
      ...GLOBAL_COMMON_PROPERTIES,
      sizeHa: {
        type: 'number',
        isVisible: { list: true, show: true, edit: true, filter: false },
        description: 'Size in hectares',
      },
      source: {
        isVisible: { list: true, show: true, edit: true, filter: false },
      },
    },
  },
};
