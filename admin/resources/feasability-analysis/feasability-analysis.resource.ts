import { ResourceWithOptions } from "adminjs";
import { FeasibilityAnalysis } from "@shared/entities/cost-inputs/feasability-analysis.entity.js";

export const FeasibilityAnalysisResource: ResourceWithOptions = {
  resource: FeasibilityAnalysis,
  options: {
    sort: {
      sortBy: "analysisCost",
      direction: "desc",
    },
    navigation: {
      name: "Data Management",
      icon: "Database",
    },
  },
};
