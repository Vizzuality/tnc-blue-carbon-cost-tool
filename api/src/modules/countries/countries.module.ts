import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountriesController } from '@api/modules/countries/countries.controller';
import { MapController } from './map/map.controller';
import { MapRepository } from '@api/modules/countries/map/map.repository';
import { Country } from '@shared/entities/country.entity';
import { CountriesService } from './countries.service';

@Module({
  imports: [TypeOrmModule.forFeature([Country])],
  controllers: [CountriesController, MapController],
  providers: [MapRepository, CountriesService],
  exports: [MapRepository, CountriesService],
})
export class CountriesModule {}
