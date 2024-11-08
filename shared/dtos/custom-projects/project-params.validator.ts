import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  validateSync,
} from "class-validator";

import { ACTIVITY } from "@shared/entities/activity.enum";
import { ConservationProjectParamDto } from "@shared/dtos/custom-projects/conservation-project-params.dto";
import { RestorationProjectParamsDto } from "@shared/dtos/custom-projects/restoration-project-params.dto";
import { CreateCustomProjectDto } from "@shared/dtos/custom-projects/create-custom-project-dto.deprecated";

@ValidatorConstraint({ name: "ProjectParameterValidator", async: false })
export class ProjectParamsValidator implements ValidatorConstraintInterface {
  validate(value: CreateCustomProjectDto, args: ValidationArguments): boolean {
    const object = args.object as any;
    const { activity } = object;

    let dto;
    if (activity === ACTIVITY.CONSERVATION) {
      dto = new ConservationProjectParamDto();
    } else if (activity === ACTIVITY.RESTORATION) {
      dto = new RestorationProjectParamsDto();
    } else {
      return false;
    }

    const validationErrors = validateSync(Object.assign(dto, value));
    return validationErrors.length === 0;
  }

  defaultMessage(args: ValidationArguments): string {
    return `Invalid parameters for the selected activity type.`;
  }
}
