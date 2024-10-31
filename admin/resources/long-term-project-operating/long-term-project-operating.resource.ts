import { ResourceWithOptions } from "adminjs";
import { LongTermProjectOperating2 } from "@shared/entities/cost-inputs/long-term-project-operating.entity.js";

export const LongTermProjectOperatingResource: ResourceWithOptions = {
  resource: LongTermProjectOperating2,
  options: {
    sort: {
      sortBy: "longTermProjectOperatingCost",
      direction: "desc",
    },
    navigation: {
      name: "Data Management",
      icon: "Database",
    },
  },
};
