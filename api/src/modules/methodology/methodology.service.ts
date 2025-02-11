import { Inject, Injectable, Logger } from '@nestjs/common';
import { MethodologyRepository } from '@api/modules/methodology/methodology.repository';
import { MethodologySourcesDto } from '@shared/dtos/methodology/methodology-sources.dto';

@Injectable()
export class MethodologyService {
  protected logger: Logger = new Logger(this.constructor.name);

  public constructor(
    @Inject(MethodologyRepository)
    private readonly methodologySourcesRepository: MethodologyRepository,
  ) {}

  public async getModelComponentSources(): Promise<MethodologySourcesDto> {
    return this.methodologySourcesRepository.getModelComponentSources();
  }
}
