import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Validate,
  ValidateNested,
} from 'class-validator';
import { ACTIVITY } from '@shared/entities/activity.enum';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';
import { ConservationProjectParamDto } from '@api/modules/custom-projects/dto/conservation-project-params.dto';
import { RestorationProjectParamsDto } from '@api/modules/custom-projects/dto/restoration-project-params.dto';
import { OverridableAssumptions } from '@api/modules/custom-projects/dto/project-assumptions.dto';
import { CostInputs } from '@api/modules/custom-projects/dto/project-cost-inputs.dto';
import { ProjectParamsValidator } from '@api/modules/custom-projects/validation/project-params.validator';
import { Transform, Type } from 'class-transformer';

export enum CARBON_REVENUES_TO_COVER {
  OPEX = 'Opex',
  CAPEX_AND_OPEX = 'Capex and Opex',
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

  @ValidateNested()
  @Type(() => OverridableAssumptions)
  @IsNotEmpty({
    message: 'Assumptions are required to create a custom project',
  })
  assumptions: OverridableAssumptions;

  @IsNotEmpty({
    message: 'Cost inputs are required to create a custom project',
  })
  @ValidateNested()
  @Type(() => CostInputs)
  costInputs: CostInputs;

  @IsNotEmpty()
  @Transform(injectEcosystemToParams)
  @Validate(ProjectParamsValidator)
  parameters: ConservationProjectParamDto | RestorationProjectParamsDto;
}

function injectEcosystemToParams({ obj, value }) {
  // Helper to inject the ecosystem into the parameters object so we can perform further validations that are specific to
  // the activity type
  return {
    ...value,
    ecosystem: obj.ecosystem,
  };
}
