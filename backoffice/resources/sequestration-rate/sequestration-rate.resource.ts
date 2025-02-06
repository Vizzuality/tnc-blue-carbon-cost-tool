import { ResourceWithOptions } from 'adminjs';
import { SequestrationRate } from '@shared/entities/carbon-inputs/sequestration-rate.entity.js';
import { GLOBAL_COMMON_PROPERTIES } from '../common/common.resources.js';
import {
  fetchRelatedSourcesActionHandler,
  addSourceActionHandler,
  deleteSourceActionHandler,
  fetchAvailableSourceTypesActionHandler,
} from 'backoffice/resources/common/many-2-many-sources.actions.js';
import { Components } from 'backoffice/components/index.js';
export const SequestrationRateResource: ResourceWithOptions = {
  resource: SequestrationRate,
  options: {
    sort: {
      sortBy: 'tierSelector',
      direction: 'asc',
    },
    navigation: {
      name: 'Data Management',
      icon: 'Database',
    },
    listProperties: [
      'countryCode',
      'ecosystem',
      'tierSelector',
      'tier1Factor',
      'tier2Factor',
      'sequestrationRate',
      'sources',
    ],
    editProperties: [
      'id',
      'countryCode',
      'ecosystem',
      'tierSelector',
      'tier1Factor',
      'tier2Factor',
      'sequestrationRate',
      'sources',
    ],
    showProperties: [
      'id',
      'countryCode',
      'ecosystem',
      'tierSelector',
      'tier1Factor',
      'tier2Factor',
      'sequestrationRate',
      'sources',
    ],
    properties: {
      ...GLOBAL_COMMON_PROPERTIES,
      tier1Factor: {
        position: 4,
        isVisible: { list: false, show: true, filter: false, edit: true },
      },
      tier2Factor: {
        position: 5,
        isVisible: { list: false, show: true, filter: false, edit: true },
      },
      sequestrationRate: {
        position: 6,
        isVisible: { list: true, show: true, filter: false, edit: true },
      },
      sources: {
        position: 7,
        isVisible: { show: true, edit: true, list: true, filter: false },
        components: {
          list: Components.Many2ManySources,
          show: Components.Many2ManySources,
          edit: Components.Many2ManySources,
        },
      },
    },
    actions: {
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
