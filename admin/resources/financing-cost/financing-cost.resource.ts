import { ResourceWithOptions } from "adminjs";
import { FinancingCost2 } from "@shared/entities/cost-inputs/financing-cost.entity.js";

export const FinancingCostResource: ResourceWithOptions = {
  resource: FinancingCost2,
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
