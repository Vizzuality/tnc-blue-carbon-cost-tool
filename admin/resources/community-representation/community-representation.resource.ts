import { ResourceWithOptions } from "adminjs";
import { CommunityRepresentation2 } from "@shared/entities/cost-inputs/community-representation.entity.js";

export const CommunityRepresentationResource: ResourceWithOptions = {
  resource: CommunityRepresentation2,
  options: {
    sort: {
      sortBy: "liaisonCost",
      direction: "desc",
    },
    navigation: {
      name: "Data Management",
      icon: "Database",
    },
  },
};
