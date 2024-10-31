import { ResourceWithOptions } from "adminjs";
import { CarbonStandardFees } from "@shared/entities/cost-inputs/carbon-standard-fees.entity.js";

export const CarbonStandardFeesResource: ResourceWithOptions = {
  resource: CarbonStandardFees,
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
