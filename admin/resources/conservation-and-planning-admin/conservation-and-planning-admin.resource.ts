import { ResourceWithOptions } from "adminjs";
import { ConservationPlanningAndAdmin } from "@shared/entities/cost-inputs/conservation-and-planning-admin.entity.js";
import { GLOBAL_COMMON_PROPERTIES, COMMON_RESOURCE_LIST_PROPERTIES } from "../common/common.resources.js";

export const ConservationAndPlanningAdminResource: ResourceWithOptions = {
  resource: ConservationPlanningAndAdmin,
  options: {
    properties: {...COMMON_RESOURCE_LIST_PROPERTIES, ...GLOBAL_COMMON_PROPERTIES},
    sort: {
      sortBy: "planningCost",
      direction: "desc",
    },
    navigation: {
      name: "Data Management",
      icon: "Database",
    },
  },
};
