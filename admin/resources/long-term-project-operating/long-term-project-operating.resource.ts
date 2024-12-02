import { ResourceWithOptions } from "adminjs";
import { LongTermProjectOperating } from "@shared/entities/cost-inputs/long-term-project-operating.entity.js";
import { GLOBAL_COMMON_PROPERTIES } from "../common/common.resources.js";
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
    properties: {
      ...GLOBAL_COMMON_PROPERTIES,
      longTermProjectOperatingCost: {
        isVisible: { list: true, show: true, filter: false, edit: true },
      },
    },
  },
};
