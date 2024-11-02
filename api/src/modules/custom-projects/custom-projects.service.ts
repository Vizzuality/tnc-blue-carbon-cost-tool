import { Injectable } from '@nestjs/common';
import { AppBaseService } from '@api/utils/app-base.service';
import { CreateCustomProjectDto } from '@shared/dtos/custom-projects/create-custom-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '@shared/entities/projects.entity';
import { Repository } from 'typeorm';
import { CustomProject } from '@shared/entities/custom-project.entity';
import { CalculationEngine } from '@api/modules/calculations/calculation.engine';

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
  ) {
    super(repo, 'customProject', 'customProjects');
  }

  async create(dto: CreateCustomProjectDto): Promise<any> {
    const { countryCode, ecosystem, activity } = dto;
    return this.calculationEngine.getBaseData({
      countryCode,
      ecosystem,
      activity,
    });
  }
}
