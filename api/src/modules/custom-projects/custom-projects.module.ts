import { Module } from '@nestjs/common';
import { CustomProjectsService } from '@api/modules/custom-projects/custom-projects.service';
import { CountriesModule } from '@api/modules/countries/countries.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomProject } from '@shared/entities/custom-project.entity';
import { CustomProjectsController } from './custom-projects.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CustomProject]), CountriesModule],
  providers: [CustomProjectsService],
  controllers: [CustomProjectsController],
})
export class CustomProjectsModule {}
