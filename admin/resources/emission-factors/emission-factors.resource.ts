import { ResourceWithOptions } from "adminjs";
import { EmissionFactors2 } from "@shared/entities/carbon-inputs/emission-factors.entity.js";

export const EmissionFactorsResource: ResourceWithOptions = {
  resource: EmissionFactors2,
  options: {
    sort: {
      sortBy: "tierSelector",
      direction: "asc",
    },
    navigation: {
      name: "Data Management",
      icon: "Database",
    },
  },
};
