import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MethodologySource } from '@shared/entities/methodology/methodology-source.entity';
import { AppBaseService } from '@api/utils/app-base.service';
import { MethodologySourcesRepository } from '@api/modules/methodology/methodology.repository';

@Injectable()
export class MethodologySourcesService extends AppBaseService<
  MethodologySource,
  unknown,
  unknown,
  unknown
> {
  protected logger: Logger = new Logger(this.constructor.name);

  public constructor(
    @InjectRepository(MethodologySourcesRepository)
    private readonly methodologySourcesRepository: MethodologySourcesRepository,
  ) {
    super(methodologySourcesRepository);
  }
}
