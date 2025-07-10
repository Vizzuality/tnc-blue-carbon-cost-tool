import { ResourceWithOptions } from 'adminjs';
import { FeasibilityAnalysis } from '@shared/entities/cost-inputs/feasability-analysis.entity.js';
import {
  DEFAULT_READONLY_PERMISSIONS,
  GLOBAL_COMMON_PROPERTIES,
} from '../common/common.resources.js';

export const FeasibilityAnalysisResource: ResourceWithOptions = {
  resource: FeasibilityAnalysis,
  options: {
    sort: {
      sortBy: 'analysisCost',
      direction: 'desc',
    },
    navigation: {
      name: 'Model Components',
      icon: 'Settings',
    },
    properties: {
      ...GLOBAL_COMMON_PROPERTIES,
      analysisCost: {
        isVisible: { list: true, show: true, edit: true, filter: false },
      },
    },
    actions: {
      ...DEFAULT_READONLY_PERMISSIONS,
    },
  },
};
