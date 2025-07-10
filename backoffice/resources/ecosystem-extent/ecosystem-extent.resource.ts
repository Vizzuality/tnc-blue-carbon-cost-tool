import { ResourceWithOptions } from 'adminjs';
import { Components } from 'backoffice/components/index.js';
import {
  addSourceActionHandler,
  deleteSourceActionHandler,
  fetchAvailableSourceTypesActionHandler,
  fetchRelatedSourcesActionHandler,
} from 'backoffice/resources/common/many-2-many-sources.actions.js';
import { EcosystemExtent } from '@shared/entities/carbon-inputs/ecosystem-extent.entity.js';
import { DEFAULT_READONLY_PERMISSIONS } from 'backoffice/resources/common/common.resources.js';

const FIELD_ORDER = [
  'countryCode',
  'ecosystem',
  'extent',
  'historicExtent',
  'unprotectedExtent',
  'sources',
];

export const EcosystemExtentResource: ResourceWithOptions = {
  resource: EcosystemExtent,
  options: {
    navigation: {
      name: 'Model Components',
      icon: 'Settings',
    },
    sort: {
      sortBy: 'countryCode',
      direction: 'asc',
    },
    listProperties: FIELD_ORDER,
    showProperties: FIELD_ORDER,
    editProperties: FIELD_ORDER,
    properties: {
      id: {
        isVisible: { list: false, show: true, edit: false, filter: false },
      },
      countryCode: {
        position: 1,
      },
      ecosystem: {
        position: 2,
      },
      extent: {
        position: 3,
      },
      historicExtent: {
        position: 4,
      },
      sources: {
        position: 5,
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
