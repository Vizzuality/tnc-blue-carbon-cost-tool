import { ResourceWithOptions } from "adminjs";
import { ModelAssumptions } from "@shared/entities/model-assumptions.entity.js";

export const ModelAssumptionResource: ResourceWithOptions = {
  resource: ModelAssumptions,
  options: {
    sort: {
      sortBy: "name",
      direction: "desc",
    },
    navigation: {
      name: "Data Management",
      icon: "Database",
    },
  },
};
