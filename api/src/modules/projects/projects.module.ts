import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '@shared/entities/projects.entity';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { CountriesModule } from '@api/modules/countries/countries.module';
import { ProjectsMapRepository } from '@api/modules/projects/projects-map.repository';
import { ProjectScorecardView } from '@shared/entities/project-scorecard.view';
import { ProjectsScorecardService } from './projects-scorecard.service';
import { CalculationsModule } from '@api/modules/calculations/calculations.module';
import { ProjectsCalculationService } from '@api/modules/projects/projects-calculation.service';
import { CustomProjectsModule } from '@api/modules/custom-projects/custom-projects.module';
import { ProjectScorecard } from '@shared/entities/project-scorecard.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Project, ProjectScorecardView, ProjectScorecard]),
    CountriesModule,
    CalculationsModule,
    CustomProjectsModule,
  ],
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    ProjectsMapRepository,
    ProjectsScorecardService,
    ProjectsCalculationService,
  ],
  exports: [ProjectsService],
})
export class ProjectsModule {}
