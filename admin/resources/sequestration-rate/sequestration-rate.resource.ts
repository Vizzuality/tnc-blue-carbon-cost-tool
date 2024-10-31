import { ResourceWithOptions } from "adminjs";
import { SequestrationRate2 } from "@shared/entities/carbon-inputs/sequestration-rate.entity.js";

export const SequestrationRateResource: ResourceWithOptions = {
  resource: SequestrationRate2,
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
