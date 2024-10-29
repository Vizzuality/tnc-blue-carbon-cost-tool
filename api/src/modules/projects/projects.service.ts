import { Inject, Injectable } from '@nestjs/common';
import { AppBaseService } from '@api/utils/app-base.service';
import { Project } from '@shared/entities/projects.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  IMapService,
  IMapServiceToken,
} from '@api/modules/countries/map/map-service.interface';

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
    @Inject(IMapServiceToken) public readonly projectMaps: IMapService,
  ) {
    super(projectRepository, 'project', 'projects');
  }
}
