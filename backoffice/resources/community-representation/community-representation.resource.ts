import { ResourceWithOptions } from "adminjs";
import { CommunityRepresentation } from "@shared/entities/cost-inputs/community-representation.entity.js";
import { GLOBAL_COMMON_PROPERTIES } from "../common/common.resources.js";

export const CommunityRepresentationResource: ResourceWithOptions = {
  resource: CommunityRepresentation,
  options: {
    sort: {
      sortBy: "liaisonCost",
      direction: "desc",
    },
    navigation: {
      name: "Data Management",
      icon: "Database",
    },
    properties: {
      ...GLOBAL_COMMON_PROPERTIES,
      liaisonCost: {
        isVisible: { list: true, show: true, filter: false, edit: true },
      },
    },
  },
};
