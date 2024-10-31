import { ResourceWithOptions } from "adminjs";
import { CarbonStandardFees2 } from "@shared/entities/cost-inputs/carbon-standard-fees.entity.js";

export const CarbonStandardFeesResource: ResourceWithOptions = {
  resource: CarbonStandardFees2,
  options: {
    sort: {
      sortBy: "carbonStandardFee",
      direction: "desc",
    },
    navigation: {
      name: "Data Management",
      icon: "Database",
    },
  },
};
