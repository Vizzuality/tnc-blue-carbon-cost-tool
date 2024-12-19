import { CustomProjectCostDetails } from "@shared/dtos/custom-projects/custom-project-output.dto";
import {
  ACTIVITY,
  RESTORATION_ACTIVITY_SUBTYPE,
} from "@shared/entities/activity.enum";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";
import { PROJECT_SCORE } from "@shared/entities/project-score.enum";
import {
  PROJECT_PRICE_TYPE,
  PROJECT_SIZE_FILTER,
} from "@shared/entities/projects.entity";

export interface Scorecard {
  financialFeasibility: PROJECT_SCORE;
  legalFeasibility: PROJECT_SCORE;
  implementationFeasibility: PROJECT_SCORE;
  socialFeasibility: PROJECT_SCORE;
  securityRating: PROJECT_SCORE;
  availabilityOfExperiencedLabor: PROJECT_SCORE;
  availabilityOfAlternatingFunding: PROJECT_SCORE;
  coastalProtectionBenefits: PROJECT_SCORE;
  biodiversityBenefit: PROJECT_SCORE;
}
export class ProjectScorecardDto {
  id: string;
  countryCode: string;
  ecosystem: ECOSYSTEM;
  activity: ACTIVITY;
  activitySubtype: RESTORATION_ACTIVITY_SUBTYPE;
  projectName: string;

  abatementPotential: number;
  projectSize: number;
  initialPriceAssumption: number;
  projectSizeFilter: PROJECT_SIZE_FILTER;
  priceType: PROJECT_PRICE_TYPE;

  scoreCardRating: PROJECT_SCORE;
  scorecard: Scorecard;
  projectCost: {
    total: {
      totalCost: number;
      capex: number;
      opex: number;
      costPerTCO2e: number;
      feasibilityAnalysis: number;
      conservationPlanning: number;
      dataCollection: number;
      communityRepresentation: number;
      blueCarbonProjectPlanning: number;
      establishingCarbonRights: number;
      validation: number;
      implementationLabor: number;
      monitoring: number;
      maintenance: number;
      monitoringMaintenance: number;
      communityBenefit: number;
      carbonStandardFees: number;
      baselineReassessment: number;
      mrv: number;
      longTermProjectOperating: number;
      totalRevenue: number;
    };
    npv: {
      totalCost: number;
      capex: number;
      opex: number;
      costPerTCO2e: number;
      feasibilityAnalysis: number;
      conservationPlanning: number;
      dataCollection: number;
      communityRepresentation: number;
      blueCarbonProjectPlanning: number;
      establishingCarbonRights: number;
      validation: number;
      implementationLabor: number;
      monitoring: number;
      maintenance: number;
      monitoringMaintenance: number;
      communityBenefit: number;
      carbonStandardFees: number;
      baselineReassessment: number;
      mrv: number;
      longTermProjectOperating: number;
      totalRevenue: number;
    };
  };
  leftoverAfterOpex: number;
  creditsIssued: number;
}
