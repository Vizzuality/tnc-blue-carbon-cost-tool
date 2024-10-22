import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseDataRepository } from '@api/modules/model/base-data.repository';
import { BaseData } from '@shared/entities/base-data.entity';
import { ConservationPlanningAndAdmin } from '@shared/entities/conservation-and-planning-admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BaseData])],
  providers: [BaseDataRepository],
  exports: [BaseDataRepository],
})
export class ModelModule {}
