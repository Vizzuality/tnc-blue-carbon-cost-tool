import { ResourceWithOptions } from "adminjs";
import { EmissionFactors } from "@shared/entities/carbon-inputs/emission-factors.entity.js";

export const EmissionFactorsResource: ResourceWithOptions = {
  resource: EmissionFactors,
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
