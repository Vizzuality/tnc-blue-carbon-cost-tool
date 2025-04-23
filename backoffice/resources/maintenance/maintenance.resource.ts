import { ResourceWithOptions } from 'adminjs';
import { Maintenance } from '@shared/entities/cost-inputs/maintenance.entity.js';
import { GLOBAL_COMMON_PROPERTIES } from '../common/common.resources.js';
import {
  fetchRelatedSourcesActionHandler,
  addSourceActionHandler,
  deleteSourceActionHandler,
  fetchAvailableSourceTypesActionHandler,
} from 'backoffice/resources/common/many-2-many-sources.actions.js';
import { Components } from 'backoffice/components/index.js';

const FIELD_ORDER = [
  'countryCode',
  'maintenanceCost',
  'maintenanceDuration',
  'sources',
];

export const MaintenanceResource: ResourceWithOptions = {
  resource: Maintenance,
  options: {
    sort: {
      sortBy: 'maintenanceCost',
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
