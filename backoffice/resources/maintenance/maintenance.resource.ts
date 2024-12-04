import { ResourceWithOptions } from "adminjs";
import { Maintenance } from "@shared/entities/cost-inputs/maintenance.entity.js";
import { GLOBAL_COMMON_PROPERTIES } from "../common/common.resources.js";
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
    properties: {
      ...GLOBAL_COMMON_PROPERTIES,
      monitoringCost: {
        isVisible: { show: true, edit: true, list: true, filter: false },
      },
    },
  },
};
