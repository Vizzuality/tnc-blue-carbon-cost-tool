import { ResourceWithOptions } from "adminjs";
import { DataCollectionAndFieldCosts } from "@shared/entities/cost-inputs/data-collection-and-field-costs.entity.js";
import { GLOBAL_COMMON_PROPERTIES } from "../common/common.resources.js";

export const DataCollectionAndFieldCostResource: ResourceWithOptions = {
  resource: DataCollectionAndFieldCosts,
  options: {
    sort: {
      sortBy: "fieldCost",
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
