import { CommunityBenefitSharingFund } from "@shared/entities/cost-inputs/community-benefit-sharing-fund.entity.js";
import { ResourceWithOptions } from "adminjs";
import { GLOBAL_COMMON_PROPERTIES } from "../common/common.resources.js";

export const CommunityBenefitResource: ResourceWithOptions = {
  resource: CommunityBenefitSharingFund,
  options: {
    sort: {
      sortBy: "communityBenefitSharingFund",
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
