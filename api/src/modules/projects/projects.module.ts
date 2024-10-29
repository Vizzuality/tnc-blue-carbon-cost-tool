import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '@shared/entities/projects.entity';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { CountriesModule } from '@api/modules/countries/countries.module';
import { ProjectsMapService } from '@api/modules/projects/projects-map/projects-map.service';
import { IMapServiceToken } from '@api/modules/countries/map/map-service.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Project]), CountriesModule],
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    { provide: IMapServiceToken, useClass: ProjectsMapService },
  ],
})
export class ProjectsModule {}
