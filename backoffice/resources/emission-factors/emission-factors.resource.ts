import { ResourceWithOptions } from 'adminjs';
import { EmissionFactors } from '@shared/entities/carbon-inputs/emission-factors.entity.js';
import { GLOBAL_COMMON_PROPERTIES } from '../common/common.resources.js';
import { Components } from 'backoffice/components/index.js';
import {
  addSourceActionHandler,
  deleteSourceActionHandler,
  fetchRelatedSourcesActionHandler,
} from 'backoffice/resources/common/many-2-many-sources.actions.js';

export const EmissionFactorsResource: ResourceWithOptions = {
  resource: EmissionFactors,
  options: {
    listProperties: [
      'countryCode',
      'ecosystem',
      'tierSelector',
      'emissionFactor',
      'AGB',
      'SOC',
      'global',
      't2CountrySpecificAGB',
      't2CountrySpecificSOC',
      'sources',
    ],
    filterProperties: ['countryCode', 'ecosystem'],
    sort: {
      sortBy: 'tierSelector',
      direction: 'asc',
    },
    navigation: {
      name: 'Data Management',
      icon: 'Database',
    },
    properties: {
      ...GLOBAL_COMMON_PROPERTIES,
      countryCode: {
        position: 1,
      },
      ecosystem: {
        position: 2,
      },
      tierSelector: {
        position: 3,
      },
      emissionFactor: {
        position: 4,
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
      t2CountrySpecificAGB: {
        position: 8,
      },
      t2CountrySpecificSOC: {
        position: 10,
        isVisible: { show: true, edit: true, list: true, filter: true },
      },
      sources: {
        position: 11,
        isVisible: { show: true, edit: true, list: true, filter: false },
        reference: 'EmissionFactorsSource',
        components: {
          list: Components.EmissionFactorSources,
          show: Components.EmissionFactorSources,
          edit: Components.EmissionFactorSources,
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
    },
  },
};
