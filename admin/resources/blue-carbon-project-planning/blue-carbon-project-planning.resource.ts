import { BlueCarbonProjectPlanning } from "@shared/entities/cost-inputs/blue-carbon-project-planning.entity.js";
import { ResourceWithOptions } from "adminjs";
import { GLOBAL_COMMON_PROPERTIES } from "../common/common.resources.js";

export const BlueCarbonProjectPlanningResource: ResourceWithOptions = {
  resource: BlueCarbonProjectPlanning,
  options: {
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
    },
    sort: {
      sortBy: "blueCarbon",
      direction: "desc",
    },
    navigation: {
      name: "Data Management",
      icon: "Database",
    },
  },
};
