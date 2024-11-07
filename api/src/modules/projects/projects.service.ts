import { Injectable } from '@nestjs/common';
import { AppBaseService } from '@api/utils/app-base.service';
import { Project } from '@shared/entities/projects.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { FetchSpecification } from 'nestjs-base-service';
import { z } from 'zod';
import { ProjectGeoPropertiesSchema } from '@shared/schemas/geometries/projects';
import { projectsQuerySchema } from '@shared/contracts/projects.contract';

export type ProjectFetchSpecificacion = z.infer<typeof projectsQuerySchema>;

@Injectable()
export class ProjectsService extends AppBaseService<
  Project,
  unknown,
  unknown,
  unknown
> {
  constructor(
    @InjectRepository(Project)
    public readonly projectRepository: Repository<Project>,
  ) {
    super(projectRepository, 'project', 'projects');
  }

  async extendFindAllQuery(
    query: SelectQueryBuilder<Project>,
    fetchSpecification: ProjectFetchSpecificacion,
  ): Promise<SelectQueryBuilder<Project>> {
    // Filter by project name
    if (fetchSpecification?.filter?.projectName) {
      const filter = fetchSpecification.filter.projectName
        .map((name) => `'%${name}%'`)
        .join(',');
      query = query.andWhere('project_name ILIKE ANY(ARRAY[:projectName])', {
        projectName: filter,
      });
    }
    console.log('query', query.getQueryAndParameters());
    return query;
  }
}
