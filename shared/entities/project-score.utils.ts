import { PROJECT_SCORE } from "@shared/entities/project-score.enum";
import { ProjectScorecard } from "@shared/entities/project-scorecard.entity";

export const ProjectScoreUtils = {
  toNumber: (score: PROJECT_SCORE): number => {
    switch (score) {
      case PROJECT_SCORE.LOW:
        return 1;
      case PROJECT_SCORE.MEDIUM:
        return 2;
      case PROJECT_SCORE.HIGH:
        return 3;
      default:
        return 0;
    }
  },
  computeProjectScoreCardRating(
    projectScoreCard: ProjectScorecard,
  ): PROJECT_SCORE | null {
    const legalFeasibility = ProjectScoreUtils.toNumber(
      projectScoreCard.legalFeasibility,
    );
    const implementationFeasibility = ProjectScoreUtils.toNumber(
      projectScoreCard.implementationFeasibility,
    );
    const socialFeasibility = ProjectScoreUtils.toNumber(
      projectScoreCard.socialFeasibility,
    );
    const securityRating = ProjectScoreUtils.toNumber(
      projectScoreCard.securityRating,
    );
    const availabilityOfExperiencedLabor = ProjectScoreUtils.toNumber(
      projectScoreCard.availabilityOfExperiencedLabor,
    );
    const availabilityOfAlternatingFunding = ProjectScoreUtils.toNumber(
      projectScoreCard.availabilityOfAlternatingFunding,
    );
    const coastalProtectionBenefits = ProjectScoreUtils.toNumber(
      projectScoreCard.coastalProtectionBenefits,
    );
    const biodiversityBenefit = ProjectScoreUtils.toNumber(
      projectScoreCard.biodiversityBenefit,
    );

    const scoreCardRating: number =
      (legalFeasibility * 0.12 +
        implementationFeasibility * 0.12 +
        socialFeasibility * 0.12 +
        securityRating * 0.05 +
        availabilityOfExperiencedLabor * 0.1 +
        availabilityOfAlternatingFunding * 0.05 +
        coastalProtectionBenefits * 0.03 +
        biodiversityBenefit * 0.03) /
      (0.12 + 0.12 + 0.12 + 0.05 + 0.1 + 0.05 + 0.03 + 0.03);

    if (scoreCardRating > 1 && scoreCardRating <= 1.666) {
      return PROJECT_SCORE.HIGH;
    }
    if (scoreCardRating > 1.666 && scoreCardRating <= 2.333) {
      return PROJECT_SCORE.MEDIUM;
    }
    if (scoreCardRating > 2.333 && scoreCardRating <= 3) {
      return PROJECT_SCORE.LOW;
    }
    return null;
  },
} as const;
