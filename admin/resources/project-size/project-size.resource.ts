import { ResourceWithOptions } from "adminjs";
import { ProjectSize } from "@shared/entities/cost-inputs/project-size.entity.js";

export const ProjectSizeResource: ResourceWithOptions = {
  resource: ProjectSize,
  options: {
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
