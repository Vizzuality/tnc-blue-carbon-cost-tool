import { ResourceWithOptions } from "adminjs";
import { CarbonRights } from "@shared/entities/cost-inputs/establishing-carbon-rights.entity.js";

export const CarbonRightsResource: ResourceWithOptions = {
  resource: CarbonRights,
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
