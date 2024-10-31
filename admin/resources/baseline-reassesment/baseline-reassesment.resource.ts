import { ResourceWithOptions } from "adminjs";
import { BaselineReassessment2 } from "@shared/entities/cost-inputs/baseline-reassessment.entity.js";

export const BaselineReassessmentResource: ResourceWithOptions = {
  resource: BaselineReassessment2,
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
