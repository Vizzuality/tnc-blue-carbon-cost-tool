import { Injectable } from '@nestjs/common';
import { AppBaseService } from '@api/utils/app-base.service';
import { CreateCustomProjectDto } from '@shared/dtos/custom-projects/create-custom-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomProject } from '@shared/entities/custom-project.entity';
import { CalculationEngine } from '@api/modules/calculations/calculation.engine';
import { CustomProjectFactory } from '@api/modules/custom-projects/custom-project.factory';
import { EMISSION_FACTORS_TIER_TYPES } from '@shared/entities/carbon-inputs/emission-factors.entity';

@Injectable()
export class CustomProjectsService extends AppBaseService<
  CustomProject,
  CreateCustomProjectDto,
  unknown,
  unknown
> {
  constructor(
    @InjectRepository(CustomProject)
    public readonly repo: Repository<CustomProject>,
    public readonly calculationEngine: CalculationEngine,
    public readonly customProjectFactory: CustomProjectFactory,
  ) {
    super(repo, 'customProject', 'customProjects');
  }

  async create(dto: CreateCustomProjectDto): Promise<any> {
    const { countryCode, ecosystem, activity, name } = dto;
    const { baseData, baseSize, baseIncrease, defaultAssumptions } =
      await this.calculationEngine.getBaseData({
        countryCode,
        ecosystem,
        activity,
      });

    // This prop should be required for the consumer? TIER 3 is not defined in the entity
    const emissionFactorUsed = EMISSION_FACTORS_TIER_TYPES.TIER_2;
    const project = this.customProjectFactory.createProject({
      name,
      ecosystem,
      activity,
      countryCode,
      inputData: baseData,
      emissionFactorUsed,
      projectSizeHa: baseData.projectSizeHa,
    });
    return project;
    //   return this.calculationEngine.buildProject({
    //     baseData,
    //     baseSize,
    //     baseIncrease,
    //     defaultAssumptions,
    //     countryCode,
    //     ecosystem,
    //     activity,
    //   });
    // }
  }
}
