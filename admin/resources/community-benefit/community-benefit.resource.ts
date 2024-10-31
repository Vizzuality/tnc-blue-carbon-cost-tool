import { CommunityBenefitSharingFund2 } from "@shared/entities/cost-inputs/community-benefit-sharing-fund.entity.js";
import { ResourceWithOptions } from "adminjs";

export const CommunityBenefitResource: ResourceWithOptions = {
  resource: CommunityBenefitSharingFund2,
  options: {
    sort: {
      sortBy: "communityBenefitSharingFund",
      direction: "desc",
    },
    navigation: {
      name: "Data Management",
      icon: "Database",
    },
  },
};
