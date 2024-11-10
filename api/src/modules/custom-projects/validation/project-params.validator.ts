import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  validateSync,
  ValidationError,
} from 'class-validator';

import { ACTIVITY } from '@shared/entities/activity.enum';
import { ConservationProjectParamDto } from '@api/modules/custom-projects/dto/conservation-project-params.dto';
import { RestorationProjectParamsDto } from '@api/modules/custom-projects/dto/restoration-project-params.dto';
import { CreateCustomProjectDto } from '@api/modules/custom-projects/dto/create-custom-project-dto';
import { BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

@ValidatorConstraint({ name: 'ProjectParameterValidator', async: false })
export class ProjectParamsValidator implements ValidatorConstraintInterface {
  validate(value: CreateCustomProjectDto, args: ValidationArguments): boolean {
    const object = args.object as any;
    const { activity } = object;

    let dto: ConservationProjectParamDto | RestorationProjectParamsDto;
    if (activity === ACTIVITY.CONSERVATION) {
      dto = plainToInstance(
        ConservationProjectParamDto,
        value,
      ) as ConservationProjectParamDto;
    } else if (activity === ACTIVITY.RESTORATION) {
      dto = plainToInstance(
        RestorationProjectParamsDto,
        value,
      ) as RestorationProjectParamsDto;
    } else {
      return false;
    }

    const validationErrors: ValidationError[] = validateSync(dto);
    if (validationErrors.length) {
      throw new BadRequestException(this.formatErrors(validationErrors));
    }
    return validationErrors.length === 0;
  }

  private formatErrors(errors: ValidationError[]): any[] {
    const formattedErrors = [];
    errors.forEach((error) => {
      Object.values(error.constraints).forEach((constraint) => {
        formattedErrors.push(constraint);
      });
    });
    return formattedErrors;
  }
}
