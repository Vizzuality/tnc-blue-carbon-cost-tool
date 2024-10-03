import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseData } from '@api/modules/data/ecosystem-data.entity';
import { BaseDataRepository } from '@api/modules/data/ecosystem-data.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BaseData])],
  providers: [BaseDataRepository],
  exports: [BaseDataRepository],
})
export class DataModule {}
