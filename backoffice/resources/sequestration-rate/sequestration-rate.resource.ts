import { ResourceWithOptions } from "adminjs";
import { SequestrationRate } from "@shared/entities/carbon-inputs/sequestration-rate.entity.js";
import { GLOBAL_COMMON_PROPERTIES } from "../common/common.resources.js";
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
    properties: {
      ...GLOBAL_COMMON_PROPERTIES,
      tier1Factor: {
        isVisible: { list: false, show: true, filter: false, edit: true },
      },
      tier2Factor: {
        isVisible: { list: false, show: true, filter: false, edit: true },
      },
      sequestrationRate: {
        isVisible: { list: true, show: true, filter: false, edit: true },
      },
    },
  },
};
