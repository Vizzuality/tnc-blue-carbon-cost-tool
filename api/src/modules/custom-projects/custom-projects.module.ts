import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomProject } from '@shared/entities/custom-projects.entity';
import { CustomProjectsController } from './custom-projects.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CustomProject])],
  controllers: [CustomProjectsController],
})
export class CustomProjectsModule {}
