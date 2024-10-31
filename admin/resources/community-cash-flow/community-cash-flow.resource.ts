import { CommunityCashFlow2 } from "@shared/entities/cost-inputs/community-cash-flow.entity.js";
import { ResourceWithOptions } from "adminjs";

export const CommunityCashFlowResource: ResourceWithOptions = {
  resource: CommunityCashFlow2,
  options: {
    sort: {
      sortBy: "cashflowType",
      direction: "asc",
    },
    navigation: {
      name: "Data Management",
      icon: "Database",
    },
  },
};
