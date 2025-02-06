import { MethodologySourcesService } from '@api/modules/methodology/methodology-sources.service';
import { MethodologyController } from '@api/modules/methodology/methodology.controller';
import { MethodologyRepository } from '@api/modules/methodology/methodology.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature()],
  controllers: [MethodologyController],
  providers: [MethodologyRepository, MethodologySourcesService],
})
export class MethodologyModule {}
