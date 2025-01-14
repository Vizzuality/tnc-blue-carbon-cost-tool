import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '@shared/entities/projects.entity';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { CountriesModule } from '@api/modules/countries/countries.module';
import { ProjectsMapRepository } from '@api/modules/projects/projects-map.repository';
import { ProjectScorecardView } from '@shared/entities/project-scorecard.view';
import { ProjectsScorecardService } from './projects-scorecard.service';
import { ProjectsKeyCostsService } from '@api/modules/projects/projects-key-costs.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([Project, ProjectScorecardView]),
    CountriesModule,
  ],
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    ProjectsMapRepository,
    ProjectsScorecardService,
    ProjectsKeyCostsService,
  ],
})
export class ProjectsModule {}
