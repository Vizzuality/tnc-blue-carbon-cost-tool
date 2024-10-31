import { ResourceWithOptions } from "adminjs";
import { Maintenance } from "@shared/entities/cost-inputs/maintenance.entity.js";

export const MaintenanceResource: ResourceWithOptions = {
  resource: Maintenance,
  options: {
    sort: {
      sortBy: "maintenanceCost",
      direction: "desc",
    },
    navigation: {
      name: "Data Management",
      icon: "Database",
    },
  },
};
