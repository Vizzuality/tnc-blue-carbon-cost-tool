import { ResourceWithOptions } from "adminjs";
import { MRV } from "@shared/entities/cost-inputs/mrv.entity.js";
import { GLOBAL_COMMON_PROPERTIES } from "../common/common.resources.js";
export const MRVResource: ResourceWithOptions = {
  resource: MRV,
  options: {
    sort: {
      sortBy: "mrvCost",
      direction: "desc",
    },
    navigation: {
      name: "Data Management",
      icon: "Database",
    },
    properties: {
      ...GLOBAL_COMMON_PROPERTIES,
    },
  },
};
