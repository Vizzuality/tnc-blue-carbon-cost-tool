import {
  ActionContext,
  ActionRequest,
  ActionResponse,
  ResourceWithOptions,
} from 'adminjs';
import { EmissionFactors } from '@shared/entities/carbon-inputs/emission-factors.entity.js';
import {
  DEFAULT_READONLY_PERMISSIONS,
  GLOBAL_COMMON_PROPERTIES,
} from '../common/common.resources.js';
import { Components } from 'backoffice/components/index.js';
import {
  addSourceActionHandler,
  deleteSourceActionHandler,
  fetchAvailableSourceTypesActionHandler,
  fetchRelatedSourcesActionHandler,
} from 'backoffice/resources/common/many-2-many-sources.actions.js';

export const EmissionFactorsResource: ResourceWithOptions = {
  resource: EmissionFactors,
  options: {
    listProperties: [
      'countryCode',
      'ecosystem',
      'AGB',
      'SOC',
      'global',
      'sources',
    ],
    filterProperties: ['countryCode', 'ecosystem'],
    sort: {
      sortBy: 'countryCode',
      direction: 'asc',
    },
    navigation: {
      name: 'Model Components',
      icon: 'Settings',
    },
    properties: {
      ...GLOBAL_COMMON_PROPERTIES,
      countryCode: {
        position: 1,
      },
      ecosystem: {
        position: 2,
      },
      AGB: {
        position: 5,
      },
      SOC: {
        position: 6,
      },
      global: {
        position: 7,
      },
      sources: {
        position: 11,
        isVisible: { show: true, edit: true, list: true, filter: false },
        components: {
          list: Components.Many2ManySources,
          show: Components.Many2ManySources,
          edit: Components.Many2ManySources,
        },
      },
    },
    actions: {
      ...DEFAULT_READONLY_PERMISSIONS,
      fetchRelatedSourcesAction: {
        actionType: 'record',
        isVisible: false,
        handler: fetchRelatedSourcesActionHandler,
      },
      addSourceAction: {
        actionType: 'record',
        isVisible: false,
        handler: addSourceActionHandler,
      },
      deleteSourceAction: {
        actionType: 'record',
        isVisible: false,
        handler: deleteSourceActionHandler,
      },
      fetchAvailableSourceTypesAction: {
        actionType: 'record',
        isVisible: false,
        handler: fetchAvailableSourceTypesActionHandler,
      },
    },
  },
};
