import { Module } from '@nestjs/common';
import { CustomProjectsService } from '@api/modules/custom-projects/custom-projects.service';
import { CountriesModule } from '@api/modules/countries/countries.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomProject } from '@shared/entities/custom-project.entity';
import { CustomProjectsController } from './custom-projects.controller';
import { CalculationsModule } from '@api/modules/calculations/calculations.module';
import { CustomProjectFactory } from '@api/modules/custom-projects/custom-project.factory';
import { CreateCustomProjectValidator } from '@api/modules/custom-projects/validation/create-custom-project.validator';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomProject]),
    CountriesModule,
    CalculationsModule,
  ],
  providers: [
    CustomProjectsService,
    CustomProjectFactory,
    CreateCustomProjectValidator,
  ],
  controllers: [CustomProjectsController],
})
export class CustomProjectsModule {}
