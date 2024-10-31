import { ResourceWithOptions } from "adminjs";
import { RestorableLand } from "@shared/entities/carbon-inputs/restorable-land.entity.js";

export const RestorableLandResource: ResourceWithOptions = {
  resource: RestorableLand,
  options: {
    sort: {
      sortBy: "restorableLand",
      direction: "desc",
    },
    navigation: {
      name: "Data Management",
      icon: "Database",
    },
  },
};
