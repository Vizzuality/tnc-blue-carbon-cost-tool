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
    listProperties: ['countryCode', 'ecosystem', 'activity', 'sizeHa'],
    showProperties: ['countryCode', 'ecosystem', 'activity', 'sizeHa'],
    editProperties: ['countryCode', 'ecosystem', 'activity', 'sizeHa'],
    properties: {
      ...GLOBAL_COMMON_PROPERTIES,
      sizeHa: {
        position: 4,
        type: 'number',
        isVisible: { list: true, show: true, edit: true, filter: false },
        description: 'Size in hectares',
      },
    },
  },
};
