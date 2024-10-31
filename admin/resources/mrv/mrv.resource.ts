import { ResourceWithOptions } from "adminjs";
import { MRV2 } from "@shared/entities/cost-inputs/mrv.entity.js";

export const MRVResource: ResourceWithOptions = {
  resource: MRV2,
  options: {
    sort: {
      sortBy: "mrvCost",
      direction: "desc",
    },
    navigation: {
      name: "Data Management",
      icon: "Database",
    },
  },
};
