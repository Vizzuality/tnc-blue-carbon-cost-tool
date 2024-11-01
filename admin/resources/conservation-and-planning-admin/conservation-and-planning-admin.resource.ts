import { ResourceWithOptions } from "adminjs";
import { ConservationPlanningAndAdmin } from "@shared/entities/cost-inputs/conservation-and-planning-admin.entity.js";

export const ConservationAndPlanningAdminResource: ResourceWithOptions = {
  resource: ConservationPlanningAndAdmin,
  options: {
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
