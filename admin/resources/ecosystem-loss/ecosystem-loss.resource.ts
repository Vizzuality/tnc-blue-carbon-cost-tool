import { ResourceWithOptions } from "adminjs";
import { EcosystemLoss } from "@shared/entities/carbon-inputs/ecosystem-loss.entity.js";

export const EcosystemLossResource: ResourceWithOptions = {
  resource: EcosystemLoss,
  options: {
    sort: {
      sortBy: "ecosystemLossRate",
      direction: "desc",
    },
    navigation: {
      name: "Data Management",
      icon: "Database",
    },
  },
};
