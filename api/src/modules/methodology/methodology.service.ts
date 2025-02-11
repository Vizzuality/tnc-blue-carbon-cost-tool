import { Inject, Injectable, Logger } from '@nestjs/common';
import { MethodologyRepository } from '@api/modules/methodology/methodology.repository';
import { MethodologySourcesDto } from '@shared/dtos/methodology/methodology-sources.dto';
import { ModelAssumptions } from '@shared/entities/model-assumptions.entity';
import { AssumptionsRepository } from '@api/modules/calculations/assumptions.repository';

@Injectable()
export class MethodologyService {
  protected logger: Logger = new Logger(this.constructor.name);

  public constructor(
    private readonly assumptionsRepository: AssumptionsRepository,
    @Inject(MethodologyRepository)
    private readonly methodologySourcesRepository: MethodologyRepository,
  ) {}

  public async getAllModelAssumptions(): Promise<ModelAssumptions[]> {
    return this.assumptionsRepository.find();
  }

  public async getModelComponentSources(): Promise<MethodologySourcesDto> {
    return this.methodologySourcesRepository.getModelComponentSources();
  }
}
