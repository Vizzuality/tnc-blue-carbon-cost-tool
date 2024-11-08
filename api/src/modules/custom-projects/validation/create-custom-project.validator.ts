// import { Injectable } from '@nestjs/common';
// import { ACTIVITY } from '@shared/entities/activity.enum';
// import { ConservationProjectValidator } from '@api/modules/custom-projects/validation/conservation-project.validator';
// import { CalculationEngine } from '@api/modules/calculations/calculation.engine';
// import { CreateCustomProjectDto } from '@shared/dtos/custom-projects/create-custom-project-dto.deprecated';
//
// @Injectable()
// export class CreateCustomProjectValidator {
//   project: Record<any, any>;
//   constructor(private readonly calculationEngine: CalculationEngine) {}
//
//   async validate(dto: CreateCustomProjectDto) {
//     const { countryCode, ecosystem, activity, projectName } = dto;
//     const { baseData } = await this.calculationEngine.getBaseData({
//       countryCode,
//       ecosystem,
//       activity,
//     });
//     if (dto.activity === ACTIVITY.CONSERVATION) {
//       return new ConservationProjectValidator(dto, baseData).validate();
//     }
//   }
// }
