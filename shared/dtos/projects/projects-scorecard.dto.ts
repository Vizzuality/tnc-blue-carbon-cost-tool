import {
  ACTIVITY,
  RESTORATION_ACTIVITY_SUBTYPE,
} from "@shared/entities/activity.enum";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";
import { PROJECT_SCORE } from "@shared/entities/project-score.enum";

export type ProjectScorecardDto = {
  countryCode: string;
  ecosystem: ECOSYSTEM;
  activity: ACTIVITY;
  activitySubtype: RESTORATION_ACTIVITY_SUBTYPE;
  project_name: string;
  financialFeasibility: PROJECT_SCORE;
  legalFeasibility: PROJECT_SCORE;
  implementationFeasibility: PROJECT_SCORE;
  socialFeasibility: PROJECT_SCORE;
  securityRating: PROJECT_SCORE;
  availabilityOfExperiencedLabor: PROJECT_SCORE;
  availabilityOfAlternatingFunding: PROJECT_SCORE;
  coastalProtectionBenefits: PROJECT_SCORE;
  biodiversityBenefit: PROJECT_SCORE;
  abatementPotential: number;
  totalCost: number;
  totalCostNPV: number;
};
