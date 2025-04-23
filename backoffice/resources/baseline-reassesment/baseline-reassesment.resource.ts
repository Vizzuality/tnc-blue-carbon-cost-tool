import { ResourceWithOptions } from 'adminjs';
import { BaselineReassessment } from '@shared/entities/cost-inputs/baseline-reassessment.entity.js';
import { GLOBAL_COMMON_PROPERTIES } from '../common/common.resources.js';

export const BaselineReassessmentResource: ResourceWithOptions = {
  resource: BaselineReassessment,
  options: {
    sort: {
      sortBy: 'baselineReassessmentCost',
      direction: 'desc',
    },
    navigation: {
      name: 'Model Components',
      icon: 'Settings',
    },
    properties: {
      ...GLOBAL_COMMON_PROPERTIES,
      baselineReassessmentCost: {
        isVisible: { list: true, show: true, filter: false, edit: true },
      },
    },
  },
};
