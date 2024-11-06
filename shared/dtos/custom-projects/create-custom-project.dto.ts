import {
  IsEnum,
  IsNegative,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";
import { ACTIVITY } from "@shared/entities/activity.enum";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";
import { LOSS_RATE_USED } from "@shared/schemas/custom-projects/create-custom-project.schema";
import { EMISSION_FACTORS_TIER_TYPES } from "@shared/entities/carbon-inputs/emission-factors.entity";

export class CreateCustomProjectDto {
  @IsString()
  @Min(3)
  @Max(3)
  countryCode: string;

  @IsString()
  projectName: string;

  @IsEnum(ACTIVITY)
  activity: ACTIVITY;

  @IsEnum(ECOSYSTEM)
  ecosystem: ECOSYSTEM;

  @IsEnum(LOSS_RATE_USED)
  lossRateUsed: LOSS_RATE_USED;

  projectSpecificLossRate?: number;

  emissionFactorUsed: EMISSION_FACTORS_TIER_TYPES;

  emissionFactor: number;

  emissionFactorAGB: number;

  emissionFactorSOC: number;

  projectSpecificEmission: "One emission factor" | "Two emission factors";
  projectSpecificEmissionFactor: number;
}
