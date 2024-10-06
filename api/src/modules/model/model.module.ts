import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseData } from '@api/modules/model/base-data.entity';
import { BaseDataRepository } from '@api/modules/model/base-data.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BaseData])],
  providers: [BaseDataRepository],
  exports: [BaseDataRepository],
})
export class ModelModule {}
