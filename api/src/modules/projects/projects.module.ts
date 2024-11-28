import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '@shared/entities/projects.entity';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { CountriesModule } from '@api/modules/countries/countries.module';
import { ProjectsMapRepository } from '@api/modules/projects/projects-map.repository';
import { ProjectsScorecardRepository } from '@api/modules/projects/projects-scorecard.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Project]), CountriesModule],
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    ProjectsMapRepository,
    ProjectsScorecardRepository,
  ],
})
export class ProjectsModule {}
