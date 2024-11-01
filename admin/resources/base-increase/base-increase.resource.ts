import { ResourceWithOptions } from "adminjs";
import { BaseIncrease } from "@shared/entities/base-increase.entity.js";

export const BaseIncreaseResource: ResourceWithOptions = {
  resource: BaseIncrease,
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
