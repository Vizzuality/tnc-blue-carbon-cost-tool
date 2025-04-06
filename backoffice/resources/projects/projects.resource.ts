import { ActionContext, ActionRequest, ResourceWithOptions } from 'adminjs';
import { Project } from '@shared/entities/projects.entity.js';
import { GLOBAL_COMMON_PROPERTIES } from '../common/common.resources.js';
import { projectsContract } from '@shared/contracts/projects.contract.js';
import { ProjectActions } from 'backoffice/resources/projects/project.actions.js';

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
      name: 'Data Management',
      icon: 'Database',
    },
    actions: {
      new: {
        isAccessible: true,
        before: ProjectActions.beforeHook,
        after: ProjectActions.afterHook,
      },
      edit: {
        isAccessible: true,
        before: ProjectActions.beforeHook,
        after: ProjectActions.afterHook,
      },
      delete: {
        isAccessible: true,
      },
      bulkDelete: {
        isAccessible: false,
      },
    },
  },
};
