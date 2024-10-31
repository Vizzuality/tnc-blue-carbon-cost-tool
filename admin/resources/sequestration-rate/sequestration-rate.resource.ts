import { ResourceWithOptions } from "adminjs";
import { SequestrationRate } from "@shared/entities/carbon-inputs/sequestration-rate.entity.js";

export const SequestrationRateResource: ResourceWithOptions = {
  resource: SequestrationRate,
  options: {
    sort: {
      sortBy: "tierSelector",
      direction: "asc",
    },
    navigation: {
      name: "Data Management",
      icon: "Database",
    },
  },
};
