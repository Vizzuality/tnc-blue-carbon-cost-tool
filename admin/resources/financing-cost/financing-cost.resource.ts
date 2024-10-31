import { ResourceWithOptions } from "adminjs";
import { FinancingCost } from "@shared/entities/cost-inputs/financing-cost.entity.js";

export const FinancingCostResource: ResourceWithOptions = {
  resource: FinancingCost,
  options: {
    sort: {
      sortBy: "financingCostCapexPercent",
      direction: "desc",
    },
    navigation: {
      name: "Data Management",
      icon: "Database",
    },
  },
};
