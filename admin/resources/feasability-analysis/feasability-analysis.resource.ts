import { ResourceWithOptions } from "adminjs";
import { FeasibilityAnalysis } from "@shared/entities/cost-inputs/feasability-analysis.entity.js";
import { GLOBAL_COMMON_PROPERTIES } from "../common/common.resources.js";

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
    properties: {
      ...GLOBAL_COMMON_PROPERTIES,
      analysisCost: {
        isVisible: { list: true, show: true, edit: true, filter: false },
      },
    },
  },
};
