import { BlueCarbonProjectPlanning } from "@shared/entities/cost-inputs/blue-carbon-project-planning.entity.js";
import { ResourceWithOptions } from "adminjs";

export const BlueCarbonProjectPlanningResource: ResourceWithOptions = {
  resource: BlueCarbonProjectPlanning,
  options: {
    properties: {
      id: {
        isVisible: { list: false, show: false, edit: false, filter: false },
      },
      country: {
        isVisible: { list: true, show: true, edit: true, filter: true },
      },
      inputSelection: {
        isVisible: { list: true, show: true, edit: true, filter: true },
      },
      input1: {
        isVisible: { list: true, show: true, edit: true, filter: true },
      },
      input2: {
        isVisible: { list: true, show: true, edit: true, filter: true },
      },
      input3: {
        isVisible: { list: true, show: true, edit: true, filter: true },
      },
      blueCarbon: {
        isVisible: { list: true, show: true, edit: false, filter: true },
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
