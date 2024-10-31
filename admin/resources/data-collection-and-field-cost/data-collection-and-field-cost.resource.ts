import { ResourceWithOptions } from "adminjs";
import { DataCollectionAndFieldCosts2 } from "@shared/entities/cost-inputs/data-collection-and-field-costs.entity.js";

export const DataCollectionAndFieldCostResource: ResourceWithOptions = {
  resource: DataCollectionAndFieldCosts2,
  options: {
    sort: {
      sortBy: "fieldCost",
      direction: "desc",
    },
    navigation: {
      name: "Data Management",
      icon: "Database",
    },
  },
};
