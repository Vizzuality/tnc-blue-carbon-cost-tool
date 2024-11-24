import { ResourceWithOptions } from "adminjs";
import { BaseSize } from "@shared/entities/base-size.entity.js";
import { GLOBAL_COMMON_PROPERTIES } from "../common/common.resources.js";

export const BaseSizeResource: ResourceWithOptions = {
  resource: BaseSize,
  options: {
    sort: {
      sortBy: "ecosystem",
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
