import { ResourceWithOptions } from "adminjs";
import { BaseSize } from "@shared/entities/base-size.entity.js";

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
  },
};
