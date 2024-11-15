import { Module } from '@nestjs/common';
import { CustomProjectsService } from '@api/modules/custom-projects/custom-projects.service';
import { CountriesModule } from '@api/modules/countries/countries.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomProject } from '@shared/entities/custom-project.entity';
import { CustomProjectsController } from './custom-projects.controller';
import { CalculationsModule } from '@api/modules/calculations/calculations.module';
import { CustomProjectInputFactory } from '@api/modules/custom-projects/input-factory/custom-project-input.factory';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomProject]),
    CountriesModule,
    CalculationsModule,
  ],
  providers: [CustomProjectsService, CustomProjectInputFactory],
  controllers: [CustomProjectsController],
})
export class CustomProjectsModule {}
