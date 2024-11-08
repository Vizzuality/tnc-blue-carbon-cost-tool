import { LOSS_RATE_USED } from "@shared/schemas/custom-projects/create-custom-project.schema";
import {
  IsEnum,
  IsNegative,
  IsNotEmpty,
  IsNumber,
  ValidateIf,
} from "class-validator";
import { EMISSION_FACTORS_TIER_TYPES } from "@shared/entities/carbon-inputs/emission-factors.entity";
import { CreateCustomProjectDto } from "@shared/dtos/custom-projects/create-custom-project-dto.deprecated";
import { ACTIVITY } from "@shared/entities/activity.enum";

export enum PROJECT_SPECIFIC_EMISSION {
  ONE_EMISSION_FACTOR = "One emission factor",
  TWO_EMISSION_FACTORS = "Two emission factors",
}
export enum TIER_3_EMISSION_FACTORS {
  TIER_3 = "Tier 3 - Project specific emission factor",
}

export class ConservationProjectParamDto {
  @ValidateIf((o) => o.acitvity === ACTIVITY.CONSERVATION)
  @IsEnum(LOSS_RATE_USED)
  lossRateUsed: LOSS_RATE_USED;

  @ValidateIf((o) => o.lossRateUsed === LOSS_RATE_USED.PROJECT_SPECIFIC)
  @IsNotEmpty({
    message:
      "Project Specific Loss Rate is required when lossRateUsed is projectSpecific",
  })
  @IsNumber()
  @IsNegative({ message: "Project Specific Loss Rate must be negative" })
  projectSpecificLossRate?: number;

  @IsEnum(EMISSION_FACTORS_TIER_TYPES || TIER_3_EMISSION_FACTORS)
  emissionFactorUsed: EMISSION_FACTORS_TIER_TYPES | TIER_3_EMISSION_FACTORS;

  // This should be set at later stages for the calculations, but it is not required for the consumer
  //emissionFactor: number;

  @ValidateIf(
    (o) => o.emissionFactorUsed === EMISSION_FACTORS_TIER_TYPES.TIER_2,
  )
  emissionFactorAGB: number;

  emissionFactorSOC: number;

  @ValidateIf((o) => o.emissionFactorUsed === TIER_3_EMISSION_FACTORS.TIER_3)
  @IsEnum(PROJECT_SPECIFIC_EMISSION)
  projectSpecificEmission: PROJECT_SPECIFIC_EMISSION;

  projectSpecificEmissionFactor: number;
}
