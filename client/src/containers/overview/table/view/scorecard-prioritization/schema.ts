import { PROJECT_SCORE } from "@shared/entities/project-score.enum";
import { z } from "zod";

// todo: replace this schema with the one coming from create-custom-project.schema.ts once implemented there.
export const scorecardFiltersSchema = z.object({
  availabilityOfExperiencedLabor: z.nativeEnum(PROJECT_SCORE).optional(),
  availabilityOfAlternatingFunding: z.nativeEnum(PROJECT_SCORE).optional(),
  coastalProtectionBenefits: z.nativeEnum(PROJECT_SCORE).optional(),
  biodiversityBenefit: z.nativeEnum(PROJECT_SCORE).optional(),
  financialFeasibility: z.nativeEnum(PROJECT_SCORE).optional(),
  legalFeasibility: z.nativeEnum(PROJECT_SCORE).optional(),
  implementationFeasibility: z.nativeEnum(PROJECT_SCORE).optional(),
  socialFeasibility: z.nativeEnum(PROJECT_SCORE).optional(),
  securityRating: z.nativeEnum(PROJECT_SCORE).optional(),
});
