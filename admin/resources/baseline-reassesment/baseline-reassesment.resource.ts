import { ResourceWithOptions } from "adminjs";
import { BaselineReassessment } from "@shared/entities/cost-inputs/baseline-reassessment.entity.js";

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
  },
};
