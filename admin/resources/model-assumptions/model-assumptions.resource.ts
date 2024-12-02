import { ResourceWithOptions } from "adminjs";
import { ModelAssumptions } from "@shared/entities/model-assumptions.entity.js";
import { GLOBAL_COMMON_PROPERTIES } from "../common/common.resources.js";

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
    properties: {
      ...GLOBAL_COMMON_PROPERTIES,
      name: {
        isVisible: { list: true, show: true, filter: true, edit: false },
      },
    },
  },
};
