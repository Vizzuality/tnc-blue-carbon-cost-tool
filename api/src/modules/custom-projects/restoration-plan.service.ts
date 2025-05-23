import { Injectable } from '@nestjs/common';
import { GetRestorationPlanSchema } from '@shared/schemas/custom-projects/get-restoration-plan.schema';
import { z } from 'zod';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { RestorationPlanDto } from '@shared/dtos/custom-projects/restoration-plan.dto';

type GetRestorationPlan = z.infer<typeof GetRestorationPlanSchema>;

@Injectable()
export class RestorationPlanService {
  constructor(@InjectDataSource() dataSource: DataSource) {}

  async getRestorationPlan(dto: GetRestorationPlan) {
    const { projectSizeHa, restorationRate, restorationProjectLength } = dto;
    return this.buildRestorationPlan(
      projectSizeHa,
      restorationRate,
      restorationProjectLength,
    );
  }

  private hasCustomProjectLengthOrRate(dto: GetRestorationPlan) {
    return dto.restorationProjectLength || dto.restorationRate;
  }

  async getDefaultValues(dto: any) {}

  buildRestorationPlan(
    projectSizeHa: number,
    restorationRate: number,
    projectLength: number,
  ): RestorationPlanDto[] {
    const restorationPlanArray: {
      year: number;
      annualHectaresRestored: number;
    }[] = [];

    // If project size is bigger than the restoration rate, then the initial hectares value is
    // the project size itself
    const initialValue =
      projectSizeHa > restorationRate ? projectSizeHa : restorationRate;
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
}
