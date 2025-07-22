import { AppBaseService } from '@api/utils/app-base.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataIngestionEntity } from '@shared/entities/model-versioning/data-ingestion.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class ChangelogService extends AppBaseService<
  DataIngestionEntity,
  unknown,
  unknown,
  unknown
> {
  constructor(
    @InjectRepository(DataIngestionEntity)
    private readonly changelogRepo: Repository<DataIngestionEntity>,
  ) {
    super(changelogRepo, 'changelog');
  }

  async extendFindAllQuery(
    query: SelectQueryBuilder<DataIngestionEntity>,
  ): Promise<SelectQueryBuilder<DataIngestionEntity>> {
    query
      .addSelect('changelog.created_at', 'createdAt')
      .addSelect('changelog.version_name', 'versionName')
      .addSelect('changelog.version_notes', 'versionNotes');
    return query;
  }
}
