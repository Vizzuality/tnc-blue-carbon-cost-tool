import { ResourceWithOptions } from "adminjs";
import { EmissionFactors } from "@shared/entities/carbon-inputs/emission-factors.entity.js";
import { GLOBAL_COMMON_PROPERTIES } from "../common/common.resources.js";
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
    properties: {
      ...GLOBAL_COMMON_PROPERTIES,
    },  
  },
};
