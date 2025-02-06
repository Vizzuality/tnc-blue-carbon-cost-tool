import { MethodologySourcesService } from '@api/modules/methodology/methodology-sources.service';
import { MethodologyController } from '@api/modules/methodology/methodology.controller';
import { MethodologySourcesRepository } from '@api/modules/methodology/methodology.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature()],
  controllers: [MethodologyController],
  providers: [MethodologySourcesRepository, MethodologySourcesService],
})
export class MethodologyModule {}
