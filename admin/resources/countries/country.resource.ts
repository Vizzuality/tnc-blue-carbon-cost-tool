import { ResourceWithOptions } from "adminjs";
import { GLOBAL_COMMON_PROPERTIES } from "../common/common.resources.js";
import { Country } from "@shared/entities/country.entity.js";

export const CountryResource: ResourceWithOptions = {
  resource: Country,
  options: {
    properties: {
      ...GLOBAL_COMMON_PROPERTIES,
      geometry: {
        isVisible: { list: false, edit: false, show: false, filter: false },
      },
    },
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
