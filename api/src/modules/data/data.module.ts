import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EcosystemProject } from '@api/modules/data/ecosystem-data.entity';
import { EcoSystemDataRepository } from '@api/modules/data/ecosystem-data.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EcosystemProject])],
  providers: [EcoSystemDataRepository],
})
export class DataModule {}
