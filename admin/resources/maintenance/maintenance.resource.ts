import { ResourceWithOptions } from "adminjs";
import { Maintenance2 } from "@shared/entities/cost-inputs/maintenance.entity.js";

export const MaintenanceResource: ResourceWithOptions = {
  resource: Maintenance2,
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
