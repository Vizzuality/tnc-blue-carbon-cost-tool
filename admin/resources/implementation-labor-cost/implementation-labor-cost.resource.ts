import { ResourceWithOptions } from "adminjs";
import { ImplementationLaborCost } from "@shared/entities/cost-inputs/implementation-labor-cost.entity.js";
import { GLOBAL_COMMON_PROPERTIES } from "../common/common.resources.js";

export const ImplementationLaborCostResource: ResourceWithOptions = {
  resource: ImplementationLaborCost,
  options: {
    sort: {
      sortBy: "plantingCost",
      direction: "desc",
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
