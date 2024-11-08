import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Validate,
} from 'class-validator';
import { ACTIVITY } from '@shared/entities/activity.enum';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';
import { ConservationProjectParamDto } from '@api/modules/custom-projects/dto/conservation-project-params.dto';
import { RestorationProjectParamsDto } from '@api/modules/custom-projects/dto/restoration-project-params.dto';
import { ProjectParamsValidator } from '@api/modules/custom-projects/dto/project-params.validator';

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
  @Validate((value, obj) => {
    obj.parameters.ecosystem = value;
    console.log('Asignaado a parameters.ecosystem', value);
    console.log('Objeto', obj);
  })
  ecosystem: ECOSYSTEM;

  @IsNumber()
  projectSizeHa: number;

  @IsNumber()
  initialCarbonPriceAssumption: number;

  @IsEnum(CARBON_REVENUES_TO_COVER)
  carbonRevenuesToCover: CARBON_REVENUES_TO_COVER;

  @IsNotEmpty()
  @Validate(ProjectParamsValidator)
  parameters: ConservationProjectParamDto | RestorationProjectParamsDto;
}
