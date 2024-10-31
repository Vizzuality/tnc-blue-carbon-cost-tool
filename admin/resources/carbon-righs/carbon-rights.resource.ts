import { ResourceWithOptions } from "adminjs";
import { CarbonRights2 } from "@shared/entities/cost-inputs/establishing-carbon-rights.entity.js";

export const CarbonRightsResource: ResourceWithOptions = {
  resource: CarbonRights2,
  options: {
    sort: {
      sortBy: "carbonRightsCost",
      direction: "desc",
    },
    navigation: {
      name: "Data Management",
      icon: "Database",
    },
  },
};
