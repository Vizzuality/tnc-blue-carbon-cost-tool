import { MethodologyService } from '@api/modules/methodology/methodology.service';
import { MethodologyController } from '@api/modules/methodology/methodology.controller';
import { MethodologyRepository } from '@api/modules/methodology/methodology.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature()],
  controllers: [MethodologyController],
  providers: [MethodologyRepository, MethodologyService],
})
export class MethodologyModule {}
