import { ResourceWithOptions } from "adminjs";
import { FinancingCost } from "@shared/entities/cost-inputs/financing-cost.entity.js";
import { GLOBAL_COMMON_PROPERTIES } from "../common/common.resources.js";
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
    properties: {
      ...GLOBAL_COMMON_PROPERTIES,
      financingCostCapexPercent: {
        isVisible: { list: true, show: true, filter: false, edit: true },
      },
    },
  },
};
