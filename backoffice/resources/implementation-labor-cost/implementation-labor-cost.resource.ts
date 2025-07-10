import { ResourceWithOptions } from 'adminjs';
import { ImplementationLaborCost } from '@shared/entities/cost-inputs/implementation-labor-cost.entity.js';
import {
  DEFAULT_READONLY_PERMISSIONS,
  GLOBAL_COMMON_PROPERTIES,
} from '../common/common.resources.js';
import {
  fetchRelatedSourcesActionHandler,
  addSourceActionHandler,
  deleteSourceActionHandler,
  fetchAvailableSourceTypesActionHandler,
} from 'backoffice/resources/common/many-2-many-sources.actions.js';
import { Components } from 'backoffice/components/index.js';

const FIELD_ORDER = [
  'countryCode',
  'ecosystem',
  'plantingCost',
  'hybridCost',
  'hydrologyCost',
  'sources',
];

export const ImplementationLaborCostResource: ResourceWithOptions = {
  resource: ImplementationLaborCost,
  options: {
    sort: {
      sortBy: 'plantingCost',
      direction: 'desc',
    },
    navigation: {
      name: 'Model Components',
      icon: 'Settings',
    },
    listProperties: FIELD_ORDER,
    showProperties: FIELD_ORDER,
    editProperties: FIELD_ORDER,
    properties: {
      ...GLOBAL_COMMON_PROPERTIES,
      plantingCost: {
        isVisible: { list: true, show: true, filter: false, edit: true },
      },
      hybridCost: {
        isVisible: { list: true, show: true, filter: false, edit: true },
      },
      hydrologyCost: {
        isVisible: { list: true, show: true, filter: false, edit: true },
      },
      sources: {
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
