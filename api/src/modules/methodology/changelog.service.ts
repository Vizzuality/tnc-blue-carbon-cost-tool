import { AppBaseService } from '@api/utils/app-base.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ModelComponentsVersionEntity } from '@shared/entities/model-versioning/model-components-version.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class ChangelogService extends AppBaseService<
  ModelComponentsVersionEntity,
  unknown,
  unknown,
  unknown
> {
  constructor(
    @InjectRepository(ModelComponentsVersionEntity)
    private readonly changelogRepo: Repository<ModelComponentsVersionEntity>,
  ) {
    super(changelogRepo, 'changelog');
  }

  async extendFindAllQuery(
    query: SelectQueryBuilder<ModelComponentsVersionEntity>,
  ): Promise<SelectQueryBuilder<ModelComponentsVersionEntity>> {
    query
      .addSelect('changelog.created_at', 'createdAt')
      .addSelect('changelog.version_name', 'versionName')
      .addSelect('changelog.version_notes', 'versionNotes');
    return query;
  }
}
