import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseData } from '@shared/entities/base-data.entity';
import { Project } from '@shared/entities/users/projects.entity';

@Injectable()
export class ImportRepository {
  constructor(private readonly dataSource: DataSource) {}

  async ingest(importData: { baseData: BaseData[]; projects: Project[] }) {
    return this.dataSource.transaction(async (manager) => {
      const baseDataRepository = manager.getRepository(BaseData);
      const projectRepository = manager.getRepository(Project);

      // await baseDataRepository.save(importData.baseData);
      await projectRepository.save(importData.projects);
    });
  }
}
