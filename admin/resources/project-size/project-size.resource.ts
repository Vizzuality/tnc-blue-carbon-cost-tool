import { ResourceWithOptions } from "adminjs";
import { ProjectSize2 } from "@shared/entities/cost-inputs/project-size.entity.js";

export const ProjectSizeResource: ResourceWithOptions = {
  resource: ProjectSize2,
  options: {
    properties: {
      id: {
        isVisible: { list: false, show: false, edit: false, filter: false },
      },
      ecosystem: {
        isVisible: { list: true, show: true, edit: false, filter: true },
      },
      activity: {
        isVisible: { list: true, show: true, edit: false, filter: true },
      },
      sizeHa: {
        isVisible: { list: true, show: true, edit: true, filter: false },
      },
    },
    sort: {
      sortBy: "sizeHa",
      direction: "desc",
    },
    navigation: {
      name: "Data Management",
      icon: "Database",
    },
  },
};
