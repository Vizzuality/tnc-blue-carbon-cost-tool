import { ResourceWithOptions } from "adminjs";
import { EmissionFactors } from "@shared/entities/carbon-inputs/emission-factors.entity.js";
import { GLOBAL_COMMON_PROPERTIES } from "../common/common.resources.js";
export const EmissionFactorsResource: ResourceWithOptions = {
  resource: EmissionFactors,
  options: {
    sort: {
      sortBy: "tierSelector",
      direction: "asc",
    },
    navigation: {
      name: "Data Management",
      icon: "Database",
    },
    properties: {
      ...GLOBAL_COMMON_PROPERTIES,
      emissionFactor: {
        isVisible: { show: true, edit: true, list: true, filter: false },
      },
      AGB: {
        isVisible: { show: true, edit: true, list: true, filter: false },
      },
      SOC: {
        isVisible: { show: true, edit: true, list: true, filter: false },
      },
      global: {
        isVisible: { show: true, edit: true, list: true, filter: false },
      },
      t2CountrySpecificAGB: {
        isVisible: { show: true, edit: true, list: true, filter: false },
      },
      t2CountrySpecificSOC: {
        isVisible: { show: true, edit: true, list: true, filter: false },
      },
    },
  },
};
