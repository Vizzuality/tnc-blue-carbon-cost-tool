import { ResourceWithOptions } from "adminjs";
import { CarbonStandardFees } from "@shared/entities/cost-inputs/carbon-standard-fees.entity.js";
import { GLOBAL_COMMON_PROPERTIES } from "../common/common.resources.js";

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
    properties: {
      ...GLOBAL_COMMON_PROPERTIES,
      carbonStandardFee: {
        isVisible: { list: true, show: true, filter: false, edit: true },
      },
    },
  },
};
