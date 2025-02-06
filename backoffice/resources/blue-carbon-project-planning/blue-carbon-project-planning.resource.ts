import { BlueCarbonProjectPlanning } from '@shared/entities/cost-inputs/blue-carbon-project-planning.entity.js';
import { ResourceWithOptions } from 'adminjs';
import { GLOBAL_COMMON_PROPERTIES } from '../common/common.resources.js';
import {
  addSourceActionHandler,
  deleteSourceActionHandler,
  fetchAvailableSourceTypesActionHandler,
  fetchRelatedSourcesActionHandler,
} from 'backoffice/resources/common/many-2-many-sources.actions.js';
import { Components } from 'backoffice/components/index.js';

// position: number is not working in the options so we have to define the order of the columns using listProperties, showProperties and editProperties.
const COLUMN_ORDER = [
  'countryCode',
  'input1',
  'input2',
  'input3',
  'blueCarbon',
  'sources',
];

export const BlueCarbonProjectPlanningResource: ResourceWithOptions = {
  resource: BlueCarbonProjectPlanning,
  options: {
    listProperties: COLUMN_ORDER,
    showProperties: COLUMN_ORDER,
    editProperties: COLUMN_ORDER,
    properties: {
      ...GLOBAL_COMMON_PROPERTIES,
      input1: {
        isVisible: { show: false, edit: true, filter: false, list: true },
      },
      input2: {
        isVisible: { show: false, edit: true, filter: false, list: true },
      },
      input3: {
        isVisible: { show: false, edit: true, filter: false, list: true },
      },
      blueCarbon: {
        isVisible: { show: true, edit: true, filter: false, list: true },
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
    sort: {
      sortBy: 'blueCarbon',
      direction: 'desc',
    },
    navigation: {
      name: 'Data Management',
      icon: 'Database',
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
