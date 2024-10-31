import { ResourceWithOptions } from "adminjs";
import { MonitoringCost2 } from "@shared/entities/cost-inputs/monitoring.entity.js";

export const MonitoringCostResource: ResourceWithOptions = {
  resource: MonitoringCost2,
  options: {
    sort: {
      sortBy: "monitoringCost",
      direction: "desc",
    },
    navigation: {
      name: "Data Management",
      icon: "Database",
    },
  },
};
