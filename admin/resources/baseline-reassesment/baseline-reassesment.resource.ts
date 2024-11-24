import { ResourceWithOptions } from "adminjs";
import { BaselineReassessment } from "@shared/entities/cost-inputs/baseline-reassessment.entity.js";
import { GLOBAL_COMMON_PROPERTIES } from "../common/common.resources.js";

export const BaselineReassessmentResource: ResourceWithOptions = {
  resource: BaselineReassessment,
  options: {
    sort: {
      sortBy: "baselineReassessmentCost",
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
