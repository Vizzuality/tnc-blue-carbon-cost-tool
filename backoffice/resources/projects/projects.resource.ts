import { ActionContext, ActionRequest, ResourceWithOptions } from 'adminjs';
import { Project } from '@shared/entities/projects.entity.js';
import { GLOBAL_COMMON_PROPERTIES } from '../common/common.resources.js';
import { Components } from 'backoffice/components/index.js';

const CREATE_EDIT_FORM_FIELDS = [
  'projectName',
  'countryCode',
  'ecosystem',
  'activity',
  'projectSize',
  'priceType',
  'initialPriceAssumption',
  'restorationActivity',
];

export const ProjectsResource: ResourceWithOptions = {
  resource: Project,
  options: {
    properties: {
      ...GLOBAL_COMMON_PROPERTIES,
      countryCode: {
        components: {
          edit: Components.CountrySelector,
        },
      },
      initialPriceAssumption: {
        description: 'Initial carbon price assumption',
      },
      projectSize: {
        isVisible: { list: true, show: true, edit: true, filter: false },
      },
      abatementPotential: {
        isVisible: { list: true, show: true, edit: true, filter: false },
      },
      totalCostNPV: {
        isVisible: { list: true, show: true, edit: true, filter: false },
      },
      totalCost: {
        isVisible: { list: true, show: true, edit: true, filter: false },
      },
      costPerTCO2eNPV: {
        isVisible: { list: true, show: true, edit: true, filter: false },
      },
      costPerTCO2e: {
        isVisible: { list: true, show: true, edit: true, filter: false },
      },
    },
    editProperties: CREATE_EDIT_FORM_FIELDS,
    sort: {
      sortBy: 'projectName',
      direction: 'asc',
    },
    navigation: {
      name: 'Projects',
      icon: 'Folder',
    },
    actions: {
      new: {
        isAccessible: false,
        component: Components.ProjectDynamicForm,
      },
      edit: {
        isAccessible: false,
        component: Components.ProjectDynamicForm,
      },
      delete: {
        isAccessible: false,
      },
      bulkDelete: {
        isAccessible: false,
      },
    },
  },
};
