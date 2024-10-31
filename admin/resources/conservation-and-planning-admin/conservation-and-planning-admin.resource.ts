import { ResourceWithOptions } from "adminjs";
import { ConservationPlanningAndAdmin2 } from "@shared/entities/cost-inputs/conservation-and-planning-admin.entity.js";

export const ConservationAndPlanningAdminResource: ResourceWithOptions = {
  resource: ConservationPlanningAndAdmin2,
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
