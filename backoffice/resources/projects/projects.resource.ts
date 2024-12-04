import { ResourceWithOptions } from "adminjs";
import { Project } from "@shared/entities/projects.entity.js";
import { GLOBAL_COMMON_PROPERTIES } from "../common/common.resources.js";

export const ProjectsResource: ResourceWithOptions = {
  resource: Project,
  options: {
    properties: {
      ...GLOBAL_COMMON_PROPERTIES,
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

    sort: {
      sortBy: "projectName",
      direction: "asc",
    },
    navigation: {
      name: "Data Management",
      icon: "Database",
    },
  },
};
