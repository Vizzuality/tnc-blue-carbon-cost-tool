import { ResourceWithOptions } from "adminjs";
import { ValidationCost2 } from "@shared/entities/cost-inputs/validation.entity.js";

export const ValidationCostResource: ResourceWithOptions = {
  resource: ValidationCost2,
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
