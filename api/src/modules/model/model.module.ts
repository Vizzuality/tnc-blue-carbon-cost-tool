import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseDataRepository } from '@api/modules/model/base-data.repository';
import { BaseData } from '@shared/entities/base-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BaseData])],
  providers: [BaseDataRepository],
  exports: [BaseDataRepository],
})
export class ModelModule {}
