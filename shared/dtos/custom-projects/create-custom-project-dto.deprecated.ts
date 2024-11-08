import {
  IsEnum,
  IsNegative,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
  Validate,
  ValidateIf,
} from "class-validator";
import { ACTIVITY } from "@shared/entities/activity.enum";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";
import { LOSS_RATE_USED } from "@shared/schemas/custom-projects/create-custom-project.schema";
import { EMISSION_FACTORS_TIER_TYPES } from "@shared/entities/carbon-inputs/emission-factors.entity";
import { ConservationProjectParamDto } from "@shared/dtos/custom-projects/conservation-project-params.dto";
import { RestorationProjectParamsDto } from "@shared/dtos/custom-projects/restoration-project-params.dto";
import { ProjectParamsValidator } from "@shared/dtos/custom-projects/project-params.validator";
import { Transform, Type } from "class-transformer";

export enum CARBON_REVENUES_TO_COVER {
  OPEX = "Opex",
  CAPEX_AND_OPEX = "Capex and Opex",
}

export class CreateCustomProjectDto {
  @IsString()
  @Length(3, 3)
  countryCode: string;

  @IsString()
  projectName: string;

  @IsEnum(ACTIVITY)
  activity: ACTIVITY;

  @IsEnum(ECOSYSTEM)
  ecosystem: ECOSYSTEM;

  @IsNumber()
  projectSizeHa: number;

  @IsNumber()
  initialCarbonPriceAssumption: number;

  @IsEnum(CARBON_REVENUES_TO_COVER)
  carbonRevenuesToCover: CARBON_REVENUES_TO_COVER;

  @IsNotEmpty()
  @Validate(ProjectParamsValidator, {
    message: "Invalid project parameters for the selected activity type.",
  })
  parameters: ConservationProjectParamDto | RestorationProjectParamsDto;
}
