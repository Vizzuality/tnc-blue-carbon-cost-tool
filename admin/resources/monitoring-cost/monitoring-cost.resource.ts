import { ResourceWithOptions } from "adminjs";
import { MonitoringCost } from "@shared/entities/cost-inputs/monitoring.entity.js";
import { GLOBAL_COMMON_PROPERTIES } from "../common/common.resources.js";

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
    properties: {
      ...GLOBAL_COMMON_PROPERTIES,
      monitoringCost: {
        isVisible: { list: true, show: true, filter: false, edit: true },
      },
    },
  },
};
