import { AvailabilityOfAlternatingFunding } from "@shared/entities/project-score-card/value-object/availability-of-alternating-funding.value-object";
import { AvailabilityOfExperiencedLabor } from "@shared/entities/project-score-card/value-object/availability-of-experienced-labor.value-object";
import { BiodiversityBenefit } from "@shared/entities/project-score-card/value-object/biodiversity-benefit.value-object";
import { CoastalProtectionBenefits } from "@shared/entities/project-score-card/value-object/coastal-protection-benefits.value-object";
import { ImplementationFeasibility } from "@shared/entities/project-score-card/value-object/implementation-feasibility.value-object";
import { LegalFeasibility } from "@shared/entities/project-score-card/value-object/legal-feasibility.value-object";
import { SecurityRating } from "@shared/entities/project-score-card/value-object/security-rating.value-object";
import { SocialFeasibility } from "@shared/entities/project-score-card/value-object/social-feasibility.value-object";
import { PROJECT_SCORE } from "@shared/entities/project-score.enum";
import { ProjectScorecard } from "@shared/entities/project-scorecard.entity";

export const ProjectScoreUtils = {
  computeProjectScoreCardRating(
    projectScoreCard: ProjectScorecard,
  ): PROJECT_SCORE | null {
    const legalFeasibility = LegalFeasibility.fromString(
      projectScoreCard.legalFeasibility,
    ).toNumber();

    const implementationFeasibility = ImplementationFeasibility.fromString(
      projectScoreCard.implementationFeasibility,
    ).toNumber();

    const socialFeasibility = SocialFeasibility.fromString(
      projectScoreCard.socialFeasibility,
    ).toNumber();

    const securityRating = SecurityRating.fromString(
      projectScoreCard.securityRating,
    ).toNumber();
    const availabilityOfExperiencedLabor =
      AvailabilityOfExperiencedLabor.fromString(
        projectScoreCard.availabilityOfExperiencedLabor,
      ).toNumber();
    const availabilityOfAlternatingFunding =
      AvailabilityOfAlternatingFunding.fromString(
        projectScoreCard.availabilityOfAlternatingFunding,
      ).toNumber();
    const coastalProtectionBenefits = CoastalProtectionBenefits.fromString(
      projectScoreCard.coastalProtectionBenefits,
    ).toNumber();
    const biodiversityBenefit = BiodiversityBenefit.fromString(
      projectScoreCard.biodiversityBenefit,
    ).toNumber();

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
