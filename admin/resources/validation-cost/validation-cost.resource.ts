import { ResourceWithOptions } from "adminjs";
import { ValidationCost } from "@shared/entities/cost-inputs/validation.entity.js";

export const ValidationCostResource: ResourceWithOptions = {
  resource: ValidationCost,
  options: {
    sort: {
      sortBy: "validationCost",
      direction: "desc",
    },
    navigation: {
      name: "Data Management",
      icon: "Database",
    },
  },
};
