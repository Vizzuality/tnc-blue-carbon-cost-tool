import { ResourceWithOptions } from "adminjs";
import { EcosystemLoss2 } from "@shared/entities/carbon-inputs/ecosystem-loss.entity.js";

export const EcosystemLossResource: ResourceWithOptions = {
  resource: EcosystemLoss2,
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
