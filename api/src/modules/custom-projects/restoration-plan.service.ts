import { BadRequestException, Injectable } from '@nestjs/common';
import { GetRestorationPlanSchema } from '@shared/schemas/custom-projects/get-restoration-plan.schema';
import { z } from 'zod';
import { RestorationPlanDto } from '@shared/dtos/custom-projects/restoration-plan.dto';

export type GetRestorationPlan = z.infer<typeof GetRestorationPlanSchema>;

export type RestorationPlanParams = {
  projectSizeHa: number;
  restorationRate: number;
  restorationProjectLength: number;
  customRestorationPlan?: RestorationPlanDto[];
};

@Injectable()
export class RestorationPlanService {
  constructor() {}

  createDefaultRestorationPlan(
    projectSizeHa: number,
    restorationRate: number,
    projectLength: number,
  ): RestorationPlanDto[] {
    const restorationPlanArray: RestorationPlanDto[] = [];

    // If project size in hectares is greater than restoration rate, then we start with the restoration rate.
    // Otherwise, the initial value is the project size itself, as there won't be any remaining hectares to restore.
    const initialValue =
      projectSizeHa > restorationRate ? restorationRate : projectSizeHa;
    restorationPlanArray.push({
      year: -1,
      annualHectaresRestored: initialValue,
    });

    // Subtract the values as we build the plan
    let remainingHa = projectSizeHa - initialValue;

    for (let year = 1; year <= projectLength; year++) {
      if (year === 0) continue; // omit year 0 explicitly (optional since range starts at 1)

      let annual = 0;
      if (remainingHa > 0) {
        if (remainingHa >= restorationRate) {
          annual = restorationRate;
          remainingHa -= restorationRate;
        } else {
          annual = remainingHa;
          remainingHa = 0;
        }
      }
      restorationPlanArray.push({
        year,
        annualHectaresRestored: annual,
      });
    }

    return restorationPlanArray;
  }

  createRestorationPlan(params: RestorationPlanParams): RestorationPlanDto[] {
    const {
      projectSizeHa,
      restorationRate,
      restorationProjectLength,
      customRestorationPlan,
    } = params;

    let restorationPlan: RestorationPlanDto[] = [];

    if (!customRestorationPlan?.length) {
      restorationPlan = this.createDefaultRestorationPlan(
        projectSizeHa,
        restorationRate,
        restorationProjectLength,
      );
    } else {
      restorationPlan = this.createCustomRestorationPlan(params);
    }

    this.validateRestorationPlanOrThrow(restorationPlan, projectSizeHa);
    return restorationPlan;
  }

  createCustomRestorationPlan(
    params: RestorationPlanParams,
  ): RestorationPlanDto[] {
    const { restorationProjectLength, customRestorationPlan } = params;

    const restorationPlan: RestorationPlanDto[] = [];
    for (let year = -1; year <= restorationProjectLength; year++) {
      if (year === 0) continue; // omit year 0 explicitly
      const customEntry = customRestorationPlan?.find(
        (entry) => entry.year === year,
      );
      restorationPlan.push({
        year,
        annualHectaresRestored: customEntry?.annualHectaresRestored ?? 0,
      });
    }

    return restorationPlan;
  }

  private validateRestorationPlanOrThrow(
    restorationPlan: RestorationPlanDto[],
    projectSizeHa: number,
  ): void {
    const totalAreaToRestore = restorationPlan.reduce(
      (acc, plan) => acc + plan.annualHectaresRestored,
      0,
    );
    if (totalAreaToRestore > projectSizeHa) {
      throw new BadRequestException(
        `Total area to restore (${totalAreaToRestore} ha) exceeds project size (${projectSizeHa} ha).`,
      );
    }
  }
}
