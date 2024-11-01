import { ResourceWithOptions } from "adminjs";
import { ImplementationLaborCost } from "@shared/entities/cost-inputs/implementation-labor-cost.entity.js";

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
  },
};
