import { ResourceWithOptions } from "adminjs";
import { LongTermProjectOperating } from "@shared/entities/cost-inputs/long-term-project-operating.entity.js";

export const LongTermProjectOperatingResource: ResourceWithOptions = {
  resource: LongTermProjectOperating,
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
