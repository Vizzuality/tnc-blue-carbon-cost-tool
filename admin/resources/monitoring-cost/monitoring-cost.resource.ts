import { ResourceWithOptions } from "adminjs";
import { MonitoringCost } from "@shared/entities/cost-inputs/monitoring.entity.js";

export const MonitoringCostResource: ResourceWithOptions = {
  resource: MonitoringCost,
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
